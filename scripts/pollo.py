import json
import logging
import re
import time
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse

import pandas as pd
import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)

BASE_URL = "https://pollo.ai"
# (lang_label, url_prefix) —— 英文页面没有前缀，所以使用空字符串
LANGUAGES: List[Tuple[str, str]] = [
    ("zh", "zh"),
    ("en", ""),
    ("fr", "fr"),
    ("it", "it"),
    ("th", "th"),
    ("ko", "ko"),
    ("ru", "ru"),
    ("ar", "ar"),
    ("es", "es"),
    ("pt", "pt"),
    ("ja", "ja"),
    ("pl", "pl"),
    ("de", "de"),
    ("da", "da"),
    ("nb", "nb"),
    ("id", "id"),
    ("tr", "tr"),
]
ENDPOINTS = ["tool", "image-tools", "image-generators"]
REQUEST_TIMEOUT = 20
RETRY_DELAY = 1.0


def create_http_session() -> requests.Session:
    """
    创建一个带有合理默认头部的 requests 会话，尽量模拟真实浏览器。
    """
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/127.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        }
    )
    return session


def _build_language_strip_pattern(languages: List[Tuple[str, str]]) -> re.Pattern:
    """
    构建用于剥离多语言路径前缀的正则表达式。
    """
    prefixes = [prefix for _, prefix in languages if prefix]
    if not prefixes:
        return None
    pattern = r"^/(" + "|".join(re.escape(prefix) for prefix in prefixes) + r")"
    return re.compile(pattern)


def fetch_page_html(session: requests.Session, page_url: str) -> str:
    """
    拉取页面 HTML。失败时抛出异常。
    """
    response = session.get(page_url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.text


def fetch_next_build_id(
    session: requests.Session, fallback_endpoint: str
) -> Tuple[Optional[str], Optional[dict]]:
    """
    获取 Next.js 构建 ID，顺便返回首次抓到的 __NEXT_DATA__。
    """
    page_url = f"{BASE_URL}/app/{fallback_endpoint}"
    try:
        html = fetch_page_html(session, page_url)
    except requests.RequestException as exc:
        logging.warning("无法获取构建 ID，访问 %s 失败: %s", page_url, exc)
        return None, None

    soup = BeautifulSoup(html, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__")
    if not script_tag or not script_tag.string:
        logging.debug("页面 %s 没有找到 __NEXT_DATA__ 脚本。", page_url)
        return None, None

    try:
        next_data = json.loads(script_tag.string)
    except json.JSONDecodeError as exc:
        logging.debug("__NEXT_DATA__ JSON 解析失败: %s", exc)
        return None, None

    build_id = next_data.get("buildId")
    return build_id, next_data


def fetch_endpoint_json(
    session: requests.Session, build_id: Optional[str], lang_prefix: str, endpoint: str
) -> Optional[dict]:
    """
    根据构建 ID 尝试直接抓取 Next.js 的 JSON 数据。
    """
    if not build_id:
        return None

    candidate_paths = []
    if lang_prefix:
        candidate_paths.append(f"/_next/data/{build_id}/{lang_prefix}/app/{endpoint}.json")
    else:
        candidate_paths.append(f"/_next/data/{build_id}/app/{endpoint}.json")
        # Next.js i18n 默认语言也可能保留路径前缀
        candidate_paths.append(f"/_next/data/{build_id}/en/app/{endpoint}.json")

    for data_path in candidate_paths:
        data_url = urljoin(BASE_URL, data_path)
        try:
            response = session.get(data_url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as exc:
            logging.debug("获取 %s 的 JSON 失败: %s", data_url, exc)
        except ValueError as exc:
            logging.debug("解析 %s 的 JSON 失败: %s", data_url, exc)
    return None


def _normalize_slug(slug: str, endpoint: str) -> Optional[str]:
    """
    将各种 slug/url 规范化成 /app/{endpoint}/xxx 形式，便于汇总。
    """
    if not slug or not isinstance(slug, str):
        return None

    slug = slug.strip()
    if not slug:
        return None

    if slug.startswith("http"):
        slug_path = urlparse(slug).path
    else:
        slug_path = slug

    if not slug_path.startswith("/"):
        slug_path = f"/{slug_path.lstrip('/')}"

    if slug_path.startswith("/app/"):
        normalized = slug_path
    else:
        normalized = f"/app/{endpoint}/{slug_path.lstrip('/')}"

    normalized = re.sub(r"/{2,}", "/", normalized).rstrip("/") or normalized

    if normalized in {f"/app/{endpoint}", "/app"}:
        # 忽略列表页面自身
        return None

    return normalized


TITLE_KEYS = {
    "title",
    "name",
    "label",
    "caption",
    "headline",
    "heading",
    "text",
    "displayName",
    "titleText",
    "toolName",
}
SLUG_KEYS = {
    "slug",
    "href",
    "link",
    "url",
    "permalink",
    "path",
    "to",
    "canonical",
    "relativeUrl",
    "ctaUrl",
    "actionUrl",
}
PREFIX_KEYS = {
    "slugPrefix",
    "hrefPrefix",
    "urlPrefix",
    "pathPrefix",
    "prefix",
    "basePath",
    "baseUrl",
}


def _extract_slug(value) -> Optional[str]:
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        pathname = value.get("pathname")
        query = value.get("query")
        if isinstance(pathname, str) and isinstance(query, dict):
            slug = pathname
            for key, q_val in query.items():
                replacement = None
                if isinstance(q_val, str):
                    replacement = q_val
                elif isinstance(q_val, list) and q_val and isinstance(q_val[0], str):
                    replacement = q_val[0]
                elif isinstance(q_val, dict):
                    replacement = q_val.get("value") or q_val.get("slug") or q_val.get("current")
                if isinstance(replacement, str):
                    slug = slug.replace(f"[{key}]", replacement)
            return slug
        for key in ("current", "slug", "href", "url", "pathname", "path"):
            nested = value.get(key)
            if isinstance(nested, str):
                return nested
    return None


def _extract_title(value) -> Optional[str]:
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        for key in ("en", "zh", "value", "text", "display", "default"):
            nested = value.get(key)
            if isinstance(nested, str):
                return nested
    return None


def _normalize_with_prefix(slug: str, endpoint: str, prefix_stack: List[str]) -> Optional[str]:
    slug = slug.strip()
    if not slug:
        return None

    candidates = [slug]
    for prefix in reversed(prefix_stack):
        if not prefix:
            continue
        prefix_clean = prefix.rstrip("/")
        if not prefix_clean:
            continue
        merged = f"{prefix_clean}/{slug.lstrip('/')}"
        candidates.append(merged)

    for candidate in candidates:
        normalized = _normalize_slug(candidate, endpoint)
        if normalized:
            return normalized
    return _normalize_slug(slug, endpoint)


def extract_keywords_from_json(data: dict, endpoint: str) -> Dict[str, str]:
    """
    遍历 Next.js JSON，提取 slug/title 组合。
    使用上下文传播标题以提高命中率。
    """
    results: Dict[str, str] = {}

    def traverse(
        node,
        context_title: Optional[str] = None,
        prefix_stack: Optional[List[str]] = None,
    ):
        if isinstance(node, dict):
            prefix_stack = prefix_stack[:] if prefix_stack else []
            local_title = context_title
            local_slugs: List[str] = []

            for key, value in node.items():
                if key in PREFIX_KEYS:
                    prefix_val = _extract_slug(value) if isinstance(value, (dict, str)) else None
                    if prefix_val:
                        prefix_stack.append(prefix_val)
                        continue
                    if isinstance(value, str):
                        prefix_stack.append(value)
                        continue
                if key in TITLE_KEYS:
                    title = _extract_title(value)
                    if title:
                        local_title = title.strip() or local_title

            for key, value in node.items():
                if key in SLUG_KEYS:
                    slug_value = _extract_slug(value)
                    if slug_value:
                        local_slugs.append(slug_value.strip())

            if local_title and local_slugs:
                for slug in local_slugs:
                    normalized = _normalize_with_prefix(slug, endpoint, prefix_stack)
                    if normalized:
                        results.setdefault(normalized, local_title)

            for value in node.values():
                traverse(value, local_title, prefix_stack)

        elif isinstance(node, list):
            for item in node:
                traverse(item, context_title, prefix_stack)

    traverse(data)
    return results


def extract_keywords_from_html(
    html: str,
    languages: List[Tuple[str, str]],
    endpoint: str,
) -> Dict[str, str]:
    """
    退化方案：直接解析 HTML 中的链接文字。
    """
    soup = BeautifulSoup(html, "html.parser")
    tool_links = soup.find_all("a", href=True)
    strip_pattern = _build_language_strip_pattern(languages)
    keyword_map: Dict[str, str] = {}

    for link in tool_links:
        href = link.get("href")
        if not href:
            continue
        absolute_href = urljoin(BASE_URL, href)
        parsed_href = urlparse(absolute_href)
        if parsed_href.netloc != urlparse(BASE_URL).netloc:
            continue

        path = parsed_href.path
        if strip_pattern:
            path = strip_pattern.sub("", path)
        path = re.sub(r"/{2,}", "/", path).rstrip("/") or path

        if not path.startswith(f"/app/{endpoint}/"):
            continue

        text = link.get_text(separator=" ", strip=True)
        if not text:
            continue

        keyword_map.setdefault(path, text)

    return keyword_map


def parse_next_data(html: str) -> Optional[dict]:
    """
    提取页面内嵌的 __NEXT_DATA__ JSON。
    """
    soup = BeautifulSoup(html, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__")
    if not script_tag or not script_tag.string:
        return None

    try:
        return json.loads(script_tag.string)
    except json.JSONDecodeError:
        return None


def extract_keywords_from_next_data(html: str, endpoint: str) -> Dict[str, str]:
    """
    解析页面内嵌的 __NEXT_DATA__ JSON。
    """
    data = parse_next_data(html)
    if not data:
        return {}

    return extract_keywords_from_json(data, endpoint)


def scrape_endpoint(
    session: requests.Session,
    languages: List[Tuple[str, str]],
    endpoint: str,
    build_id: Optional[str],
) -> Dict[str, Dict[str, str]]:
    """
    爬取指定 endpoint 的多语言关键词。优先使用 Next.js JSON，失败再解析 HTML。
    """
    keyword_map: Dict[str, Dict[str, str]] = {}

    for index, (lang_key, lang_prefix) in enumerate(languages, start=1):
        if lang_prefix:
            page_url = f"{BASE_URL}/{lang_prefix}/app/{endpoint}"
        else:
            page_url = f"{BASE_URL}/app/{endpoint}"

        logging.info(
            "--- 正在处理 (%d/%d) [Language: %s]: %s",
            index,
            len(languages),
            lang_key,
            page_url,
        )

        data = fetch_endpoint_json(session, build_id, lang_prefix, endpoint)
        translations = extract_keywords_from_json(data, endpoint) if data else {}

        if not translations:
            logging.debug("JSON 中没有找到 %s 的数据，回退到解析 HTML。", page_url)
            try:
                html = fetch_page_html(session, page_url)
            except requests.RequestException as exc:
                logging.warning("加载 %s 时发生错误: %s", page_url, exc)
                time.sleep(RETRY_DELAY)
                continue
            data_from_html = parse_next_data(html)
            if data_from_html:
                if index == 1:
                    logging.info(
                        "NEXT_DATA page=%s query=%s",
                        data_from_html.get("page"),
                        data_from_html.get("query"),
                    )
                    page_props = (
                        data_from_html.get("props", {}).get("pageProps")
                        if isinstance(data_from_html.get("props"), dict)
                        else None
                    )
                    if page_props and isinstance(page_props, dict):
                        logging.info(
                            "pageProps keys: %s",
                            list(page_props.keys())[:10],
                        )
                translations = extract_keywords_from_json(data_from_html, endpoint)
            else:
                translations = {}

            if not translations:
                translations = extract_keywords_from_html(html, languages, endpoint)

        if not translations:
            logging.warning("未能在 %s 找到任何关键词。", page_url)
            time.sleep(RETRY_DELAY)
            continue

        for path, keyword in translations.items():
            keyword_map.setdefault(path, {})
            keyword_map[path][lang_key] = keyword

        logging.info("在 %s 找到 %d 条关键词。", page_url, len(translations))
        time.sleep(RETRY_DELAY)

    return keyword_map


def scrape_all_endpoints(
    languages: List[Tuple[str, str]],
    endpoints: List[str],
) -> Dict[str, Dict[str, Dict[str, str]]]:
    """
    遍历所有 endpoint 并返回多语言关键词映射。
    """
    session = create_http_session()
    build_id, _ = fetch_next_build_id(session, endpoints[0])
    if build_id:
        logging.info("检测到 Next.js buildId: %s", build_id)
    else:
        logging.info("未能获取 buildId，将直接解析 HTML。")
    all_results: Dict[str, Dict[str, Dict[str, str]]] = {}

    for endpoint in endpoints:
        logging.info("==== 开始爬取 endpoint: %s ====", endpoint)
        endpoint_map = scrape_endpoint(session, languages, endpoint, build_id)
        all_results[endpoint] = endpoint_map
        logging.info("==== 完成 endpoint: %s (%d 条记录) ====", endpoint, len(endpoint_map))
        time.sleep(1)

    return all_results


def save_to_excel_wide(
    keyword_maps: Dict[str, Dict[str, Dict[str, str]]],
    languages: List[Tuple[str, str]],
    filename: str = "pollo_ai_keyword_map.xlsx",
) -> None:
    """
    将所有 endpoint 的关键词保存为宽格式 Excel，按语言拆分列。
    """
    rows: List[Dict[str, str]] = []

    for endpoint, endpoint_map in keyword_maps.items():
        if not endpoint_map:
            continue
        for url_key, translations in endpoint_map.items():
            row = {"Endpoint": endpoint, "URL_Key": url_key}
            row.update(translations)
            rows.append(row)

    if not rows:
        logging.warning("没有可保存的数据，Excel 文件未生成。")
        return

    df = pd.DataFrame(rows)
    df.sort_values(by=["Endpoint", "URL_Key"], inplace=True)

    preferred_cols = ["Endpoint", "URL_Key", "zh", "en"]
    language_order = [lang for lang, _ in languages if lang not in ("zh", "en")]

    other_cols = [col for col in language_order if col in df.columns]
    final_cols = [col for col in preferred_cols if col in df.columns] + other_cols
    df = df[final_cols]

    try:
        df.to_excel(filename, index=False, engine="openpyxl")
        logging.info("成功将关键词映射保存到: %s", filename)
    except ImportError:
        logging.error("保存 Excel 失败，请先安装依赖: pip install pandas openpyxl")
    except Exception as exc:
        logging.error("保存 Excel 文件时发生错误: %s", exc)


if __name__ == "__main__":
    logging.info("开始爬取多语言关键词...")
    result_maps = scrape_all_endpoints(LANGUAGES, ENDPOINTS)
    output_filename = "pollo_ai_all_endpoints_keyword_map.xlsx"
    save_to_excel_wide(result_maps, LANGUAGES, filename=output_filename)

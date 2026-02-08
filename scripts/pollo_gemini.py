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
        }
    )
    return session


def fetch_page_html(session: requests.Session, page_url: str) -> str:
    """
    拉取页面 HTML。失败时抛出异常。
    """
    response = session.get(page_url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.text


def _normalize_slug(slug: str, endpoint: str) -> Optional[str]:
    """
    将各种 slug/url 规范化成 /app/{endpoint}/xxx 形式，便于汇总。
    """
    if not slug or not isinstance(slug, str):
        return None

    slug = slug.strip().lstrip("/")
    if not slug:
        return None

    slug_path = urlparse(slug).path
    normalized = f"/app/{endpoint}/{slug_path.lstrip('/')}"
    normalized = re.sub(r"/{2,}", "/", normalized).rstrip("/")

    if normalized == f"/app/{endpoint}":
        return None

    return normalized


def extract_keywords_from_pollo_json(data: dict, endpoint: str) -> Dict[str, str]:
    """
    从包含了页面数据的 __NEXT_DATA__ JSON 中提取关键词。
    """
    results: Dict[str, str] = {}
    try:
        page_props = data.get("props", {}).get("pageProps", {})
        page_data = page_props.get("pageData", {})
        tool_groups = page_data.get("list", [])

        if not tool_groups:
            logging.debug("在 JSON 结构 props.pageProps.pageData.list 中未找到工具列表。")
            return results

        all_tools = []
        for group in tool_groups:
            if 'children' in group and isinstance(group.get('children'), list):
                all_tools.extend(group['children'])
            elif 'slug' in group and 'name' in group:
                all_tools.append(group)

        for tool in all_tools:
            if isinstance(tool, dict):
                slug = tool.get("slug")
                name = tool.get("name")
                if slug and name:
                    normalized_path = _normalize_slug(slug, endpoint)
                    if normalized_path:
                        results[normalized_path] = str(name).strip()

    except Exception as e:
        logging.error("解析 pollo.ai 的 JSON 结构时发生意外错误: %s", e)
    return results

# --- 这是被彻底重写的核心抓取函数 ---
def scrape_endpoint(
    session: requests.Session,
    languages: List[Tuple[str, str]],
    endpoint: str,
) -> Dict[str, Dict[str, str]]:
    """
    爬取指定 endpoint 的多语言关键词。
    新策略：直接请求每个页面的HTML，并从其内置的 __NEXT_DATA__ 脚本中解析数据。
    """
    keyword_map: Dict[str, Dict[str, str]] = {}

    for index, (lang_key, lang_prefix) in enumerate(languages, start=1):
        page_url = f"{BASE_URL}/{lang_prefix}/app/{endpoint}" if lang_prefix else f"{BASE_URL}/app/{endpoint}"

        logging.info(
            "--- 正在处理 (%d/%d) [Language: %s]: %s",
            index,
            len(languages),
            lang_key,
            page_url,
        )

        try:
            html = fetch_page_html(session, page_url)
            soup = BeautifulSoup(html, "html.parser")
            script_tag = soup.find("script", id="__NEXT_DATA__")

            if not script_tag or not script_tag.string:
                logging.warning("未能在 %s 的 HTML 中找到 __NEXT_DATA__ 脚本。", page_url)
                time.sleep(RETRY_DELAY)
                continue

            next_data = json.loads(script_tag.string)
            translations = extract_keywords_from_pollo_json(next_data, endpoint)

            if not translations:
                logging.warning("在 %s 的 __NEXT_DATA__ 中未提取到任何关键词。", page_url)
                time.sleep(RETRY_DELAY)
                continue

            for path, keyword in translations.items():
                keyword_map.setdefault(path, {})
                keyword_map[path][lang_key] = keyword

            logging.info("在 %s 找到 %d 条关键词。", page_url, len(translations))

        except requests.RequestException as exc:
            logging.warning("加载 %s 时发生错误: %s", page_url, exc)
        except json.JSONDecodeError as exc:
            logging.warning("解析 %s 的 __NEXT_DATA__ JSON 失败: %s", page_url, exc)

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
    all_results: Dict[str, Dict[str, Dict[str, str]]] = {}

    for endpoint in endpoints:
        logging.info("==== 开始爬取 endpoint: %s ====", endpoint)
        endpoint_map = scrape_endpoint(session, languages, endpoint)
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

    lang_cols_order = [lang for lang, _ in languages]
    final_cols_order = ["Endpoint", "URL_Key"] + lang_cols_order
    existing_cols = [col for col in final_cols_order if col in df.columns]

    df = df[existing_cols]

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

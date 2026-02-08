import csv
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, List

import requests
import urllib.parse


CACHE_PATH = Path(os.environ.get("TRANSLATE_CACHE", "data/translate_cache.json"))
MAX_WORKERS = int(os.environ.get("TRANSLATE_WORKERS", "8"))


def detect_encoding(path: Path) -> str:
    # Try UTF-16 first (file shows NUL bytes), then UTF-8-SIG, then UTF-8
    for enc in ("utf-16", "utf-8-sig", "utf-8"):
        try:
            with path.open("r", encoding=enc) as f:
                f.read(1024)
            return enc
        except Exception:
            continue
    # Fallback
    return "utf-8"

def translate_batch_googletrans(texts: List[str], dest: str = "zh-cn") -> List[str]:
    from googletrans import Translator  # type: ignore

    translator = Translator()
    # googletrans can translate list directly
    results = translator.translate(texts, dest=dest)  # auto-detect source
    # results may be a single object if length==1
    if not isinstance(results, list):
        results = [results]
    return [r.text for r in results]


def translate_google_public(text: str, target: str = "zh-CN") -> str:
    # Unofficial Google endpoint, no key, good reliability
    base = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "auto",
        "tl": target,
        "dt": "t",
        "q": text,
    }
    headers = {
        "User-Agent": "Mozilla/5.0",
    }
    url = f"{base}?{urllib.parse.urlencode(params)}"
    try:
        r = requests.get(url, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        return data[0][0][0]
    except Exception:
        return ""


def load_cache() -> Dict[str, str]:
    if CACHE_PATH.exists():
        try:
            return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_cache(cache: Dict[str, str]) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = CACHE_PATH.with_suffix(CACHE_PATH.suffix + ".tmp")
    tmp.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    tmp.replace(CACHE_PATH)


def parallel_google_public(texts: List[str], max_workers: int) -> Dict[str, str]:
    results: Dict[str, str] = {}
    if not texts:
        return results

    def worker(txt: str) -> (str, str):
        val = translate_google_public(txt)
        if not val:
            time.sleep(0.2)
            val = translate_google_public(txt)
        return txt, val

    with ThreadPoolExecutor(max_workers=max(1, max_workers)) as ex:
        futures = {ex.submit(worker, t): t for t in texts}
        for fut in as_completed(futures):
            txt, val = fut.result()
            results[txt] = val
    return results


def translate_batch_mymemory(texts: List[str], src: str = "portuguese", dest: str = "chinese simplified") -> List[str]:
    # Fallback via deep_translator MyMemory
    from deep_translator import MyMemoryTranslator  # type: ignore

    t = MyMemoryTranslator(source=src, target=dest)
    outs = []
    for t_ in texts:
        try:
            outs.append(t.translate(t_))
        except Exception:
            outs.append("")
        time.sleep(0.2)  # be gentle
    return outs


def translate_batch_libre(texts: List[str], src: str = "pt", dest: str = "zh") -> List[str]:
    from deep_translator import LibreTranslator  # type: ignore

    outs = []
    # Try two common public endpoints
    endpoints = [
        "https://translate.astian.org/",
        "https://libretranslate.com/",
    ]
    for t_ in texts:
        translated = ""
        for base in endpoints:
            try:
                lt = LibreTranslator(source=src, target=dest, base_url=base)
                translated = lt.translate(t_)
                if translated:
                    break
            except Exception:
                continue
        outs.append(translated)
        time.sleep(0.1)
    return outs


def translate_texts(texts: List[str], cache: Dict[str, str], max_workers: int = MAX_WORKERS) -> List[str]:
    cleaned = [t.strip() for t in texts]
    missing = [t for t in cleaned if t and t not in cache]

    if missing:
        try:
            newly = parallel_google_public(missing, max_workers)
        except Exception:
            newly = {}
        for k, v in newly.items():
            if v:
                cache[k] = v

        still = [t for t in missing if not cache.get(t)]
        if still:
            try:
                gt_res = translate_batch_googletrans(still, dest="zh-cn")
            except Exception:
                gt_res = [""] * len(still)
            for term, val in zip(still, gt_res):
                if val:
                    cache[term] = val

        still = [t for t in missing if not cache.get(t)]
        if still:
            try:
                lib_res = translate_batch_libre(still, src="pt", dest="zh")
            except Exception:
                lib_res = [""] * len(still)
            for term, val in zip(still, lib_res):
                if val:
                    cache[term] = val

        still = [t for t in missing if not cache.get(t)]
        if still:
            mm_res = translate_batch_mymemory(still, src="portuguese", dest="chinese simplified")
            for term, val in zip(still, mm_res):
                if val:
                    cache[term] = val

        save_cache(cache)

    return [cache.get(t, "") for t in cleaned]


def process_csv(in_path: Path, out_path: Path, cache: Dict[str, str]) -> None:
    enc = detect_encoding(in_path)
    # Peek first line to decide delimiter
    with in_path.open("r", encoding=enc, newline="") as rf:
        first_line = rf.readline()
    delim = "\t" if "\t" in first_line else ","
    with in_path.open("r", encoding=enc, newline="") as rf:
        reader = csv.reader(rf, delimiter=delim)
        rows = list(reader)

    if not rows:
        raise SystemExit("CSV is empty")

    header = rows[0]
    # If the file was mis-parsed into a single column, try splitting manually by tab
    if len(header) == 1 and "\t" in header[0]:
        header = header[0].split("\t")
    # Normalize header names for lookup
    norm = [h.strip().strip("\ufeff").strip('"').lower() for h in header]
    kw_idx = -1
    for cand in ("keyword", "keywords", "palavra-chave", "termo"):
        if cand in norm:
            kw_idx = norm.index(cand)
            break
    if kw_idx == -1:
        raise SystemExit(f"Could not find Keyword column in header: {header}")

    # Insert new column header at index 2 (third column, 1-based)
    new_header = header[:2] + ["中文释义"] + header[2:]

    # Collect keywords from data rows
    data_rows = rows[1:]
    # If rows are single field lines, split by detected delimiter
    if delim == "\t":
        fixed = []
        for r in data_rows:
            if len(r) == 1 and "\t" in r[0]:
                fixed.append(r[0].split("\t"))
            else:
                fixed.append(r)
        data_rows = fixed
    keywords: List[str] = []
    for r in data_rows:
        if kw_idx < len(r):
            raw = r[kw_idx]
        else:
            raw = ""
        kw = str(raw).strip() if raw is not None else ""
        keywords.append(kw)

    # Deduplicate to reduce API calls
    uniq_list: List[str] = []
    seen: Dict[str, int] = {}
    for k in keywords:
        key = k.strip()
        if not key:
            continue
        if key not in seen:
            seen[key] = len(uniq_list)
            uniq_list.append(key)

    translations = translate_texts(uniq_list, cache, MAX_WORKERS)
    # Map back
    trans_map = {k: v for k, v in zip(uniq_list, translations)}

    # Build output rows with insertion at third column
    out_rows: List[List[str]] = [new_header]
    for r, kw in zip(data_rows, keywords):
        cn = trans_map.get(kw, "")
        new_row = r[:2] + [cn] + r[2:]
        out_rows.append(new_row)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    # Write in UTF-8 with BOM for Excel compatibility
    with out_path.open("w", encoding="utf-8-sig", newline="") as wf:
        writer = csv.writer(wf)
        writer.writerows(out_rows)


def main(argv: List[str]) -> None:
    if len(argv) < 2:
        print("Usage: python scripts/translate_keywords_csv.py <input_csv> [<output_csv>]")
        sys.exit(1)
    in_path = Path(argv[1])
    if len(argv) >= 3:
        out_path = Path(argv[2])
    else:
        out_path = in_path.with_name(in_path.stem + "_with_cn.csv")
    cache = load_cache()
    process_csv(in_path, out_path, cache)


if __name__ == "__main__":
    main(sys.argv)

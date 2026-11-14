#!/usr/bin/env python3
"""AEO/SEO page checker: deterministic, free (plain HTTP + HTML parsing, no JS, no paid calls).

Usage:
  python3 page_check.py URL [--topic "rate limiting"] [--json out.json]
  python3 page_check.py --file page.html --url URL --topic ...   # score a draft/preview build before merge

Scores the RAW server HTML (what most AI crawlers see; GPTBot/ClaudeBot/PerplexityBot do not run JS).
Total = 100 points. Each check is binary (0 or full) or graded (linear partial credit).
"""
import sys, re, json, time, argparse, urllib.parse, urllib.robotparser
import requests
from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (compatible; UnkeyAEOCheck/1.0)"
AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Googlebot"]
_cache = {}

def get(url, **kw):
    if url in _cache: return _cache[url]
    t = time.time()
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=20, allow_redirects=True, **kw)
    except requests.RequestException as e:
        r = None
    _cache[url] = (r, time.time() - t)
    return _cache[url]

def lin(x, lo, hi):
    """0 at lo, 1 at hi, clamped."""
    if hi == lo: return 1.0 if x >= hi else 0.0
    return max(0.0, min(1.0, (x - lo) / (hi - lo)))

def band(n, lo, hi, slack):
    """1 inside [lo,hi]; falls linearly to 0 at lo-slack / hi+slack."""
    if lo <= n <= hi: return 1.0
    d = lo - n if n < lo else n - hi
    return max(0.0, 1 - d / slack)

def visible_text(soup):
    s = BeautifulSoup(str(soup), "lxml")
    for t in s(["script", "style", "noscript", "svg", "template", "head"]): t.decompose()
    return re.sub(r"\s+", " ", s.get_text(" ")).strip()

def check(url, html=None, topic=None, ttfb=None, status=None, headers=None):
    p = urllib.parse.urlparse(url); origin = f"{p.scheme}://{p.netloc}"
    if html is None:
        r, el = get(url)
        status = r.status_code if r is not None else 0
        html = r.text if r is not None else ""
        headers = dict(r.headers) if r is not None else {}
        ttfb = r.elapsed.total_seconds() if r is not None else 99
        redirects = len(r.history) if r is not None else 0
    else:
        redirects = 0; headers = headers or {}; status = status or 200
    soup = BeautifulSoup(html, "lxml")
    text = visible_text(soup); words = text.split()
    C = []  # (id, name, kind, weight, score0..1, detail)
    def add(i, name, kind, w, s, d): C.append(dict(id=i, check=name, kind=kind, weight=w, score=round(s, 3), points=round(w * s, 2), detail=d))

    # --- Access & indexability (30) ---
    add("http_200", "Returns 200 with <=1 redirect", "binary", 5, 1.0 if status == 200 and redirects <= 1 else 0.0, f"status {status}, redirects {redirects}")
    robots_meta = " ".join(m.get("content", "") for m in soup.find_all("meta", attrs={"name": re.compile("^(robots|googlebot)$", re.I)}))
    xr = headers.get("X-Robots-Tag", "") or headers.get("x-robots-tag", "")
    noindex = "noindex" in (robots_meta + " " + xr).lower()
    add("indexable", "No noindex (meta or X-Robots-Tag)", "binary", 5, 0.0 if noindex else 1.0, f"meta='{robots_meta}' header='{xr}'")
    rp = urllib.robotparser.RobotFileParser(); rr, _ = get(origin + "/robots.txt")
    rp.parse((rr.text if rr is not None and rr.status_code == 200 else "").splitlines())
    allowed = [b for b in AI_BOTS if rp.can_fetch(b, url)]
    add("ai_bots_allowed", f"robots.txt allows AI crawlers ({len(AI_BOTS)})", "graded", 8, len(allowed) / len(AI_BOTS), f"allowed: {len(allowed)}/{len(AI_BOTS)} blocked: {[b for b in AI_BOTS if b not in allowed]}")
    canon = soup.find("link", rel=lambda v: v and "canonical" in v)
    ch = canon.get("href", "").rstrip("/") if canon else ""
    final = (get(url)[0].url if html is not None and False else url).rstrip("/")
    add("canonical_self", "Canonical present and self-referencing", "binary", 4, 1.0 if ch and urllib.parse.urljoin(url, ch).rstrip("/") in (final, url.rstrip("/")) else 0.0, f"canonical={ch or None}")
    add("server_rendered", "Main content in raw HTML (>=300 words without JS)", "graded", 8, lin(len(words), 50, 300), f"{len(words)} words in raw HTML")

    # --- Metadata (15) ---
    title = (soup.title.get_text().strip() if soup.title else "")
    add("title_len", "Title 30-65 chars", "graded", 3, band(len(title), 30, 65, 30) if title else 0, f"{len(title)} chars: {title[:80]!r}")
    md = soup.find("meta", attrs={"name": re.compile("^description$", re.I)}); mdc = (md.get("content", "").strip() if md else "")
    add("meta_desc", "Meta description 70-160 chars", "graded", 3, band(len(mdc), 70, 160, 70) if mdc else 0, f"{len(mdc)} chars")
    og = [k for k in ("og:title", "og:description", "og:image") if soup.find("meta", attrs={"property": k})]
    add("open_graph", "OpenGraph title/description/image", "graded", 2, len(og) / 3, f"{og}")
    add("html_lang", "<html lang> set", "binary", 1, 1.0 if soup.html and soup.html.get("lang") else 0.0, f"lang={soup.html.get('lang') if soup.html else None}")
    types = set()
    for s in soup.find_all("script", type="application/ld+json"):
        try:
            d = json.loads(s.string or "")
        except Exception: continue
        stack = [d]
        while stack:
            o = stack.pop()
            if isinstance(o, list): stack += o
            elif isinstance(o, dict):
                t = o.get("@type"); types.update(t if isinstance(t, list) else [t] if t else [])
                stack += [v for v in o.values() if isinstance(v, (dict, list))]
    useful = {"Organization", "SoftwareApplication", "WebApplication", "Product", "FAQPage", "HowTo", "TechArticle", "Article", "BlogPosting", "BreadcrumbList", "WebPage", "Offer"}
    add("json_ld", "JSON-LD structured data (>=2 useful types)", "graded", 6, lin(len(types & useful), 0, 2), f"types={sorted(t for t in types if t)}")

    # --- Structure / extractability (30) ---
    h1 = soup.find_all("h1")
    add("one_h1", "Exactly one H1", "binary", 4, 1.0 if len(h1) == 1 else 0.0, f"{len(h1)} H1")
    levels = [int(h.name[1]) for h in soup.find_all(re.compile("^h[1-6]$"))]
    skips = sum(1 for a, b in zip(levels, levels[1:]) if b > a + 1)
    add("heading_order", "No skipped heading levels", "binary", 3, 1.0 if levels and skips == 0 else 0.0, f"{len(levels)} headings, {skips} skips")
    h23 = soup.find_all(["h2", "h3"])
    add("subheadings", ">=4 H2/H3 sections", "graded", 4, lin(len(h23), 0, 4), f"{len(h23)} H2/H3")
    qh = [h.get_text(" ", strip=True) for h in h23 if h.get_text(strip=True).endswith("?")] + [d.get_text(" ", strip=True)[:60] for d in soup.find_all("summary") if "?" in d.get_text()]
    add("question_headings", "Question-style headings / FAQ (>=3)", "graded", 5, lin(len(qh), 0, 3), f"{len(qh)} e.g. {qh[:3]}")
    lists = len(soup.find_all(["ul", "ol"])); tables = len(soup.find_all("table")); code = len(soup.find_all("pre"))
    add("extractable_blocks", "Lists/tables/code blocks (>=3)", "graded", 4, lin(lists + tables + code, 0, 3), f"lists {lists}, tables {tables}, code {code}")
    first = " ".join(words[:120]).lower()
    brand = "unkey" in first
    tw = [w for w in re.findall(r"[a-z0-9]+", (topic or "").lower()) if len(w) > 2]
    tops = (all(w in first for w in tw) if tw else True)
    add("answer_first", f"Brand + topic ({topic or 'n/a'}) in first 120 words", "graded", 6, (0.5 if brand else 0) + (0.5 if tops else 0), f"brand={brand} topic={tops}")
    imgs = soup.find_all("img"); alt = sum(1 for i in imgs if (i.get("alt") or "").strip())
    add("img_alt", "Images have alt text", "graded", 2, (alt / len(imgs)) if imgs else 1.0, f"{alt}/{len(imgs)}")
    dm = bool(re.search(r'"dateModified"|article:modified_time|datetime=', html)) or bool(headers.get("Last-Modified"))
    add("freshness", "Visible/structured modified date", "binary", 2, 1.0 if dm else 0.0, f"found={dm}")

    # --- Entity & citations (10) ---
    links = [urllib.parse.urljoin(url, a.get("href", "")) for a in soup.find_all("a", href=True)]
    internal = {l for l in links if urllib.parse.urlparse(l).netloc == p.netloc}
    external = {l for l in links if urllib.parse.urlparse(l).netloc not in ("", p.netloc)}
    add("internal_links", ">=10 internal links", "graded", 3, lin(len(internal), 0, 10), f"{len(internal)} unique")
    gh = any("github.com/unkeyed" in l for l in links)
    oss = "open source" in text.lower() or "open-source" in text.lower()
    add("oss_entity", "States 'open source' and links github.com/unkeyed", "graded", 4, (0.5 if oss else 0) + (0.5 if gh else 0), f"oss_text={oss} github_link={gh}")
    add("external_refs", ">=2 external references", "graded", 3, lin(len(external), 0, 2), f"{len(external)} unique external")

    # --- AI-specific discovery (15) ---
    lt, _ = get(origin + "/llms.txt")
    has_llms = lt is not None and lt.status_code == 200 and len(lt.text) > 50
    if has_llms and p.path.startswith("/docs/"):  # docs sections often publish their own llms.txt
        dl, _ = get(origin + "/docs/llms.txt")
        if dl is not None and dl.status_code == 200: lt = type("T", (), {"text": lt.text + "\n" + dl.text, "status_code": 200})()
    path = p.path.rstrip("/") or "/"
    u0 = url.rstrip("/")
    in_llms = has_llms and bool(re.search(re.escape(u0) + r"/?[)\s>\]]", lt.text) or (path != "/" and re.search(re.escape(path) + r"(\.md)?[)\s>\]]", lt.text)))
    add("llms_txt", "/llms.txt exists and lists this page", "graded", 4, (0.5 if has_llms else 0) + (0.5 if in_llms else 0), f"exists={has_llms} lists_page={in_llms}")
    mdu = (origin + "/index.md") if path == "/" else url.rstrip("/") + ".md"
    mdr, _ = get(mdu)
    has_md = mdr is not None and mdr.status_code == 200 and "<html" not in mdr.text[:500].lower()
    add("markdown_twin", "Markdown version at URL.md", "binary", 4, 1.0 if has_md else 0.0, f"{mdu} -> {mdr.status_code if mdr is not None else 'err'}")
    sm_urls = set()
    for smu in [origin + "/sitemap.xml", origin + "/sitemap-0.xml", origin + "/docs/sitemap.xml"]:
        s, _ = get(smu)
        if s is not None and s.status_code == 200: sm_urls |= {u.rstrip("/") for u in re.findall(r"<loc>([^<]+)</loc>", s.text)}
    add("in_sitemap", "Listed in sitemap", "binary", 4, 1.0 if url.rstrip("/") in sm_urls else 0.0, f"{len(sm_urls)} sitemap URLs checked")
    add("fast", "Fetch time < 1.0s", "binary", 3, 1.0 if (ttfb or 99) < 1.0 else 0.0, f"{ttfb:.2f}s" if ttfb else "n/a")

    total = round(sum(c["points"] for c in C), 1); maxp = sum(c["weight"] for c in C)
    return dict(url=url, topic=topic, score=total, max=maxp, checked_at=time.strftime("%Y-%m-%d %H:%M %Z"), checks=C)

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("url"); ap.add_argument("--topic"); ap.add_argument("--file"); ap.add_argument("--json")
    a = ap.parse_args()
    res = check(a.url, html=open(a.file).read() if a.file else None, topic=a.topic)
    print(f"{res['url']}  score {res['score']}/{res['max']}")
    for c in res["checks"]: print(f"  {c['points']:>5}/{c['weight']:<2} {c['kind']:<6} {c['check']:<52} {c['detail']}")
    if a.json: json.dump(res, open(a.json, "w"), indent=1)

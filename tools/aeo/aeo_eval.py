#!/usr/bin/env python3
"""AEO PR evaluation harness (in-context recommendation test + page_check gate).

Implements aeo-harness-proposal.md sections 2 and 3, as approved 2026-11-14:
  - per target query: A (no page) n=5, D_old (old P + 3 competitor pages) n=20, D_new n=20 on gpt-4.1-mini,
  - regression guard: off-target queries, D_old vs D_new n=5,
  - Claude confirmation: D_old vs D_new n=5 on up to 6 target queries,
  - deterministic parsing with the daily panel's brand list (config/brands.json, synced from analyze.py),
  - one-sided Fisher exact test + paired bootstrap, pre-registered pass rule,
  - page_check.py score delta (no binary check may go pass -> fail),
  - budget guard: abort if projected cost > $2.20/PR or month-to-date ledger + projection > $10.

All paid calls go over Treg's HTTP API:  POST https://treg.to/call/<endpoint-id>
  headers: X-Treg-Token (env TREG_API_TOKEN), Cache-Control: no-cache, Idempotency-Key, X-Treg-Route-Max-Cost, X-Treg-Meta
  body: a one-element JSON array (DataForSEO live routes); response: the provider body, unchanged;
  charge: response header X-Treg-Cost-Micro (integer micro-USD); id: X-Treg-Call-Id.

Usage:
  python3 aeo_eval.py --old OLD --new NEW --category rate-limiting --page-url URL [--dry-run]
OLD/NEW: a .mdx/.md/.html file, or an http(s) URL (a URL is read through its .md twin when one exists).
Dependencies: Python 3.9+, requests, beautifulsoup4, lxml (page_check only). No scipy.
"""
import argparse, datetime, hashlib, json, math, os, random, re, sys, time, uuid
import urllib.parse, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
try:
    from zoneinfo import ZoneInfo
    ET = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    ET = None
UA = "Mozilla/5.0 (compatible; UnkeyAEOEval/1.0)"


def now_et():
    return datetime.datetime.now(ET) if ET else datetime.datetime.now()


def jload(name):
    return json.load(open(os.path.join(HERE, "config", name)))


CFG = jload("harness.json")
QS = {int(k): v for k, v in jload("questions.json")["questions"].items()}
_B = jload("brands.json")
BRANDS, ALIAS = _B["brands"], _B["alias"]


# ----------------------------------------------------------------------------- page sources
def http_get(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/markdown,text/html;q=0.9,*/*;q=0.8"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Content-Type", ""), ""
    except Exception:
        return 0, "", ""


def html_to_md(html):
    """Main-content text from HTML, with headings and list items kept as markdown markers."""
    from bs4 import BeautifulSoup
    s = BeautifulSoup(html, "lxml")
    for t in s(["script", "style", "noscript", "svg", "template", "head", "nav", "footer", "header", "aside", "form"]):
        t.decompose()
    root = s.find("main") or s.find("article") or s.body or s
    out = []
    for el in root.find_all(["h1", "h2", "h3", "h4", "p", "li", "td", "pre", "blockquote"]):
        if el.find_parent(["li", "td", "pre", "blockquote"]) and el.name in ("p",):
            continue
        txt = re.sub(r"\s+", " ", el.get_text(" ", strip=True))
        if not txt:
            continue
        if el.name == "pre":
            out.append("```\n" + txt + "\n```")
        elif el.name[0] == "h":
            out.append("#" * int(el.name[1]) + " " + txt)
        elif el.name == "li":
            out.append("- " + txt)
        else:
            out.append(txt)
    return "\n".join(out)


def fetch_page(url):
    """(markdown_text, raw_html_or_None, how). Prefers the URL's markdown twin (unkey.com, Mintlify and many docs sites serve URL.md)."""
    base = url.split("#")[0]
    clean = base.split("?")[0].rstrip("/")
    if not clean.endswith((".md", ".pdf")):
        st, ct, body = http_get(clean + ".md")
        if st == 200 and body.strip() and not body.lstrip()[:200].lower().startswith(("<!doctype", "<html")) and "html" not in ct:
            return body, None, "md-twin"
    st, ct, body = http_get(base)
    if st != 200 or not body:
        return None, None, f"http {st}"
    if "html" not in ct and not body.lstrip().startswith("<"):
        return body, None, "text"
    return html_to_md(body), body, "html"


def parse_frontmatter(src):
    fm = {}
    m = re.match(r"\ufeff?---\s*\n(.*?)\n---\s*\n", src, re.S)
    if m:
        for line in m.group(1).splitlines():
            k = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
            if k and k.group(2).strip():
                fm[k.group(1)] = k.group(2).strip().strip('"').strip("'")
        src = src[m.end():]
    return fm, src


def mdx_to_markdown(src):
    """MDX source -> the markdown a reader/crawler would see: frontmatter title/description become the H1 and lead,
    imports/exports dropped, Mintlify components reduced to their text (Card/Accordion titles kept)."""
    fm, body = parse_frontmatter(src)
    body = re.sub(r"(?m)^(import|export)\s.*$", "", body)
    body = re.sub(r"<(Card|Accordion|Tab|Step|Update)\b[^>]*?\btitle=[\"']([^\"']+)[\"'][^>]*>", lambda m: f"\n### {m.group(2)}\n", body)
    body = re.sub(r"</?[A-Z][A-Za-z0-9.]*\b[^>]*?/?>", "", body)       # other JSX components (keep inner text)
    body = re.sub(r"\{/\*.*?\*/\}", "", body, flags=re.S)                # MDX comments
    head = ""
    if fm.get("title"):
        head += f"# {fm['title']}\n"
    if fm.get("description"):
        head += f"> {fm['description']}\n"
    return head + body


def load_source(spec):
    """spec: path or URL. Returns dict(kind, text (markdown-ish), raw, html, how, sha256)."""
    if re.match(r"^https?://", spec):
        md, html, how = fetch_page(spec)
        if md is None:
            raise SystemExit(f"could not fetch {spec}: {how}")
        raw = md
        if how in ("md-twin", "text"):
            md = mdx_to_markdown(md) if md.lstrip().startswith("---") else md
        return dict(kind="url", spec=spec, text=md, raw=raw, html=html, how=how, sha256=hashlib.sha256(raw.encode()).hexdigest())
    raw = open(spec, encoding="utf-8").read()
    if spec.lower().endswith((".html", ".htm")):
        return dict(kind="file", spec=spec, text=html_to_md(raw), raw=raw, html=raw, how="html-file", sha256=hashlib.sha256(raw.encode()).hexdigest())
    return dict(kind="file", spec=spec, text=mdx_to_markdown(raw), raw=raw, html=None, how="mdx-file", sha256=hashlib.sha256(raw.encode()).hexdigest())


def page_body(md):
    """Text used for injection: drop boilerplate before the H1, link targets, images, code blocks, HTML tags."""
    i = md.find("\n# ")
    if not md.startswith("# ") and i >= 0:
        md = md[i + 1:]
    md = re.sub(r"```.*?```", "", md, flags=re.S)
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", md)
    md = re.sub(r"\]\([^)]*\)", "]", md)
    md = re.sub(r"<[^>]+>", "", md)
    md = re.sub(r"[ \t]+", " ", md)
    md = re.sub(r"\n\s*\n+", "\n", md)
    return md.encode("ascii", "ignore").decode().strip()


# ----------------------------------------------------------------------------- chunk selection (local BM25)
STOP = set("a an and are as at be best by can do does for from get how i in is it my of on or per should so that the this to use what whats when where which with without you your".split())


def toks(s):
    return [w for w in re.findall(r"[a-z0-9]+", s.lower()) if w not in STOP and len(w) > 1]


def windows(text, size):
    """Line-aligned candidate chunks of at most `size` chars, one starting at every line."""
    lines = [l for l in text.split("\n") if l.strip()]
    out = []
    for i in range(len(lines)):
        buf = ""
        for l in lines[i:]:
            add = (l if not buf else "\n" + l)
            if len(buf) + len(add) > size:
                if not buf:
                    buf = l[:size]
                break
            buf += add
        if buf and (not out or buf != out[-1]):
            out.append(buf)
    return out or [text[:size]]


def bm25_pick(text, query, size, mode="bm25"):
    """Returns (chunk, start_index, score). mode='lead' always returns the first window."""
    ws = windows(text, size)
    if mode == "lead":
        return ws[0], 0, 0.0
    q = set(toks(query))
    docs = [toks(w) for w in ws]
    N = len(docs); avg = sum(map(len, docs)) / max(1, N)
    df = {t: sum(1 for d in docs if t in d) for t in q}
    best, bi, bs = ws[0], 0, 0.0
    for i, d in enumerate(docs):
        s = 0.0
        for t in q:
            f = d.count(t)
            if f:
                idf = math.log(1 + (N - df[t] + 0.5) / (df[t] + 0.5))
                s += idf * f * 2.2 / (f + 1.2 * (0.25 + 0.75 * len(d) / max(1e-9, avg)))
        if s > bs + 1e-12:
            best, bi, bs = ws[i], i, s
    return best, bi, round(bs, 3)


def clean_url(u):
    return u.split("?utm_source")[0].split("#")[0]


def doc_message(url, text, query, mode):
    header = f"[Search result {clean_url(url).split('?')[0]} part 1/1]\n"
    size = min(CFG["design"]["chunk_chars"], CFG["design"]["message_max_ascii"] - len(header))
    chunk, idx, score = bm25_pick(text, query, size, mode)
    msg = (header + chunk).encode("ascii", "ignore").decode()[:CFG["design"]["message_max_ascii"]]
    return msg, dict(url=clean_url(url), window=idx, bm25=score, chars=len(msg))


# ----------------------------------------------------------------------------- distractors (competitor pages)
def latest_daily(daily_dir):
    fs = sorted(f for f in os.listdir(daily_dir) if re.match(r"^\d{4}-\d{2}-\d{2}\.json$", f))
    if not fs:
        raise SystemExit(f"no YYYY-MM-DD.json in {daily_dir}")
    return os.path.join(daily_dir, fs[-1])


def domain(u):
    h = urllib.parse.urlparse(u).netloc.lower()
    h = h[4:] if h.startswith("www.") else h
    parts = h.split(".")
    return ".".join(parts[-2:]) if len(parts) >= 2 else h


def build_distractors(qids, daily_path, k=3):
    """Per question: top-k non-Unkey URLs the live engines cited (count desc, first-seen order), one per domain,
    fetched once. Falls back to other target questions' citations when fewer than k pages could be fetched."""
    daily = json.load(open(daily_path))
    cited = {}
    for r in daily["results"]:
        q = r.get("canonical_id") or r["question_id"]
        lst = cited.setdefault(q, [])
        lst.extend(clean_url(u) for u in r.get("cited_urls") or [])

    def ranked(q):
        seen, order = {}, []
        for u in cited.get(q, []):
            if "unkey" in u or u.lower().endswith(".pdf"):
                continue
            if u not in seen:
                seen[u] = 0; order.append(u)
            seen[u] += 1
        return sorted(order, key=lambda u: (-seen[u], order.index(u)))

    cache, out = {}, {}
    for q in qids:
        pool = ranked(q) + [u for o in qids if o != q for u in ranked(o)]
        picked, doms = [], set()
        for u in pool:
            if len(picked) == k:
                break
            if domain(u) in doms:
                continue
            if u not in cache:
                md, _, how = fetch_page(u)
                body = page_body(md) if md else ""
                cache[u] = (body, how) if len(body) >= 200 else (None, how)
            body, how = cache[u]
            if body:
                picked.append(dict(url=u, how=how, text=body, sha256=hashlib.sha256(body.encode()).hexdigest()))
                doms.add(domain(u))
        if len(picked) < k:
            raise SystemExit(f"Q{q}: only {len(picked)} competitor pages could be fetched; supply --distractors")
        out[str(q)] = picked
    return dict(source=os.path.basename(daily_path), fetched_at=now_et().strftime("%Y-%m-%d %H:%M %Z"), per_question=out)


# ----------------------------------------------------------------------------- plan
def make_body(model, question, docs_msgs):
    chain = []
    for m in docs_msgs:
        chain.append({"role": "user", "message": m})
        chain.append({"role": "ai", "message": CFG["ack_message"]})
    b = {"system_message": CFG["system_message"], "user_prompt": question, "model_name": model["model_name"],
         "max_output_tokens": model["max_output_tokens"], "web_search": False}
    if chain:
        b["message_chain"] = chain
    return [b]


def validate_body(b):
    """DataForSEO limits (catalog_get + pilot): system/user <= 500 chars, <= 10 chain messages, each <= 480 ASCII chars,
    alternating user/ai (a user-only chain returned a provider 50000 error in the pilot)."""
    x = b[0]
    assert len(b) == 1, "DataForSEO live routes take exactly one task"
    assert len(x["system_message"]) <= 500 and len(x["user_prompt"]) <= 500, "system/user prompt > 500 chars"
    ch = x.get("message_chain", [])
    assert len(ch) <= 10, f"{len(ch)} chain messages > 10"
    for i, m in enumerate(ch):
        assert m["role"] == ("user" if i % 2 == 0 else "ai"), "chain must alternate user/ai"
        assert len(m["message"]) <= 480 and m["message"].isascii(), "chain message > 480 chars or non-ASCII"


def plan_calls(targets, guard, P_old, P_new, page_url, distract, args):
    D = CFG["design"]; M = CFG["models"]
    calls, chunks = [], {}

    def docs_for(qid, P, run):
        q = QS[qid]["text"] if isinstance(qid, int) else qid
        key = str(qid)
        comp = distract[key]
        msgs = []
        for c in comp:
            m, info = doc_message(c["url"], c["text"], q, D["chunk_mode"])
            msgs.append((m, info))
        pm, pinfo = doc_message(page_url, P, q, D["chunk_mode"])
        slot = run % D["docs_per_condition"]
        msgs.insert(slot, (pm, pinfo))
        return [m for m, _ in msgs], dict(slot=slot + 1, page=pinfo, competitors=[i for _, i in msgs if i is not pinfo])

    def add(model_key, cond, qid, run, docs, role):
        m = M[model_key]
        q = QS[qid]["text"] if isinstance(qid, int) else qid
        body = make_body(m, q, docs)
        validate_body(body)
        calls.append(dict(id=f"{model_key}|{role}|{cond}|{qid}|{run}", model=model_key, role=role, cond=cond, qid=qid, run=run,
                          endpoint_id=m["endpoint_id"], body=body))

    for qid in targets:
        for r in range(D["n_A"]):
            add("primary", "A", qid, r, [], "target")
        for cond, P in (("D_old", P_old), ("D_new", P_new)):
            for r in range(D["n_D"]):
                docs, info = docs_for(qid, P, r)
                chunks.setdefault(f"{qid}|{cond}", info) if r == 0 else None
                add("primary", cond, qid, r, docs, "target")
    for qid in guard:
        for cond, P in (("D_old", P_old), ("D_new", P_new)):
            for r in range(D["n_guard"]):
                docs, _ = docs_for(qid, P, r)
                add("primary", cond, qid, r, docs, "guard")
    if not args.no_confirm:
        for qid in targets[:args.confirm_queries]:
            for cond, P in (("D_old", P_old), ("D_new", P_new)):
                for r in range(D["n_confirm"]):
                    docs, _ = docs_for(qid, P, r)
                    add("confirm", cond, qid, r, docs, "confirm")
    return calls, chunks


def projected_cost(calls):
    M = CFG["models"]
    by = {}
    for c in calls:
        by.setdefault(c["model"], 0)
        by[c["model"]] += 1
    return {k: dict(calls=n, usd=round(n * M[k]["est_usd_per_call"], 4)) for k, n in by.items()}, round(sum(n * M[k]["est_usd_per_call"] for k, n in by.items()), 4)


# ----------------------------------------------------------------------------- budget ledger
def ledger_path(args):
    return args.ledger or os.path.join(HERE, CFG["budget"]["ledger"])


def month_to_date(path):
    if not os.path.exists(path):
        return 0.0, 0
    ym = now_et().strftime("%Y-%m"); tot = 0.0; n = 0
    for line in open(path):
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        if r.get("ts_et", "").startswith(ym):
            tot += float(r.get("spend_usd") or 0); n += 1
    return round(tot, 6), n


def ledger_append(path, rec):
    with open(path, "a") as f:
        f.write(json.dumps(rec) + "\n")


# ----------------------------------------------------------------------------- Treg client (pluggable)
class TregHTTPClient:
    """Treg's documented REST door (https://treg.to/integrate.md, https://treg.to/llms.txt). Confirmed with real calls
    on 2026-11-14: 200 + raw DataForSEO body + X-Treg-Cost-Micro / X-Treg-Call-Id headers, team token needs no X-Treg-Org."""

    def __init__(self, token, base_url, timeout, meta):
        self.token, self.base, self.timeout, self.meta = token, base_url.rstrip("/"), timeout, meta

    def call(self, endpoint_id, body, idem_key, max_cost_usd):
        req = urllib.request.Request(f"{self.base}/call/{endpoint_id}", data=json.dumps(body).encode(), method="POST", headers={
            "X-Treg-Token": self.token, "Content-Type": "application/json", "Cache-Control": "no-cache",
            "Idempotency-Key": idem_key, "X-Treg-Route-Max-Cost": f"{max_cost_usd}", "X-Treg-Meta": self.meta, "User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as r:
                st, h, raw = r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            st, h, raw = e.code, e.headers, e.read()
        try:
            data = json.loads(raw)
        except Exception:
            data = {"_unparsed": raw[:500].decode("utf-8", "replace")}
        return dict(status=st, cost_usd=int(h.get("X-Treg-Cost-Micro") or 0) / 1e6, call_id=h.get("X-Treg-Call-Id"),
                    treg_error=h.get("X-Treg-Error") == "1", upstream_failed=bool(h.get("X-Treg-Upstream-Failed")),
                    replayed=bool(h.get("X-Treg-Original-Cost-Micro")), data=data)


class MockClient:
    """Synthetic answers for --self-test: names Unkey with probability p[cond]. Never touches the network."""

    def __init__(self, p, seed=1):
        self.p, self.rng = p, random.Random(seed)

    def call(self, endpoint_id, body, idem_key, max_cost_usd):
        cond = body[0].get("_cond", "A")
        named = self.rng.random() < self.p.get(cond, 0)
        rivals = self.rng.sample(["Upstash", "Cloudflare", "Kong", "Zuplo", "Redis"], 3)
        txt = ("Unkey is a good fit. " if named and self.rng.random() < .6 else "") + " ".join(f"{r} works." for r in rivals) + (" Unkey too." if named else "")
        return dict(status=200, cost_usd=0.0, call_id="mock", treg_error=False, upstream_failed=False, replayed=False,
                    data={"tasks": [{"status_code": 20000, "result": [{"model_name": "mock", "items": [{"sections": [{"text": txt}]}]}]}]})


# ----------------------------------------------------------------------------- parsing (same rules as analyze.py / pilot/parse.py)
def answer_text(data):
    t = (data.get("tasks") or [{}])[0]
    if t.get("status_code") != 20000 or not t.get("result"):
        return None, t.get("status_message") or str(data)[:200]
    r = t["result"][0]
    return "".join(s.get("text", "") for it in r.get("items") or [] for s in it.get("sections") or []), r.get("model_name")


def metrics(text):
    pos = {}
    for br in BRANDS:
        m = re.search(r"(?<![A-Za-z])" + re.escape(br) + r"(?![A-Za-z])", text)
        if m:
            n = ALIAS.get(br, br); pos[n] = min(pos.get(n, 10 ** 9), m.start())
    order = [k for k, _ in sorted(pos.items(), key=lambda x: x[1])]
    named = "Unkey" in order or bool(re.search(r"unkey", text, re.I))
    rank = order.index("Unkey") + 1 if "Unkey" in order else None
    return dict(named=named, rank=rank, top1=rank == 1, rec=(1.0 / rank if rank else 0.0),
                sov=(1.0 / len(order) if named and order else 0.0), cited=bool(re.search(r"unkey\.com", text, re.I)),
                brands=order)


# ----------------------------------------------------------------------------- stats (no scipy)
def fisher_greater(a, n1, c, n2):
    """One-sided Fisher exact p for H1: rate1 (a/n1) > rate2 (c/n2). Hypergeometric upper tail."""
    K, N = a + c, n1 + n2
    tot = math.comb(N, K)
    return min(1.0, sum(math.comb(n1, x) * math.comb(n2, K - x) for x in range(a, min(n1, K) + 1)) / tot) if tot else 1.0


def cmh_one_sided(strata):
    """Cochran-Mantel-Haenszel (no continuity correction), one-sided normal p for 'new > old'. strata: [(a,n1,c,n2)]."""
    num = var = 0.0
    for a, n1, c, n2 in strata:
        N = n1 + n2; m1 = a + c
        if N < 2 or m1 in (0, N):
            continue
        num += a - n1 * m1 / N
        var += n1 * n2 * m1 * (N - m1) / (N * N * (N - 1))
    if var <= 0:
        return None
    z = num / math.sqrt(var)
    return 0.5 * math.erfc(z / math.sqrt(2))


def bootstrap_ci(per_q_old, per_q_new, B, seed):
    """Paired bootstrap over queries: resample queries with replacement, mean of (new_mean - old_mean). 95% CI."""
    qs = [q for q in per_q_old if per_q_old[q] and per_q_new.get(q)]
    if not qs:
        return None
    diffs = {q: sum(per_q_new[q]) / len(per_q_new[q]) - sum(per_q_old[q]) / len(per_q_old[q]) for q in qs}
    rng = random.Random(seed); stats = []
    for _ in range(B):
        s = [diffs[rng.choice(qs)] for _ in qs]
        stats.append(sum(s) / len(s))
    stats.sort()
    return dict(mean=round(sum(diffs.values()) / len(qs), 4), lo=round(stats[int(0.025 * B)], 4), hi=round(stats[int(0.975 * B) - 1], 4))


# ----------------------------------------------------------------------------- page_check (gate c)
CONTENT_CHECKS = {"title_len", "meta_desc", "server_rendered", "one_h1", "heading_order", "subheadings", "question_headings",
                  "extractable_blocks", "answer_first", "img_alt", "internal_links", "oss_entity", "external_refs"}


def md_to_html(src):
    """Minimal MDX/markdown -> HTML for page_check source mode (headings, lists, tables, code, links, images, FAQ)."""
    fm, body = parse_frontmatter(src)
    body = re.sub(r"(?m)^(import|export)\s.*$", "", body)
    body = re.sub(r"<Accordion\b[^>]*?\btitle=[\"']([^\"']+)[\"'][^>]*>", r"<details><summary>\1</summary>", body)
    body = body.replace("</Accordion>", "</details>")
    def card(m):
        attrs = m.group(1)
        h = re.search(r"href=[\"']([^\"']+)", attrs); t = re.search(r"title=[\"']([^\"']+)", attrs)
        title = t.group(1) if t else ""
        return "<div>" + (f'<a href="{h.group(1)}">{title}</a> ' if h else f"<span>{title}</span> ")
    body = re.sub(r"<Card\b([^>]*?)>", card, body)
    body = body.replace("</Card>", "</div>")

    def inline(s):
        s = re.sub(r"!\[([^\]]*)\]\(([^)\s]+)[^)]*\)", r'<img alt="\1" src="\2">', s)
        s = re.sub(r"\[([^\]]+)\]\(([^)\s]+)[^)]*\)", r'<a href="\2">\1</a>', s)
        return re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    out, i, lines = [], 0, body.split("\n")
    while i < len(lines):
        l = lines[i]
        if l.strip().startswith("```"):
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith("```"):
                j += 1
            out.append("<pre><code>" + "\n".join(lines[i + 1:j]).replace("<", "&lt;") + "</code></pre>"); i = j + 1; continue
        m = re.match(r"^(#{1,6})\s+(.*)$", l)
        if m:
            n = len(m.group(1)); out.append(f"<h{n}>{inline(m.group(2))}</h{n}>"); i += 1; continue
        if re.match(r"^\s*\|", l):
            rows = []
            while i < len(lines) and re.match(r"^\s*\|", lines[i]):
                if not re.match(r"^\s*\|[\s:|-]+\|\s*$", lines[i]):
                    rows.append("<tr>" + "".join(f"<td>{inline(c.strip())}</td>" for c in lines[i].strip().strip("|").split("|")) + "</tr>")
                i += 1
            out.append("<table>" + "".join(rows) + "</table>"); continue
        if re.match(r"^\s*([-*+]|\d+\.)\s+", l):
            tag = "ol" if re.match(r"^\s*\d+\.", l) else "ul"; items = []
            while i < len(lines) and re.match(r"^\s*([-*+]|\d+\.)\s+", lines[i]):
                items.append("<li>" + inline(re.sub(r"^\s*([-*+]|\d+\.)\s+", "", lines[i])) + "</li>"); i += 1
            out.append(f"<{tag}>" + "".join(items) + f"</{tag}>"); continue
        if l.strip():
            out.append(f"<p>{inline(l)}</p>")
        i += 1
    title = fm.get("title", ""); desc = fm.get("description", "")
    h1 = f"<h1>{title}</h1>" if title and not re.search(r"(?m)^#\s", body) else ""
    return (f"<html lang=\"en\"><head><title>{title}</title><meta name=\"description\" content=\"{desc.replace(chr(34), '&quot;')}\"></head>"
            f"<body><main>{h1}{''.join(out)}</main></body></html>")


def page_check_delta(old, new, page_url, topic):
    """Returns dict with old/new scores and lost binary checks. Full mode when both sides have real HTML (URL or .html);
    source mode otherwise: site/template checks come from one live check of page_url (identical for both sides), content
    checks from each side's source rendered by md_to_html. Only content checks can move in source mode."""
    sys.path.insert(0, HERE)
    import page_check as pc
    if old.get("html") and new.get("html"):
        mode = "full"
        ro = pc.check(page_url, html=old["html"], topic=topic) if old["kind"] == "file" else pc.check(old["spec"], topic=topic)
        rn = pc.check(page_url, html=new["html"], topic=topic) if new["kind"] == "file" else pc.check(new["spec"], topic=topic)
        so, sn = {c["id"]: c for c in ro["checks"]}, {c["id"]: c for c in rn["checks"]}
    else:
        mode = "source"
        live = {c["id"]: c for c in pc.check(page_url, topic=topic)["checks"]}

        def side(s):
            src = s["raw"] if s["how"] != "html-file" else None
            html = md_to_html(src) if src is not None else s["html"]
            got = {c["id"]: c for c in pc.check(page_url, html=html, topic=topic)["checks"]}
            return {k: (got[k] if k in CONTENT_CHECKS else live[k]) for k in live}
        so, sn = side(old), side(new)
    gate = [k for k in so if k != "fast"]
    lost = [k for k in gate if so[k]["kind"] == "binary" and so[k]["score"] == 1 and sn[k]["score"] < 1]
    changed = [(k, so[k]["points"], sn[k]["points"]) for k in gate if so[k]["points"] != sn[k]["points"]]
    o = round(sum(so[k]["points"] for k in gate), 1); n = round(sum(sn[k]["points"] for k in gate), 1)
    return dict(mode=mode, old=o, new=n, max=sum(so[k]["weight"] for k in gate), lost_binary=lost, changed=changed,
                ok=(n >= o and not lost))


# ----------------------------------------------------------------------------- execution
def execute(calls, client, out_dir, run_id, budget_left, log):
    """Runs calls with a running spend total; stops before the total could pass budget_left. Raw answers go to raw.jsonl."""
    M = CFG["models"]; spent = 0.0; results = {}
    raw_f = open(os.path.join(out_dir, "raw.jsonl"), "a")

    def one(c):
        key = f"aeo-{run_id}-{hashlib.sha1(c['id'].encode()).hexdigest()[:16]}"
        body = json.loads(json.dumps(c["body"]))
        if isinstance(client, MockClient):
            body[0]["_cond"] = c["cond"]
        for attempt in range(4):
            try:
                r = client.call(c["endpoint_id"], body, key + (f"-r{attempt}" if attempt else ""), M[c["model"]]["route_max_cost_usd"])
            except Exception as e:  # network error: answer not received -> retry with the SAME key (no double charge)
                r = None; err = str(e)
                for a2 in range(3):
                    try:
                        r = client.call(c["endpoint_id"], body, key + (f"-r{attempt}" if attempt else ""), M[c["model"]]["route_max_cost_usd"]); break
                    except Exception as e2:
                        err = str(e2); time.sleep(2 * (a2 + 1))
                if r is None:
                    return c, dict(status=0, cost_usd=0.0, data={"error": err})
            if r["status"] == 200 and not r["upstream_failed"]:
                return c, r
            if r["status"] in (402, 403) or r["treg_error"] and r["status"] not in (429, 503):
                return c, r                                    # treg refusal (balance, cap): stop retrying
            time.sleep(3 * (attempt + 1))                      # provider 5xx / 429: free, retry with a new key
        return c, r

    # smoke test: parse the first 3 answers before paying for the rest (treg skill advice)
    head, rest = calls[:3], calls[3:]
    for batch_i, batch in enumerate((head, rest)):
        with ThreadPoolExecutor(max_workers=CFG["treg"]["concurrency"]) as ex:
            futs = []
            for c in batch:
                est = M[c["model"]]["est_usd_per_call"]
                if spent + est * (len(futs) + 1) > budget_left and not isinstance(client, MockClient):
                    log(f"budget stop: spent ${spent:.4f}, next calls would pass ${budget_left:.2f}")
                    break
                futs.append(ex.submit(one, c))
            for f in as_completed(futs):
                c, r = f.result()
                spent += r.get("cost_usd") or 0.0
                txt, model = answer_text(r.get("data") or {}) if r.get("status") == 200 else (None, None)
                rec = dict(id=c["id"], status=r.get("status"), cost_usd=r.get("cost_usd"), call_id=r.get("call_id"), model_resolved=model,
                           ok=txt is not None, text=txt, err=None if txt is not None else (str(r.get("data"))[:300]))
                raw_f.write(json.dumps(rec) + "\n"); raw_f.flush()
                results[c["id"]] = rec
        if batch_i == 0:
            bad = [r for r in results.values() if not r["ok"]]
            if len(bad) == len(head):
                raw_f.close()
                raise SystemExit(f"smoke test failed: none of the first {len(head)} calls parsed: {bad[0]['err']}")
    raw_f.close()
    return results, round(spent, 6)


# ----------------------------------------------------------------------------- analysis + verdict
def analyse(calls, results, targets, guard):
    T = CFG["thresholds"]; D = CFG["design"]
    rows = []
    for c in calls:
        r = results.get(c["id"])
        if r and r["ok"]:
            rows.append(dict(c, **metrics(r["text"])))

    def cell(model, role, cond, qids=None):
        return [x for x in rows if x["model"] == model and x["role"] == role and x["cond"] == cond and (qids is None or x["qid"] in qids)]

    def rate(xs, k="named"):
        return (sum(1 for x in xs if x[k]), len(xs))

    def mean(xs, k):
        return round(sum(x[k] for x in xs) / len(xs), 4) if xs else None

    def per_q(xs, k):
        d = {}
        for x in xs:
            d.setdefault(x["qid"], []).append(float(x[k]))
        return d
    A, Do, Dn = cell("primary", "target", "A"), cell("primary", "target", "D_old"), cell("primary", "target", "D_new")
    a, n1 = rate(Dn); c, n2 = rate(Do)
    p_up = fisher_greater(a, n1, c, n2) if n1 and n2 else None
    p_down = fisher_greater(c, n2, a, n1) if n1 and n2 else None
    strata = [(rate(cell("primary", "target", "D_new", [q]))[0], len(cell("primary", "target", "D_new", [q])),
               rate(cell("primary", "target", "D_old", [q]))[0], len(cell("primary", "target", "D_old", [q]))) for q in targets]
    B, seed = D["bootstrap_resamples"], D["bootstrap_seed"]
    boot = {k: bootstrap_ci(per_q(Do, k), per_q(Dn, k), B, seed) for k in ("rec", "top1", "sov", "named")}
    r_old = c / n2 if n2 else 0; r_new = a / n1 if n1 else 0
    delta_pp = round(100 * (r_new - r_old), 1)
    # guard
    gq = []
    for q in guard:
        o = rate(cell("primary", "guard", "D_old", [q])); n = rate(cell("primary", "guard", "D_new", [q]))
        gq.append(dict(qid=q, old=o, new=n))
    go = (sum(g["old"][0] for g in gq), sum(g["old"][1] for g in gq)); gn = (sum(g["new"][0] for g in gq), sum(g["new"][1] for g in gq))
    g_delta = round(100 * ((gn[0] / gn[1] if gn[1] else 0) - (go[0] / go[1] if go[1] else 0)), 1)
    g_collapse = [g["qid"] for g in gq if g["old"][1] and g["old"][0] >= T["guard_query_from_min"] and g["new"][0] <= T["guard_query_to_max"]]
    guard_ok = g_delta >= -T["guard_max_pooled_drop_pp"] and not g_collapse
    # confirm (claude)
    Co, Cn = cell("confirm", "confirm", "D_old"), cell("confirm", "confirm", "D_new")
    conf = None
    if Co or Cn:
        ca, cn1 = rate(Cn); cc, cn2 = rate(Co)
        conf = dict(old=(cc, cn2), new=(ca, cn1), delta_pp=round(100 * ((ca / cn1 if cn1 else 0) - (cc / cn2 if cn2 else 0)), 1),
                    p_up=fisher_greater(ca, cn1, cc, cn2) if cn1 and cn2 else None, p_down=fisher_greater(cc, cn2, ca, cn1) if cn1 and cn2 else None,
                    top1_old=rate(Co, "top1"), top1_new=rate(Cn, "top1"))
    # sensitivity (not gated): D_old vs A
    sa, sn_ = rate(A)
    sens_p = fisher_greater(c, n2, sa, sn_) if sn_ and n2 else None
    ceiling = r_old >= T["ceiling_rate"]
    if not ceiling:
        primary_ok = delta_pp >= T["min_named_delta_pp"] and p_up is not None and p_up < T["alpha"]
    else:
        lifts = [boot[k] for k in ("top1", "sov") if boot[k]]
        primary_ok = any(b["lo"] > 0 for b in lifts) and delta_pp >= -T["ceiling_max_named_drop_pp"]
    sig_negative = (p_down is not None and p_down < T["alpha"]) or (conf and conf["p_down"] is not None and conf["p_down"] < T["alpha"])
    return dict(A=dict(named=rate(A), top1=rate(A, "top1"), rec=mean(A, "rec"), sov=mean(A, "sov"), cited=rate(A, "cited")),
                D_old=dict(named=rate(Do), top1=rate(Do, "top1"), rec=mean(Do, "rec"), sov=mean(Do, "sov"), cited=rate(Do, "cited")),
                D_new=dict(named=rate(Dn), top1=rate(Dn, "top1"), rec=mean(Dn, "rec"), sov=mean(Dn, "sov"), cited=rate(Dn, "cited")),
                delta_pp=delta_pp, p_up=p_up, p_down=p_down, cmh_p=cmh_one_sided(strata), boot=boot, ceiling=ceiling,
                guard=dict(per_query=gq, old=go, new=gn, delta_pp=g_delta, collapsed=g_collapse, ok=guard_ok),
                confirm=conf, sensitivity_p=sens_p, primary_ok=primary_ok, sig_negative=bool(sig_negative),
                n_ok=len(rows), n_planned=len(calls))


def verdict(an, pcd, prereg_ok):
    if not prereg_ok:
        return "FAIL", "(d) pre-registration hash mismatch"
    if pcd is None:
        return "INCOMPLETE", "(c) page_check could not run"
    if not an["guard"]["ok"]:
        return "FAIL", "(b) regression guard violated"
    if not pcd["ok"]:
        return "FAIL", "(c) page_check score dropped or a binary check was lost"
    if an["sig_negative"]:
        return "FAIL", "primary delta significantly negative"
    if an["n_ok"] < 0.9 * an["n_planned"]:
        return "INCOMPLETE", f"only {an['n_ok']}/{an['n_planned']} answers parsed"
    if an["primary_ok"]:
        return "PASS", "(a)(b)(c)(d) hold"
    return "NO MEASURABLE EFFECT", "(a) not met; (b)(c)(d) hold"


def fr(t):
    k, n = t
    return f"{k}/{n} ({100 * k / n:.0f}%)" if n else "n/a"


def fmt_p(p):
    return "n/a" if p is None else (f"{p:.4f}" if p >= 0.0001 else f"{p:.1e}")


def justification(meta, an, pcd, res, cost):
    T = CFG["thresholds"]; D = CFG["design"]; M = CFG["models"]
    b = an["boot"] if an else {}

    def ci(k):
        x = b.get(k)
        return f"bootstrap 95% CI [{x['lo']:+.3f}, {x['hi']:+.3f}]" if x else "n/a"
    L = ["### AEO justification" + (" (DRY RUN: no paid calls, no measurements)" if meta["dry_run"] else ""),
         f"- Page: {meta['page_url']}   Category: {meta['category_label']}   Target volume: {meta['volume']:,} US monthly searches",
         f"- Old source: `{meta['old']}` sha256={meta['old_sha'][:12]}   New source: `{meta['new']}` sha256={meta['new_sha'][:12]}" + ("   (identical)" if meta["old_sha"] == meta["new_sha"] else ""),
         f"- Pre-registration: design+queries sha256={meta['prereg_sha'][:16]}; distractors `{meta['distractors_file']}` sha256={meta['distractors_sha'][:16]} (from {meta['distractor_source']}, fetched {meta['distractors_fetched']})",
         f"- Query set (target): {', '.join(meta['target_labels'])}   Guard set: {', '.join('Q%d' % q for q in meta['guard'])}",
         f"- Models: {M['primary']['label']} ({M['primary']['endpoint_id']}, web search off)" + ("" if meta["no_confirm"] else f" + confirm: {M['confirm']['label']} ({M['confirm']['endpoint_id']}, web search off, first {meta['confirm_queries']} target queries)"),
         f"- Conditions: A (no page) n={D['n_A']}/query; D_old n={D['n_D']}/query; D_new n={D['n_D']}/query; guard n={D['n_guard']}/cell; confirm n={D['n_confirm']}/cell; P slot rotated 1-4; chunks: {D['chunk_mode']} ({D['chunk_chars']} chars max/doc)",
         ""]
    if an:
        L += ["| Metric | A | D_old (before) | D_new (after) | Delta | Test / CI |", "|---|---|---|---|---|---|",
              f"| Unkey named rate | {fr(an['A']['named'])} | {fr(an['D_old']['named'])} | {fr(an['D_new']['named'])} | {an['delta_pp']:+.1f}pp | Fisher 1-sided p={fmt_p(an['p_up'])}; CMH p={fmt_p(an['cmh_p'])} |",
              f"| Top-1 rate | {fr(an['A']['top1'])} | {fr(an['D_old']['top1'])} | {fr(an['D_new']['top1'])} | | {ci('top1')} |",
              f"| Rec. score (1/rank) | {an['A']['rec']} | {an['D_old']['rec']} | {an['D_new']['rec']} | | {ci('rec')} |",
              f"| Share of voice | {an['A']['sov']} | {an['D_old']['sov']} | {an['D_new']['sov']} | | {ci('sov')} |",
              f"| Guard named rate | — | {fr(an['guard']['old'])} | {fr(an['guard']['new'])} | {an['guard']['delta_pp']:+.1f}pp | collapsed queries: {an['guard']['collapsed'] or 'none'} |"]
        if an["confirm"]:
            cf = an["confirm"]
            L.append(f"| Confirm ({M['confirm']['label']}) named | — | {fr(cf['old'])} | {fr(cf['new'])} | {cf['delta_pp']:+.1f}pp | Fisher 1-sided p={fmt_p(cf['p_up'])} (not gated unless significantly negative) |")
    else:
        L += ["| Metric | A | D_old (before) | D_new (after) | Delta | Test / CI |", "|---|---|---|---|---|---|",
              "| Unkey named rate | not run | not run | not run | — | — |"]
    if pcd:
        L.append(f"| page_check score ({pcd['mode']} mode) | — | {pcd['old']}/{pcd['max']} | {pcd['new']}/{pcd['max']} | {pcd['new'] - pcd['old']:+.1f} | binary checks lost: {len(pcd['lost_binary'])}{' ' + str(pcd['lost_binary']) if pcd['lost_binary'] else ''} |")
    L.append("")
    if an:
        L.append(f"- Sensitivity (not gated): D_old vs A Fisher p={fmt_p(an['sensitivity_p'])}" + ("; D_old at ceiling (>=90%), so (a) uses top-1/share-of-voice CIs" if an["ceiling"] else ""))
    L.append(f"- Pass rule (fixed before run): named +{T['min_named_delta_pp']}pp with p<{T['alpha']} (or at ceiling: top-1/SoV CI lower bound >0 and named drop <= {T['ceiling_max_named_drop_pp']}pp); guard pooled drop <= {T['guard_max_pooled_drop_pp']}pp and no query {T['guard_query_from_min']}/5 -> <={T['guard_query_to_max']}/5; page_check new >= old with no binary check lost")
    L.append(f"- Result: **{res[0]}** ({res[1]})")
    L.append(f"- Cost: {cost}")
    return "\n".join(L)


# ----------------------------------------------------------------------------- main
def prereg_hash(targets, guard, extra):
    d = dict(design=CFG["design"], thresholds=CFG["thresholds"], models={k: {kk: v[kk] for kk in ("endpoint_id", "model_name", "max_output_tokens")} for k, v in CFG["models"].items()},
             system=CFG["system_message"], targets=targets, guard=guard, extra=extra, questions={q: QS[q]["text"] for q in set(t for t in targets + guard if isinstance(t, int))})
    return hashlib.sha256(json.dumps(d, sort_keys=True).encode()).hexdigest()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--old", help="old page source: .mdx/.md/.html file or URL")
    ap.add_argument("--new", help="new page source: .mdx/.md/.html file or URL")
    ap.add_argument("--category", choices=sorted(CFG["categories"]))
    ap.add_argument("--page-url", help="canonical public URL of the page (used in the injected search-result header and for page_check)")
    ap.add_argument("--extra-queries", help="JSON file: list of 2-4 PR-added buyer queries (pre-registered; no 'Unkey' in text)")
    ap.add_argument("--daily-dir", default=os.path.dirname(HERE), help="dir with YYYY-MM-DD.json daily panel results (for distractors)")
    ap.add_argument("--distractors", help="frozen distractors JSON (from an earlier run / committed). Built from the latest daily JSON if omitted")
    ap.add_argument("--out", help="output dir (default runs/<ET timestamp>)")
    ap.add_argument("--ledger", help=f"spend ledger (default {CFG['budget']['ledger']} next to this script)")
    ap.add_argument("--pr", default="", help="PR number/label for the ledger and the X-Treg-Meta tag")
    ap.add_argument("--no-confirm", action="store_true", help="skip the Claude confirmation tier")
    ap.add_argument("--confirm-queries", type=int, default=CFG["design"]["confirm_max_queries"])
    ap.add_argument("--skip-page-check", action="store_true")
    ap.add_argument("--dry-run", action="store_true", help="build and validate every request, print call count and projected cost; zero paid calls")
    ap.add_argument("--self-test", action="store_true", help="run the full pipeline against a mock client (no network to Treg)")
    ap.add_argument("--yes", action="store_true", help="required for a paid run (confirms the projected cost was reviewed)")
    args = ap.parse_args()
    if args.self_test:
        return self_test()
    for k in ("old", "new", "category", "page_url"):
        if not getattr(args, k):
            ap.error(f"--{k.replace('_', '-')} is required")
    cat = CFG["categories"][args.category]
    targets = list(cat["targets"][:CFG["design"]["max_target_queries"]])
    extra = []
    if args.extra_queries:
        extra = json.load(open(args.extra_queries))
        assert 2 <= len(extra) <= CFG["design"]["max_extra_queries"], "2-4 extra queries"
        for q in extra:
            assert len(q) <= 500 and "unkey" not in q.lower(), f"bad extra query: {q!r}"
    targets += extra
    guard = [q for q in CFG["guard_set"] if q not in targets]
    stamp = now_et().strftime("%Y-%m-%dT%H%M%S")
    out_dir = args.out or os.path.join(HERE, "runs", stamp + ("-dry" if args.dry_run else ""))
    os.makedirs(out_dir, exist_ok=True)
    log = lambda m: print(m, file=sys.stderr)

    old, new = load_source(args.old), load_source(args.new)
    P_old, P_new = page_body(old["text"]), page_body(new["text"])
    # distractors: per target + guard question (extra queries borrow the category's first target's set)
    if args.distractors:
        dist = json.load(open(args.distractors)); dist_file = args.distractors
    else:
        dpath = latest_daily(args.daily_dir)
        log(f"building distractors from {os.path.basename(dpath)} (free HTTP fetches) ...")
        dist = build_distractors([q for q in targets + guard if isinstance(q, int)], dpath)
        dist_file = os.path.join(out_dir, "distractors.json")
        json.dump(dist, open(dist_file, "w"), indent=1)
    per_q = dist["per_question"]
    for q in extra:
        per_q[q] = per_q[str(cat["targets"][0])]
    dist_sha = hashlib.sha256(json.dumps(per_q, sort_keys=True).encode()).hexdigest()

    calls, chunks = plan_calls(targets, guard, P_old, P_new, args.page_url, per_q, args)
    by_model, proj = projected_cost(calls)
    mtd, mtd_n = month_to_date(ledger_path(args))
    B = CFG["budget"]
    labels = [f"Q{q}" if isinstance(q, int) else f"extra:{q[:40]!r}" for q in targets]
    vol = QS[cat["targets"][0]]["category_volume"]
    meta = dict(dry_run=args.dry_run, page_url=args.page_url, category_label=cat["label"], volume=vol, old=args.old, new=args.new,
                old_sha=old["sha256"], new_sha=new["sha256"], prereg_sha=prereg_hash(targets, guard, extra), distractors_file=os.path.relpath(dist_file, HERE),
                distractors_sha=dist_sha, distractor_source=dist.get("source"), distractors_fetched=dist.get("fetched_at"), target_labels=labels,
                guard=guard, no_confirm=args.no_confirm, confirm_queries=args.confirm_queries)

    print(f"plan: {len(calls)} calls  " + "  ".join(f"{CFG['models'][k]['label']}: {v['calls']} calls ~${v['usd']:.4f}" for k, v in by_model.items()))
    print(f"projected cost ${proj:.4f} (cap ${B['max_usd_per_pr']:.2f}/PR)   month-to-date ledger ${mtd:.4f} over {mtd_n} runs (cap ${B['monthly_usd']:.2f}/month)")
    print(f"targets {labels}  guard {['Q%d' % q for q in guard]}  old={old['how']} ({len(P_old)} chars)  new={new['how']} ({len(P_new)} chars)")
    for k in sorted(chunks):
        i = chunks[k]
        print(f"  chunk {k}: P slot {i['slot']} window {i['page']['window']} bm25 {i['page']['bm25']} ({i['page']['chars']} chars); competitors {[c['url'] for c in i['competitors']]}")
    budget_problems = []
    if proj > B["max_usd_per_pr"]:
        budget_problems.append(f"projected ${proj:.4f} > ${B['max_usd_per_pr']:.2f} per-PR cap (drop extra queries or use --confirm-queries N / --no-confirm)")
    if mtd + proj > B["monthly_usd"]:
        budget_problems.append(f"month-to-date ${mtd:.4f} + projected ${proj:.4f} > ${B['monthly_usd']:.2f} monthly budget")

    pcd = None
    if not args.skip_page_check:
        try:
            pcd = page_check_delta(old, new, args.page_url, cat["topic"])
        except Exception as e:
            log(f"page_check failed: {e}")
    json.dump(dict(meta=meta, calls=[dict(id=c["id"], endpoint_id=c["endpoint_id"], body=c["body"]) for c in calls]), open(os.path.join(out_dir, "plan.json"), "w"), indent=1)

    if args.dry_run:
        sample = next(c for c in calls if c["cond"] == "D_old")
        print(f"sample request ({sample['id']}): POST {CFG['treg']['base_url']}/call/{sample['endpoint_id']}  body bytes={len(json.dumps(sample['body']))}  chain msgs={len(sample['body'][0].get('message_chain', []))}")
        for p in budget_problems:
            print("BUDGET GUARD WOULD ABORT:", p)
        print("budget guard: " + ("would abort" if budget_problems else "ok"))
        block = justification(meta, None, pcd, ("DRY RUN", "no paid calls made"), f"0 calls, $0.00 (projected ${proj:.4f} for {len(calls)} calls)")
        open(os.path.join(out_dir, "justification.md"), "w").write(block + "\n")
        print("\n" + block + f"\n\n(wrote {os.path.relpath(out_dir, HERE)}/plan.json, justification.md)")
        return 0

    if budget_problems:
        for p in budget_problems:
            log("ABORT (budget guard): " + p)
        return 2
    if not args.yes:
        log("refusing to spend without --yes (review the projected cost above first)")
        return 2
    envs = [CFG["treg"]["token_env"]] + CFG["treg"].get("token_env_fallbacks", [])
    token = next((os.environ[e] for e in envs if os.environ.get(e)), None)
    if not token:
        log(f"no Treg token in {envs}")
        return 2
    run_id = uuid.uuid4().hex[:12]
    client = TregHTTPClient(token, CFG["treg"]["base_url"], CFG["treg"]["timeout_s"], f"{CFG['treg']['meta_tag']}, pr={args.pr or 'none'}, run={run_id}")
    budget_left = min(B["max_usd_per_pr"], B["monthly_usd"] - mtd)
    t0 = now_et(); spent = 0.0
    try:
        results, spent = execute(calls, client, out_dir, run_id, budget_left, log)
    finally:
        ledger_append(ledger_path(args), dict(ts_et=now_et().isoformat(), run_id=run_id, pr=args.pr, category=args.category, page=args.page_url, spend_usd=spent, planned_calls=len(calls)))
    an = analyse(calls, results, targets, guard)
    res = verdict(an, pcd if not args.skip_page_check else dict(ok=True, mode="skipped", old=0, new=0, max=0, lost_binary=[]), True)
    cost = f"{sum(1 for r in results.values() if r['cost_usd'])} billed calls, ${spent:.4f} by X-Treg-Cost-Micro (run {run_id}, {t0.strftime('%Y-%m-%d %H:%M %Z')})"
    block = justification(meta, an, pcd, res, cost)
    open(os.path.join(out_dir, "justification.md"), "w").write(block + "\n")
    json.dump(dict(meta=meta, analysis=an, page_check=pcd, result=res, spend_usd=spent), open(os.path.join(out_dir, "result.json"), "w"), indent=1, default=str)
    print(block)
    return 0 if res[0] in ("PASS", "NO MEASURABLE EFFECT") else 1


def self_test():
    """End-to-end check of planning, parsing, stats, guard and verdict with a mock client. No Treg calls, no page fetches."""
    assert abs(fisher_greater(6, 6, 0, 6) - 0.0011) < 0.0002, fisher_greater(6, 6, 0, 6)   # pilot: 6/6 vs 0/6 -> p=0.0011
    assert fisher_greater(3, 6, 3, 6) > 0.5
    m = metrics("Use Upstash or Unkey; Kong also works.")
    assert m["named"] and m["rank"] == 2 and abs(m["sov"] - 1 / 3) < 1e-9, m
    page = "# Rate limiting with Unkey\n> Unkey rate limits your API per customer, key, endpoint, or IP.\n" + "Filler line about other things.\n" * 30 + "Token bucket and sliding window limits per key in Redis-free global regions.\n"
    ch, idx, sc = bm25_pick(page, "rate limit across regions without running Redis", 200)
    assert "Redis" in ch and idx > 0, (idx, ch)
    fake = {str(q): [dict(url=f"https://comp{i}.example.com/doc", text="Competitor rate limiting docs. " * 20) for i in range(3)] for q in QS}
    class A:
        no_confirm = False; confirm_queries = 6
    targets = CFG["categories"]["rate-limiting"]["targets"]; guard = [q for q in CFG["guard_set"] if q not in targets]
    calls, _ = plan_calls(targets, guard, page, page, "https://www.unkey.com/docs/x", fake, A)
    _, proj = projected_cost(calls)
    out = "/tmp/aeo_selftest"; os.makedirs(out, exist_ok=True); open(os.path.join(out, "raw.jsonl"), "w").close()
    # MockClient shares one RNG. Parallel completion order made the guard verdict flaky, so the
    # mock runs on one worker. Seed 4 passes PASS / NO MEASURABLE EFFECT / FAIL in plan order.
    saved_workers = CFG["treg"]["concurrency"]
    CFG["treg"]["concurrency"] = 1
    try:
        for name, p, want in (("improvement", {"A": .0, "D_old": .3, "D_new": .7}, "PASS"), ("no change", {"A": .0, "D_old": .5, "D_new": .5}, "NO MEASURABLE EFFECT"),
                              ("regression", {"A": .0, "D_old": .7, "D_new": .2}, "FAIL")):
            res, _ = execute(calls, MockClient(p, seed=4), out, "selftest", 99, lambda m: None)
            an = analyse(calls, res, targets, guard)
            v = verdict(an, dict(ok=True, mode="mock", old=1, new=1, max=1, lost_binary=[]), True)
            print(f"self-test {name:12s}: named {fr(an['D_old']['named'])} -> {fr(an['D_new']['named'])}  p_up={fmt_p(an['p_up'])}  guard {an['guard']['delta_pp']:+.1f}pp  => {v[0]}")
            assert v[0] == want or (name == "regression" and v[0] == "FAIL"), (name, v)
    finally:
        CFG["treg"]["concurrency"] = saved_workers
    print(f"self-test ok: {len(calls)} planned calls for rate-limiting, projected ${proj:.4f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

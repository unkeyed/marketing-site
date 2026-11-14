#!/usr/bin/env python3
"""Choose which changed marketing pages an AEO run should measure.

Reads the pull request diff, maps each page through config/harness.json
path_categories, and applies an author override from a committed aeo/queries.json
or a ```aeo fenced block in the pull request body. Does not call Treg.
"""
import ast, glob, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
QUERIES_PATH = "aeo/queries.json"
FENCE_RE = re.compile(r"^[ \t]*```(?:aeo|aeo-queries)\s*\n(.*?)^[ \t]*```[ \t]*$", re.M | re.S)
_MISSING = object()


def load_cfg():
    with open(os.path.join(HERE, "config", "harness.json"), encoding="utf-8") as fh:
        return json.load(fh)


def unquote_git_path(path):
    if len(path) >= 2 and path[0] == '"' and path[-1] == '"':
        try:
            return ast.literal_eval(path)
        except (SyntaxError, ValueError):
            return path
    return path


def parse_name_status(text):
    """Rows of (code, old_path, new_path). Renames and copies keep both paths."""
    rows = []
    for line in (text or "").splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        code = parts[0][:1]
        if code in ("R", "C") and len(parts) >= 3:
            rows.append((code, unquote_git_path(parts[1]), unquote_git_path(parts[2])))
        elif len(parts) >= 2:
            path = unquote_git_path(parts[1])
            rows.append((code, path, path))
    return rows


def is_page_source(path):
    if path.startswith("src/content/") and path.endswith(".mdx"):
        return True
    return path.startswith("src/app/(website)/") and path.endswith("/page.tsx")


def is_dynamic(path):
    return path.endswith("/page.tsx") and "[" in path


def glob_match(path, pattern):
    regex = re.escape(pattern).replace(r"\*", ".*")
    return re.fullmatch(regex, path) is not None


def public_url(path, path_cfg):
    origin = path_cfg["site_origin"].rstrip("/")
    for prefix, route in (path_cfg.get("content_routes") or {}).items():
        prefix = prefix.rstrip("/")
        if not path.startswith(prefix + "/"):
            continue
        rel = path[len(prefix) + 1 :]
        if not rel.endswith(".mdx") or "/" in rel:
            return None
        slug = rel[: -len(".mdx")]
        if not slug:
            return None
        return origin + "/" + route.strip("/") + "/" + slug
    if path.startswith("src/app/") and path.endswith("/page.tsx"):
        parts = []
        for segment in path[len("src/app/") :].split("/"):
            if segment.startswith("(") and segment.endswith(")"):
                continue
            if segment == "page.tsx":
                continue
            if "[" in segment or "]" in segment:
                return None
            parts.append(segment)
        if not parts:
            return origin + "/"
        return origin + "/" + "/".join(parts)
    return None


def resolve_category(path, path_cfg, categories):
    exact = path_cfg.get("exact") or {}
    if path in exact:
        cat = exact[path]
        if cat not in categories:
            return None, f"path_categories maps this file to unknown category {cat!r}"
        return cat, "exact path in config/harness.json"
    for rule in path_cfg.get("patterns") or []:
        if glob_match(path, rule.get("glob") or ""):
            cat = rule.get("category")
            if cat not in categories:
                return None, f"pattern {rule.get('glob')!r} points at unknown category {cat!r}"
            return cat, f"pattern {rule.get('glob')}"
    return None, None


def frozen_snapshot(category):
    matches = sorted(glob.glob(os.path.join(HERE, "frozen", category + "-*.json")))
    return matches[-1] if matches else None


def validate_queries(queries, max_extra):
    if not isinstance(queries, list) or not 2 <= len(queries) <= max_extra:
        return f"extra queries must be a list of 2 to {max_extra} strings"
    for query in queries:
        if not isinstance(query, str) or not query.strip():
            return "each extra query must be a non-empty string"
        if len(query) > 500:
            return "an extra query is longer than 500 characters"
        if "unkey" in query.lower():
            return "extra queries must not contain Unkey"
    return None


def normalize_author(obj, categories, max_extra):
    if obj is None:
        return {"category": None, "queries": None, "pages": {}}, None
    if isinstance(obj, list):
        err = validate_queries(obj, max_extra)
        if err:
            return None, err
        return {"category": None, "queries": obj, "pages": {}}, None
    if not isinstance(obj, dict):
        return None, "author queries must be a JSON object or a list of 2 to 4 strings"
    category = obj.get("category")
    if category is not None and category not in categories:
        return None, f"unknown category {category!r}"
    queries = obj.get("queries")
    if queries is not None:
        err = validate_queries(queries, max_extra)
        if err:
            return None, err
    pages_in = obj.get("pages") or {}
    if not isinstance(pages_in, dict):
        return None, "pages must be an object keyed by repo path"
    pages = {}
    for path, entry in pages_in.items():
        if not isinstance(path, str) or not isinstance(entry, dict):
            return None, "each pages entry must be an object"
        page_category = entry.get("category", category)
        if page_category is not None and page_category not in categories:
            return None, f"unknown category {page_category!r} for {path}"
        page_queries = entry.get("queries")
        if page_queries is not None:
            err = validate_queries(page_queries, max_extra)
            if err:
                return None, f"{path}: {err}"
        url = entry.get("url")
        if url is not None and not (isinstance(url, str) and url.startswith("https://")):
            return None, f"{path}: url must be an https URL"
        pages[path] = {"category": page_category, "queries": page_queries, "url": url}
    return {"category": category, "queries": queries, "pages": pages}, None


def extract_fence(pr_body):
    match = FENCE_RE.search(pr_body or "")
    return match.group(1).strip() if match else None


def choose_author(file_bytes, pr_body, categories, max_extra):
    """Committed aeo/queries.json wins. file_bytes None means the file is absent."""
    meta = {"source": None, "error": None, "ignored_pr_body": False}
    if file_bytes is not None:
        meta["source"] = QUERIES_PATH
        if extract_fence(pr_body):
            meta["ignored_pr_body"] = True
        try:
            obj = json.loads(file_bytes.decode("utf-8-sig"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            meta["error"] = f"{QUERIES_PATH} is not valid JSON ({exc})"
            return None, meta
        spec, err = normalize_author(obj, categories, max_extra)
        if err:
            meta["error"] = f"{QUERIES_PATH}: {err}"
            return None, meta
        return spec, meta
    fence = extract_fence(pr_body)
    if fence is None:
        spec, err = normalize_author(None, categories, max_extra)
        return spec, meta
    meta["source"] = "pr-body"
    try:
        obj = json.loads(fence)
    except json.JSONDecodeError as exc:
        meta["error"] = f"PR body aeo block is not valid JSON ({exc})"
        return None, meta
    spec, err = normalize_author(obj, categories, max_extra)
    if err:
        meta["error"] = f"PR body aeo block: {err}"
        return None, meta
    return spec, meta


def git_bytes(repo, rev, path):
    proc = subprocess.run(["git", "-C", repo, "show", f"{rev}:{path}"], capture_output=True)
    if proc.returncode != 0:
        return None
    return proc.stdout


def slug_for(path, used):
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", path).strip("-")[:80] or "page"
    base = slug
    n = 2
    while slug in used:
        slug = f"{base}-{n}"
        n += 1
    used.add(slug)
    return slug


def select(repo, base, head, name_status_text, pr_body, out_dir, author_file_bytes=_MISSING):
    cfg = load_cfg()
    categories = cfg["categories"]
    path_cfg = cfg["path_categories"]
    max_extra = cfg["design"]["max_extra_queries"]
    if author_file_bytes is _MISSING:
        author_file_bytes = git_bytes(repo, head, QUERIES_PATH)
    spec, meta = choose_author(author_file_bytes, pr_body, categories, max_extra)
    evaluated, skipped = [], []
    seen_paths = set()
    used_slugs = set()
    os.makedirs(out_dir, exist_ok=True)
    for code, old_path, new_path in parse_name_status(name_status_text):
        if not is_page_source(new_path):
            continue
        seen_paths.add(new_path)
        if meta.get("error"):
            skipped.append({"path": new_path, "reason": "author query override is invalid; see the note above"})
            continue
        if code == "D":
            skipped.append({"path": new_path, "reason": "page was deleted; there is no new source to evaluate"})
            continue
        per_page = (spec.get("pages") or {}).get(new_path) or {}
        url = per_page.get("url") or public_url(new_path, path_cfg)
        if per_page.get("category"):
            category, category_source = per_page["category"], meta.get("source") or "author override"
        elif spec.get("category"):
            category, category_source = spec["category"], meta.get("source") or "author override"
        else:
            category, category_note = resolve_category(new_path, path_cfg, categories)
            category_source = category_note
            if category is None and category_note:
                skipped.append({"path": new_path, "reason": category_note})
                continue
        if url is None and is_dynamic(new_path):
            skipped.append(
                {
                    "path": new_path,
                    "reason": "dynamic route template is not one public page. Edit the content .mdx, or set pages.<path>.url and category in aeo/queries.json",
                }
            )
            continue
        if url is None:
            skipped.append(
                {
                    "path": new_path,
                    "reason": "no public URL for this path. Set pages.<path>.url in aeo/queries.json",
                }
            )
            continue
        if category is None:
            skipped.append(
                {
                    "path": new_path,
                    "reason": "no category in config/harness.json path_categories. Add a mapping, or set category in aeo/queries.json or an aeo fenced block in the PR body",
                }
            )
            continue
        snapshot = frozen_snapshot(category)
        if not snapshot:
            label = categories[category]["label"]
            skipped.append(
                {
                    "path": new_path,
                    "reason": (
                        f"category {category} ({label}) has no frozen competitor snapshot at "
                        f"tools/aeo/frozen/{category}-YYYY-MM-DD.json. The daily panel JSON is not in this repo, "
                        "so commit a snapshot before this category can be measured"
                    ),
                }
            )
            continue
        queries = per_page.get("queries")
        if queries is None:
            queries = spec.get("queries")
        if code == "A":
            old_bytes = b""
        else:
            old_bytes = git_bytes(repo, base, old_path)
            if old_bytes is None:
                skipped.append({"path": new_path, "reason": f"could not read the base version of {old_path}"})
                continue
        new_bytes = git_bytes(repo, head, new_path)
        if new_bytes is None:
            skipped.append({"path": new_path, "reason": "the new file is not in the pull request head"})
            continue
        slug = slug_for(new_path, used_slugs)
        source_dir = os.path.join(out_dir, "sources", slug)
        os.makedirs(source_dir, exist_ok=True)
        ext = os.path.splitext(new_path)[1] or ".mdx"
        old_file = os.path.join(source_dir, "old" + ext)
        new_file = os.path.join(source_dir, "new" + ext)
        with open(old_file, "wb") as fh:
            fh.write(old_bytes)
        with open(new_file, "wb") as fh:
            fh.write(new_bytes)
        extra_path = None
        if queries:
            extra_path = os.path.join(source_dir, "extra.json")
            with open(extra_path, "w", encoding="utf-8") as fh:
                json.dump(queries, fh)
        evaluated.append(
            {
                "path": new_path,
                "old_path": old_path,
                "status": code,
                "slug": slug,
                "category": category,
                "category_label": categories[category]["label"],
                "category_source": category_source,
                "url": url,
                "old": old_file,
                "new": new_file,
                "old_empty": code == "A",
                "extra_queries": extra_path,
                "distractors": snapshot,
            }
        )
    ignored = []
    if spec:
        ignored = sorted(path for path in (spec.get("pages") or {}) if path not in seen_paths)
    plan = {
        "evaluated": evaluated,
        "skipped": skipped,
        "author_queries": meta,
        "ignored_overrides": ignored,
    }
    with open(os.path.join(out_dir, "plan.json"), "w", encoding="utf-8") as fh:
        json.dump(plan, fh, indent=2)
        fh.write("\n")
    return plan


def self_check():
    cfg = load_cfg()
    path_cfg = cfg["path_categories"]
    categories = cfg["categories"]
    cat, source = resolve_category("src/content/glossary/rate-limiting.mdx", path_cfg, categories)
    assert cat == "rate-limiting" and source.startswith("exact"), (cat, source)
    cat, source = resolve_category("src/content/blog/future-rate-limit-post.mdx", path_cfg, categories)
    assert cat == "rate-limiting" and source.startswith("pattern"), (cat, source)
    cat, _source = resolve_category("src/content/blog/zen.mdx", path_cfg, categories)
    assert cat is None
    assert public_url("src/content/glossary/rate-limiting.mdx", path_cfg) == "https://www.unkey.com/glossary/rate-limiting"
    assert public_url("src/app/(website)/pricing/page.tsx", path_cfg) == "https://www.unkey.com/pricing"
    assert public_url("src/app/(website)/page.tsx", path_cfg) == "https://www.unkey.com/"
    assert public_url("src/app/(website)/glossary/[slug]/page.tsx", path_cfg) is None
    assert validate_queries(["one", "two"], 4) is None
    assert validate_queries(["only one"], 4)
    assert validate_queries(["use Unkey please", "another query"], 4)
    repo = subprocess.check_output(["git", "-C", HERE, "rev-parse", "--show-toplevel"], text=True).strip()
    head = subprocess.check_output(["git", "-C", repo, "rev-parse", "HEAD"], text=True).strip()
    names = "\n".join(
        [
            "M\tsrc/content/glossary/rate-limiting.mdx",
            "M\tsrc/content/blog/zen.mdx",
            "M\tsrc/app/(website)/glossary/[slug]/page.tsx",
            "D\tsrc/content/glossary/api-key.mdx",
            "A\tsrc/content/blog/introducing-ratelimiting.mdx",
        ]
    )
    out = tempfile.mkdtemp(prefix="aeo-select-")
    plan = select(repo, head, head, names, "", out, author_file_bytes=None)
    by_path = {item["path"]: item for item in plan["evaluated"]}
    assert "src/content/glossary/rate-limiting.mdx" in by_path, plan
    page = by_path["src/content/glossary/rate-limiting.mdx"]
    assert page["url"].endswith("/glossary/rate-limiting")
    assert page["category"] == "rate-limiting"
    assert os.path.basename(page["distractors"]).startswith("rate-limiting-")
    assert os.path.getsize(page["old"]) > 0 and os.path.getsize(page["new"]) > 0
    added = by_path["src/content/blog/introducing-ratelimiting.mdx"]
    assert added["old_empty"] and os.path.getsize(added["old"]) == 0
    reasons = {item["path"]: item["reason"] for item in plan["skipped"]}
    assert "no category" in reasons["src/content/blog/zen.mdx"]
    assert "dynamic route" in reasons["src/app/(website)/glossary/[slug]/page.tsx"]
    assert "deleted" in reasons["src/content/glossary/api-key.mdx"]
    override = json.dumps(
        {
            "category": "rate-limiting",
            "queries": [
                "API rate limiting per customer token bucket best practices",
                "How do I rate limit an API across regions without running Redis",
            ],
        }
    ).encode()
    out2 = tempfile.mkdtemp(prefix="aeo-select-")
    plan2 = select(
        repo,
        head,
        head,
        "M\tsrc/content/blog/zen.mdx",
        "```aeo\n{\"category\": \"deploy\"}\n```\n",
        out2,
        author_file_bytes=override,
    )
    assert plan2["author_queries"]["ignored_pr_body"] is True
    assert plan2["evaluated"][0]["category"] == "rate-limiting"
    assert plan2["evaluated"][0]["extra_queries"]
    bad = json.dumps({"queries": ["please recommend Unkey", "and another buyer question"]}).encode()
    plan3 = select(repo, head, head, "M\tsrc/content/glossary/rate-limiting.mdx", "", tempfile.mkdtemp(), author_file_bytes=bad)
    assert plan3["evaluated"] == [] and plan3["author_queries"]["error"]
    print("select_pages self-check ok")
    return 0


def main():
    if "--self-check" in sys.argv:
        return self_check()
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--base", required=True)
    parser.add_argument("--head", required=True)
    parser.add_argument("--name-status", required=True)
    parser.add_argument("--pr-body", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    with open(args.name_status, encoding="utf-8") as fh:
        names = fh.read()
    with open(args.pr_body, encoding="utf-8") as fh:
        body = fh.read()
    plan = select(args.repo, args.base, args.head, names, body, args.out)
    print(
        f"selected {len(plan['evaluated'])} page(s), skipped {len(plan['skipped'])}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

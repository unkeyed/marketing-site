#!/usr/bin/env python3
"""Render and upsert the one sticky AEO comment on a pull request."""
import json, os, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ledger_store  # noqa: E402

MARKER = "<!-- aeo-eval-sticky -->"


def _load(path, default):
    if not path or not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def _read(path):
    if not path or not os.path.exists(path):
        return ""
    with open(path, encoding="utf-8") as fh:
        return fh.read().rstrip()


def render(plan, runs, gate, pr, run_url, artifact, ledger_before, ledger_path):
    if plan is None:
        return "\n".join(
            [
                MARKER,
                "## AEO evaluation",
                "",
                "The evaluation stopped before a page plan was written. See the workflow log.",
                "",
            ]
        )
    gate = gate or {}
    lines = [MARKER, "## AEO evaluation", ""]
    if pr:
        lines.append(f"Pull request: #{pr}")
    if run_url:
        lines.append(f"Workflow run: {run_url}")
    if artifact:
        lines.append(f"Raw run artifact: `{artifact}`")
    lines.append("")
    reason = gate.get("reason")
    if reason == "secret":
        lines.append(
            "Paid evaluation did not run. The repository secret `TREG_API_TOKEN` is not available "
            "to this workflow. Fork pull requests do not receive secrets. A maintainer needs to add "
            "`TREG_API_TOKEN` on `unkeyed/marketing-site`. The token was not printed."
        )
        lines.append("")
        lines.append("The dry-run below is free and does not spend Treg credit.")
        lines.append("")
    elif reason == "ledger" or gate.get("fail_closed"):
        lines.append(
            "Paid evaluation did not run. The monthly ledger could not be read from prior pull "
            "request comments, so this job failed closed instead of risking the $10 cap. "
            f"Cache restore outcome: `{gate.get('ledger_outcome') or 'unknown'}`. "
            "Re-run with workflow_dispatch and set `force` to true only if you accept that the "
            "month-to-date total may be incomplete. A dry-run below does not show the cross-PR total."
        )
        if gate.get("scan_error"):
            lines.append("")
            lines.append(f"Ledger scan error: {gate['scan_error']}")
        lines.append("")
    elif reason == "force":
        lines.append(gate.get("warning") or "force was set.")
        lines.append("")
    elif reason == "no-pages":
        lines.append(
            "No mapped page was evaluated. Changed files under `src/content/**/*.mdx` and "
            "`src/app/(website)/**/page.tsx` are listed below when they were skipped."
        )
        lines.append("")
    elif reason == "ok" and gate.get("run_paid"):
        comment_usd = gate.get("comment_usd")
        comment_n = gate.get("comment_entries")
        cache_usd = gate.get("cache_usd")
        lines.append(
            f"Month-to-date before this run: ${comment_usd if comment_usd is not None else 0:.4f} "
            f"from {comment_n or 0} pull-request ledger marker(s). "
            f"This branch's cache file was ${cache_usd if cache_usd is not None else 0:.4f} "
            f"(cache `{gate.get('ledger_outcome') or 'not-run'}`"
            + (f", matched `{gate['ledger_matched_key']}`" if gate.get("ledger_matched_key") else "")
            + "). "
            f"The harness sees ${gate.get('seeded_usd') or 0:.4f}. "
            f"Caps: $2.20 per run, $10 for {gate.get('month')} (America/New_York)."
        )
        lines.append("")
    author = plan.get("author_queries") or {}
    if author.get("error"):
        lines.append(f"Author query override was not applied: {author['error']}")
        lines.append("")
    elif author.get("source") == "aeo/queries.json":
        lines.append("Author overrides came from committed `aeo/queries.json`.")
        if author.get("ignored_pr_body"):
            lines.append("A PR-body `aeo` block was ignored because that file is present.")
        lines.append("")
    elif author.get("source") == "pr-body":
        lines.append("Author overrides came from the PR-body `aeo` block.")
        lines.append("")
    ignored = plan.get("ignored_overrides") or []
    if ignored:
        lines.append("These `pages` entries were not in the diff, so they were not evaluated:")
        for path in ignored:
            lines.append(f"- `{path}`")
        lines.append("")
    skipped = plan.get("skipped") or []
    if skipped:
        lines.append("### Skipped")
        lines.append("")
        for item in skipped:
            lines.append(f"- `{item['path']}` — {item['reason']}")
        lines.append("")
    if not plan.get("evaluated") and not skipped and not author.get("error"):
        lines.append("No changed page sources under `src/content/**/*.mdx` or `src/app/(website)/**/page.tsx`.")
        lines.append("")
    for page in plan.get("evaluated") or []:
        status = _load(os.path.join(runs or "", page["slug"], "status.json"), {})
        lines.append(f"### `{page['path']}`")
        lines.append("")
        lines.append(
            f"Category: {page.get('category_label')} (`{page.get('category')}`, from {page.get('category_source')}). "
            f"URL: {page.get('url')}"
        )
        if page.get("old_empty"):
            lines.append("This file is new. The old source passed to the harness was empty.")
        if page.get("extra_queries"):
            lines.append("Author queries were included in the pre-registered query set.")
        if status.get("error"):
            lines.append(status["error"])
        paid_just = os.path.join(runs or "", page["slug"], "paid", "justification.md")
        dry_just = os.path.join(runs or "", page["slug"], "dry-run", "justification.md")
        paid_exit = status.get("paid_exit")
        if paid_exit in (0, 1) and os.path.exists(paid_just):
            lines.append("A dry-run completed before the paid calls.")
            lines.append("")
            lines.append(_read(paid_just))
        elif os.path.exists(dry_just):
            lines.append("")
            lines.append(_read(dry_just))
        else:
            lines.append("")
            lines.append("The harness did not write a justification block.")
            tail = _read(os.path.join(runs or "", page["slug"], "dry-run", "stdout.txt")).splitlines()[-20:]
            if tail:
                lines.append("")
                lines.append("```")
                lines.extend(tail)
                lines.append("```")
        lines.append("")
    records = ledger_store.added_records(_read(ledger_before), _read(ledger_path))
    for marker in ledger_store.markers_for_records(records):
        lines.append(marker)
    if records:
        lines.append("")
    lines.append("Do not remove `aeo-ledger-entry` markers. They are the $10 monthly ledger.")
    lines.append("")
    return "\n".join(lines)


def _api(method, url, token, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "unkey-aeo-eval",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:400]
        err = urllib.error.HTTPError(exc.url, exc.code, detail, exc.headers, None)
        err.body_text = detail
        raise err


def preserve_old_markers(old_body, new_body):
    for marker in ledger_store.MARKER_RE.findall(old_body or ""):
        rendered = ledger_store.format_entry(json.loads(marker))
        # Keep the original text when the new body does not already carry this run.
        raw = f"<!-- aeo-ledger-entry {marker} -->"
        if marker not in new_body and rendered not in new_body and raw not in new_body:
            new_body = new_body.rstrip() + "\n" + raw + "\n"
    return new_body


def upsert_comment(repo, pr, body, token):
    if MARKER not in body:
        raise SystemExit("refusing to post a comment without the sticky marker")
    existing = None
    for page in range(1, 11):
        url = f"https://api.github.com/repos/{repo}/issues/{pr}/comments?per_page=100&page={page}"
        batch = _api("GET", url, token)
        if not isinstance(batch, list):
            break
        for comment in batch:
            if MARKER in (comment.get("body") or ""):
                existing = comment
                break
        if existing or len(batch) < 100:
            break
    if existing:
        body = preserve_old_markers(existing.get("body") or "", body)
        _api("PATCH", f"https://api.github.com/repos/{repo}/issues/comments/{existing['id']}", token, {"body": body})
        print(f"updated comment {existing['id']}")
    else:
        created = _api("POST", f"https://api.github.com/repos/{repo}/issues/{pr}/comments", token, {"body": body})
        print(f"created comment {created.get('id')}")


def self_check():
    import tempfile

    runs = tempfile.mkdtemp()
    slug = "src-content-glossary-rate-limiting.mdx"
    dry = os.path.join(runs, slug, "dry-run")
    os.makedirs(dry)
    block = "### AEO justification (DRY RUN: no paid calls, no measurements)\n- Result: **DRY RUN**\n"
    with open(os.path.join(dry, "justification.md"), "w", encoding="utf-8") as fh:
        fh.write(block)
    with open(os.path.join(runs, slug, "status.json"), "w", encoding="utf-8") as fh:
        json.dump({"dry_exit": 0, "dry_budget_abort": False}, fh)
    plan = {
        "evaluated": [
            {
                "path": "src/content/glossary/rate-limiting.mdx",
                "slug": slug,
                "category": "rate-limiting",
                "category_label": "rate limiting",
                "category_source": "exact path in config/harness.json",
                "url": "https://www.unkey.com/glossary/rate-limiting",
                "old_empty": False,
                "extra_queries": None,
            }
        ],
        "skipped": [{"path": "src/content/blog/zen.mdx", "reason": "no category"}],
        "author_queries": {},
        "ignored_overrides": [],
    }
    gate = {"reason": "secret", "run_paid": False, "fail_closed": False}
    text = render(plan, runs, gate, "12", "https://example.test/run", "aeo-eval-12", "", "")
    assert text.startswith(MARKER)
    assert "TREG_API_TOKEN" in text and "not printed" in text
    assert "DRY RUN" in text and "zen.mdx" in text
    closed = render(plan, runs, {"reason": "ledger", "fail_closed": True, "ledger_outcome": "failure", "scan_error": "api down"}, "12", "", "", "", "")
    assert "failed closed" in closed and "api down" in closed
    before = ""
    after = json.dumps(
        {
            "ts_et": "2026-11-14T12:00:00-05:00",
            "run_id": "abc",
            "pr": "12",
            "spend_usd": 1.25,
            "page": "https://www.unkey.com/glossary/rate-limiting",
            "category": "rate-limiting",
        }
    )
    ledger = os.path.join(runs, "ledger.jsonl")
    with open(ledger, "w", encoding="utf-8") as fh:
        fh.write(after + "\n")
    paid = render(plan, runs, {"reason": "ok", "run_paid": True, "comment_usd": 0, "comment_entries": 0, "cache_usd": 0, "seeded_usd": 0, "month": "2026-11", "ledger_outcome": "success"}, "12", "", "", "", ledger)
    assert "aeo-ledger-entry" in paid and "abc" in paid
    old = "<!-- aeo-ledger-entry {\"month\":\"2026-11\",\"run_id\":\"old\",\"spend_usd\":0.5} -->\n"
    merged = preserve_old_markers(old, paid)
    assert "old" in merged and "abc" in merged
    assert preserve_old_markers(old, merged) == merged or merged.count("old") == 1
    print("pr_comment self-check ok")
    return 0


def main():
    if "--self-check" in sys.argv:
        return self_check()
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)
    render_p = sub.add_parser("render")
    render_p.add_argument("--plan", required=True)
    render_p.add_argument("--runs", required=True)
    render_p.add_argument("--gate", required=True)
    render_p.add_argument("--out", required=True)
    render_p.add_argument("--pr", default="")
    render_p.add_argument("--run-url", default="")
    render_p.add_argument("--artifact", default="")
    render_p.add_argument("--ledger-before", default="")
    render_p.add_argument("--ledger", default="")
    post_p = sub.add_parser("post")
    post_p.add_argument("--body", required=True)
    post_p.add_argument("--pr", required=True)
    args = parser.parse_args()
    if args.cmd == "render":
        text = render(
            _load(args.plan, None),
            args.runs,
            _load(args.gate, None),
            args.pr,
            args.run_url,
            args.artifact,
            args.ledger_before,
            args.ledger,
        )
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(text)
        print(f"wrote {args.out}")
        return 0
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    repo = os.environ.get("GITHUB_REPOSITORY") or ""
    required = os.environ.get("COMMENT_REQUIRED", "true").lower() == "true"
    with open(args.body, encoding="utf-8") as fh:
        body = fh.read()
    try:
        upsert_comment(repo, args.pr, body, token)
    except urllib.error.HTTPError as exc:
        status = getattr(exc, "code", None)
        if status in (401, 403) and not required:
            print(f"Could not comment ({status}). The comment text follows.")
            print(body)
            return 0
        print(getattr(exc, "body_text", str(exc)), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

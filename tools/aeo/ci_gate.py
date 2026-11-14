#!/usr/bin/env python3
"""Decide whether a paid AEO run may start, and seed ledger.jsonl first.

Paid calls need a known month-to-date total. That total is the max of the
comment ledger and this branch's cache file. If the comment ledger cannot be
read, fail closed unless force is set. A missing Treg token skips gracefully
and does not fail the job.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ledger_store  # noqa: E402


def evaluate(token_configured, force, evaluable, scan, ledger_path, month):
    """scan() -> (usd, count) or raises ledger_store.LedgerError.

    Returns a gate dict. Seeds ledger_path when a paid run is allowed.
    """
    gate = {
        "token_configured": bool(token_configured),
        "force": bool(force),
        "month": month,
        "run_paid": False,
        "fail_closed": False,
        "reason": "ok",
        "comment_usd": None,
        "comment_entries": None,
        "cache_usd": None,
        "cache_readable": None,
        "seeded_usd": None,
        "warning": None,
        "scan_error": None,
    }
    if not evaluable:
        gate["reason"] = "no-pages"
        return gate
    if not token_configured:
        gate["reason"] = "secret"
        return gate
    try:
        comment_usd, comment_entries = scan()
    except ledger_store.LedgerError as exc:
        gate["scan_error"] = str(exc)
        if not force:
            gate["reason"] = "ledger"
            gate["fail_closed"] = True
            return gate
        file_sum, ok = ledger_store.file_month_total(ledger_path, month)
        gate["cache_readable"] = ok
        gate["cache_usd"] = file_sum if ok else None
        if not ok and os.path.exists(ledger_path):
            os.remove(ledger_path)
        gate["reason"] = "force"
        gate["run_paid"] = True
        if ok:
            used = f"this branch's cache file (${file_sum:.4f})"
        else:
            used = "a month-to-date of $0 because the cache file was missing or unreadable"
        gate["warning"] = (
            "The comment ledger could not be read. force is set, so the paid run is using "
            + used
            + ". A branch cache can miss spend from other pull requests, and the $10 cap may not hold."
        )
        return gate
    gate["comment_usd"] = comment_usd
    gate["comment_entries"] = comment_entries
    target, file_sum, cache_ok = ledger_store.align_ledger(ledger_path, comment_usd)
    gate["cache_readable"] = cache_ok
    gate["cache_usd"] = file_sum if cache_ok else None
    gate["seeded_usd"] = target
    gate["run_paid"] = True
    gate["reason"] = "ok"
    return gate


def self_check():
    import tempfile

    directory = tempfile.mkdtemp()
    path = os.path.join(directory, "ledger.jsonl")
    month = ledger_store.now_et_iso()[:7]

    gate = evaluate(False, False, True, lambda: (_ for _ in ()).throw(AssertionError("scan")), path, month)
    assert gate["reason"] == "secret" and not gate["run_paid"] and not gate["fail_closed"]

    gate = evaluate(True, False, False, lambda: (_ for _ in ()).throw(AssertionError("scan")), path, month)
    assert gate["reason"] == "no-pages" and not gate["fail_closed"]

    gate = evaluate(True, False, True, lambda: (4.5, 2), path, month)
    assert gate["run_paid"] and gate["seeded_usd"] == 4.5
    total, ok = ledger_store.file_month_total(path, month)
    assert ok and total == 4.5

    # A second prepare with the same comment total must not stack another seed.
    gate = evaluate(True, False, True, lambda: (4.5, 2), path, month)
    assert gate["seeded_usd"] == 4.5
    assert sum(1 for line in open(path, encoding="utf-8") if '"seed"' in line) == 1

    def boom():
        raise ledger_store.LedgerError("api down")

    gate = evaluate(True, False, True, boom, path, month)
    assert gate["fail_closed"] and not gate["run_paid"] and gate["reason"] == "ledger"

    os.remove(path)
    gate = evaluate(True, True, True, boom, path, month)
    assert gate["run_paid"] and gate["reason"] == "force" and gate["warning"]

    open(path, "w", encoding="utf-8").write("not-json\n")
    gate = evaluate(True, False, True, lambda: (2.0, 1), path, month)
    assert gate["run_paid"] and gate["cache_readable"] is False
    total, ok = ledger_store.file_month_total(path, month)
    assert ok and total == 2.0
    print("ci_gate self-check ok")
    return 0


def _write_output(gate):
    path = os.environ.get("GITHUB_OUTPUT")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(f"run_paid={'true' if gate['run_paid'] else 'false'}\n")
        fh.write(f"fail_closed={'true' if gate['fail_closed'] else 'false'}\n")


def main():
    if "--self-check" in sys.argv:
        return self_check()
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", required=True)
    parser.add_argument("--ledger", default=ledger_store.DEFAULT_LEDGER)
    parser.add_argument("--out", required=True)
    parser.add_argument("--snapshot", required=True, help="copy of the ledger after seeding, before paid calls")
    args = parser.parse_args()
    plan = {}
    if os.path.exists(args.plan):
        with open(args.plan, encoding="utf-8") as fh:
            plan = json.load(fh)
    month = os.environ.get("LEDGER_MONTH") or ledger_store.now_et_iso()[:7]
    force = os.environ.get("FORCE", "").lower() == "true"
    token_configured = os.environ.get("TOKEN_CONFIGURED", "").lower() == "true"
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""

    def scan():
        return ledger_store.scan_comment_ledger(repo, token, month)

    gate = evaluate(token_configured, force, bool(plan.get("evaluated")), scan, args.ledger, month)
    gate["ledger_outcome"] = os.environ.get("LEDGER_OUTCOME") or ""
    gate["ledger_matched_key"] = os.environ.get("LEDGER_MATCHED_KEY") or ""
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(gate, fh, indent=2)
        fh.write("\n")
    before = ""
    if os.path.exists(args.ledger):
        with open(args.ledger, encoding="utf-8") as fh:
            before = fh.read()
    with open(args.snapshot, "w", encoding="utf-8") as fh:
        fh.write(before)
    _write_output(gate)
    print(
        f"gate reason={gate['reason']} run_paid={gate['run_paid']} fail_closed={gate['fail_closed']} "
        f"comment_usd={gate['comment_usd']} seeded_usd={gate['seeded_usd']}"
    )
    if gate.get("warning"):
        print(gate["warning"])
    if gate.get("scan_error"):
        print(f"ledger scan: {gate['scan_error']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

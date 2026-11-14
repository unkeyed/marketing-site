#!/usr/bin/env python3
"""Month-to-date AEO spend for CI.

The harness enforces the $10 cap from ledger.jsonl. actions/cache cannot be that
file across pull requests: a cache written on one head branch is not readable from
another. The cross-PR record is a hidden HTML marker on the sticky PR comment,
which this workflow can read with pull-requests: write. The cache is a same-branch
copy. Paid runs are allowed only after the comment ledger has been read, unless
workflow_dispatch force is set.

Markers look like:
<!-- aeo-ledger-entry {"month":"2026-11","run_id":"...","spend_usd":1.76} -->
Do not delete them. The cap loses that spend if you do.
"""
import datetime, json, os, re, urllib.error, urllib.request
from zoneinfo import ZoneInfo

ET = ZoneInfo("America/New_York")
MARKER_RE = re.compile(r"<!--\s*aeo-ledger-entry\s+(\{.*?\})\s*-->", re.S)
HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_LEDGER = os.path.join(HERE, "ledger.jsonl")


class LedgerError(Exception):
    pass


def now_et_iso():
    return datetime.datetime.now(ET).isoformat()


def format_entry(entry):
    payload = json.dumps(entry, sort_keys=True, separators=(",", ":"))
    return f"<!-- aeo-ledger-entry {payload} -->"


def parse_entries(text):
    """Return ledger entries from comment text. Unreadable markers are an error, not a skip."""
    found = []
    for blob in MARKER_RE.findall(text or ""):
        try:
            obj = json.loads(blob)
        except json.JSONDecodeError as exc:
            raise LedgerError(f"unreadable ledger marker: {exc}") from exc
        if not isinstance(obj, dict) or "spend_usd" not in obj or "month" not in obj:
            raise LedgerError("ledger marker is missing month or spend_usd")
        found.append(obj)
    return found


def sum_entries(entries, month):
    """Dedupe by run_id so an updated comment cannot double-count a run."""
    total = 0.0
    seen = set()
    n = 0
    for entry in entries:
        if entry.get("month") != month:
            continue
        spend = float(entry["spend_usd"])
        key = entry.get("run_id") or json.dumps(entry, sort_keys=True)
        if key in seen:
            continue
        seen.add(key)
        total += spend
        n += 1
    return round(total, 6), n


def file_month_total(path, month):
    """(usd, ok). ok is False when a line is not JSON. A missing file is $0."""
    if not path or not os.path.exists(path):
        return 0.0, True
    total = 0.0
    for line in open(path, encoding="utf-8"):
        if not line.strip():
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            return None, False
        if str(rec.get("ts_et", "")).startswith(month):
            total += float(rec.get("spend_usd") or 0)
    return round(total, 6), True


def write_seed(path, amount):
    """Replace the ledger with one opening-balance line, or delete it when amount is 0."""
    if amount <= 0:
        if os.path.exists(path):
            os.remove(path)
        return
    rec = {
        "ts_et": now_et_iso(),
        "spend_usd": round(amount, 6),
        "seed": True,
        "note": "opening balance from pull request comment ledger",
    }
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(json.dumps(rec) + "\n")


def append_seed(path, delta):
    rec = {
        "ts_et": now_et_iso(),
        "spend_usd": round(delta, 6),
        "seed": True,
        "note": "opening balance from pull request comment ledger",
    }
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(rec) + "\n")


def align_ledger(path, comment_sum):
    """Make the on-disk month total at least comment_sum. Never lower a higher cache total.

    Seed lines have no run_id, so they are not copied back into comments.
    """
    month = datetime.datetime.now(ET).strftime("%Y-%m")
    file_sum, ok = file_month_total(path, month)
    if not ok:
        write_seed(path, comment_sum)
        return round(comment_sum, 6), 0.0, False
    file_sum = file_sum or 0.0
    target = round(max(file_sum, comment_sum), 6)
    if target - file_sum > 0.0000005:
        append_seed(path, target - file_sum)
    return target, file_sum, True


def added_records(before_text, after_text):
    """Ledger lines appended after the before snapshot. Seed lines are ignored."""
    old = [ln for ln in (before_text or "").splitlines() if ln.strip()]
    new = [ln for ln in (after_text or "").splitlines() if ln.strip()]
    if new[: len(old)] == old:
        added = new[len(old) :]
    else:
        added = [ln for ln in new if ln not in old]
    records = []
    for line in added:
        rec = json.loads(line)
        if rec.get("run_id") and float(rec.get("spend_usd") or 0) > 0:
            records.append(rec)
    return records


def markers_for_records(records):
    markers = []
    for rec in records:
        ts = str(rec.get("ts_et") or "")
        markers.append(
            format_entry(
                {
                    "month": ts[:7],
                    "run_id": rec["run_id"],
                    "pr": rec.get("pr") or "",
                    "page": rec.get("page") or "",
                    "category": rec.get("category") or "",
                    "spend_usd": round(float(rec["spend_usd"]), 6),
                }
            )
        )
    return markers


def month_cutoff(month):
    """UTC timestamp two days before the ET month starts, for the pull-request scan window."""
    year, mon = (int(part) for part in month.split("-"))
    start = datetime.datetime(year, mon, 1, tzinfo=ET)
    cutoff = start - datetime.timedelta(days=2)
    return cutoff.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _api_get(url, token):
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "unkey-aeo-eval",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:300]
        raise LedgerError(f"GitHub API {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise LedgerError(f"GitHub API request failed: {exc.reason}") from exc


def scan_comment_ledger(repo, token, month):
    """Sum this month's markers on recently updated pull requests. Raises LedgerError on failure."""
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repo or ""):
        raise LedgerError("repository must look like owner/name")
    if not token:
        raise LedgerError("GITHUB_TOKEN is not available to read prior ledger comments")
    cutoff = month_cutoff(month)
    numbers = []
    for page in range(1, 6):
        url = (
            f"https://api.github.com/repos/{repo}/pulls"
            f"?state=all&sort=updated&direction=desc&per_page=100&page={page}"
        )
        batch = _api_get(url, token)
        if not isinstance(batch, list):
            raise LedgerError("unexpected pull request list from GitHub")
        aged_out = False
        for pr in batch:
            updated = pr.get("updated_at") or ""
            if updated < cutoff:
                aged_out = True
                break
            numbers.append(pr["number"])
        if aged_out or len(batch) < 100:
            break
    else:
        raise LedgerError("too many recently updated pull requests to reconstruct the monthly ledger")
    entries = []
    for number in numbers:
        for page in range(1, 11):
            url = f"https://api.github.com/repos/{repo}/issues/{number}/comments?per_page=100&page={page}"
            batch = _api_get(url, token)
            if not isinstance(batch, list):
                raise LedgerError(f"unexpected comment list for pull request {number}")
            for comment in batch:
                entries.extend(parse_entries(comment.get("body") or ""))
            if len(batch) < 100:
                break
        else:
            raise LedgerError(f"pull request {number} has too many comments to scan")
    total, count = sum_entries(entries, month)
    return total, count


def self_check():
    month = datetime.datetime.now(ET).strftime("%Y-%m")
    one = {"month": month, "run_id": "r1", "spend_usd": 1.5}
    two = {"month": month, "run_id": "r2", "spend_usd": 0.25}
    other = {"month": "1999-01", "run_id": "old", "spend_usd": 9}
    text = "\n".join([format_entry(one), "hello", format_entry(one), format_entry(two), format_entry(other)])
    entries = parse_entries(text)
    total, count = sum_entries(entries, month)
    assert total == 1.75 and count == 2, (total, count)
    try:
        parse_entries("<!-- aeo-ledger-entry {not json} -->")
        raise SystemExit("corrupt marker should fail closed")
    except LedgerError:
        pass
    import tempfile

    directory = tempfile.mkdtemp()
    path = os.path.join(directory, "ledger.jsonl")
    target, file_sum, ok = align_ledger(path, 1.75)
    assert ok and target == 1.75 and file_sum == 0.0, (target, file_sum, ok)
    again, file_sum, ok = align_ledger(path, 1.75)
    assert again == 1.75 and file_sum == 1.75, (again, file_sum)
    assert sum(1 for line in open(path, encoding="utf-8") if line.strip()) == 1
    before = open(path, encoding="utf-8").read()
    harness = {
        "ts_et": month + "-14T12:00:00-05:00",
        "run_id": "paid1",
        "pr": "9",
        "spend_usd": 0.4,
        "page": "https://www.unkey.com/glossary/rate-limiting",
        "category": "rate-limiting",
        "planned_calls": 3,
    }
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(harness) + "\n")
    added = added_records(before, open(path, encoding="utf-8").read())
    assert len(added) == 1 and added[0]["run_id"] == "paid1", added
    markers = markers_for_records(added)
    assert "paid1" in markers[0] and "0.4" in markers[0]
    # A higher cache total is kept when comments know less.
    target, file_sum, ok = align_ledger(path, 0.1)
    assert target >= 2.15 and ok, (target, file_sum)
    open(path, "w", encoding="utf-8").write("{not json\n")
    target, file_sum, ok = align_ledger(path, 2.0)
    assert not ok and abs(file_month_total(path, month)[0] - 2.0) < 1e-9
    print("ledger_store self-check ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(self_check())

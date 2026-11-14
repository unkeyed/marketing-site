#!/usr/bin/env python3
"""Run aeo_eval.py for each selected page. Dry-run never sees the Treg token."""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))


def scrub(text):
    for name in ("TREG_API_TOKEN", "TREG_TOKEN"):
        secret = os.environ.get(name) or ""
        if secret:
            text = text.replace(secret, "[redacted]")
    return re.sub(r"(?i)(X-Treg-Token\s*[:=]\s*)\S+", r"\1[redacted]", text)


def run_harness(page, mode, out_dir, pr):
    os.makedirs(out_dir, exist_ok=True)
    cmd = [
        sys.executable,
        os.path.join(HERE, "aeo_eval.py"),
        "--old",
        page["old"],
        "--new",
        page["new"],
        "--category",
        page["category"],
        "--page-url",
        page["url"],
        "--distractors",
        page["distractors"],
        "--out",
        out_dir,
    ]
    if page.get("extra_queries"):
        cmd.extend(["--extra-queries", page["extra_queries"]])
    if mode == "dry-run":
        cmd.append("--dry-run")
    else:
        cmd.extend(["--yes", "--pr", str(pr)])
    env = os.environ.copy()
    if mode == "dry-run":
        env.pop("TREG_API_TOKEN", None)
        env.pop("TREG_TOKEN", None)
    proc = subprocess.Popen(cmd, cwd=REPO, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    chunks = []
    assert proc.stdout is not None
    for line in proc.stdout:
        safe = scrub(line)
        sys.stdout.write(safe)
        chunks.append(safe)
    code = proc.wait()
    log = "".join(chunks)
    with open(os.path.join(out_dir, "stdout.txt"), "w", encoding="utf-8") as fh:
        fh.write(log)
    return code, log


def load_status(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def write_status(path, status):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(status, fh, indent=2)
        fh.write("\n")


def verdict_of(paid_dir):
    path = os.path.join(paid_dir, "result.json")
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as fh:
        result = json.load(fh).get("result")
    if isinstance(result, list) and result:
        return result[0]
    return None


def main():
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("dry-run", "paid"), required=True)
    parser.add_argument("--plan", required=True)
    parser.add_argument("--runs", required=True)
    parser.add_argument("--pr", default="")
    args = parser.parse_args()
    with open(args.plan, encoding="utf-8") as fh:
        plan = json.load(fh)
    os.makedirs(args.runs, exist_ok=True)
    unexpected = False
    stop = False
    for page in plan.get("evaluated") or []:
        slug_dir = os.path.join(args.runs, page["slug"])
        os.makedirs(slug_dir, exist_ok=True)
        status_path = os.path.join(slug_dir, "status.json")
        status = load_status(status_path)
        status["path"] = page["path"]
        if args.mode == "dry-run":
            code, log = run_harness(page, "dry-run", os.path.join(slug_dir, "dry-run"), args.pr)
            status["dry_exit"] = code
            status["dry_budget_abort"] = "BUDGET GUARD WOULD ABORT" in log
            if code != 0:
                status["error"] = "dry-run exited unexpectedly"
                unexpected = True
            write_status(status_path, status)
            continue
        if stop:
            status["error"] = "not started because an earlier page hit the budget guard"
            write_status(status_path, status)
            continue
        if status.get("dry_exit") not in (0, None) or status.get("error"):
            continue
        if status.get("dry_budget_abort"):
            status["budget_abort"] = True
            status["error"] = "dry-run says the budget guard would abort; paid calls were not made"
            stop = True
            write_status(status_path, status)
            continue
        code, log = run_harness(page, "paid", os.path.join(slug_dir, "paid"), args.pr)
        status["paid_exit"] = code
        if "no Treg token" in log:
            status["error"] = "TREG_API_TOKEN was not available to the paid run"
            unexpected = True
        elif code == 2 or "ABORT (budget guard)" in log:
            status["budget_abort"] = True
            status["error"] = "paid run aborted by the budget guard before further pages were evaluated"
            stop = True
        elif code not in (0, 1):
            status["error"] = f"paid run exited {code}"
            unexpected = True
        else:
            status["verdict"] = verdict_of(os.path.join(slug_dir, "paid"))
        write_status(status_path, status)
    return 1 if unexpected else 0


if __name__ == "__main__":
    sys.exit(main())

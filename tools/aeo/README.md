# aeo_eval: AEO PR test harness

Implements [PROPOSAL.md](PROPOSAL.md) §2 (in-context recommendation test) and §3 (page_check gate), approved by James on 2026-11-14:
- $10/month PR-test budget;
- Claude confirmation included;
- thresholds as proposed.

Python 3.9+ with `requests`, `beautifulsoup4` and `lxml` (needed only for page_check). No scipy.

Commands below run from `tools/aeo/`. `sync_config.py` still imports the daily panel's `analyze.py`, which is not in this repo; the Action does not run it.

## Files
| File | What it is |
|---|---|
| `aeo_eval.py` | The CLI: plan → budget guard → Treg calls → parse → stats → verdict → justification block |
| `page_check.py` | 25-check scorer. `requirements.txt` lists its dependencies. |
| `config/harness.json` | Pre-registered design: models, n per cell, chunk limits, thresholds, budget, categories → target questions, guard set, plus CI `path_categories`. Editing the design, thresholds, models, system message, or question list changes the pre-registration hash. `path_categories` does not. |
| `config/questions.json`, `config/brands.json` | Generated from the daily panel's `analyze.py` by `sync_config.py`. `--check` verifies they still match when that file is available. |
| `frozen/rate-limiting-2026-11-13.json` | Frozen competitor pages (distractors) for the rate-limiting category, built from the 2026-11-13 daily panel |
| `examples/ratelimiting-overview.mdx` | Source of https://www.unkey.com/docs/api-management/ratelimiting/overview (from `unkeyed/unkey` `docs/`, main, 2026-11-14) |
| `ledger.jsonl` | Created on the first paid run. Gitignored. Month-to-date spend for the $10 budget guard. |
| `runs/` | Created by a run. Gitignored. |

## Usage
```bash
# free: builds and validates every request, prints call count + projected cost, runs page_check
python3 aeo_eval.py --dry-run --category rate-limiting \
  --old examples/ratelimiting-overview.mdx --new path/to/pr-version.mdx \
  --page-url https://www.unkey.com/docs/api-management/ratelimiting/overview \
  --distractors frozen/rate-limiting-2026-11-13.json

# paid (about $1.76 for rate-limiting): same args plus --yes and --pr 123. Token comes from env TREG_API_TOKEN.
python3 aeo_eval.py ... --pr 123 --yes

python3 aeo_eval.py --self-test   # mock client, no network: checks stats, parsing, guard and verdict
```

- `--old` and `--new` each take a `.mdx`, `.md` or `.html` file, or a URL. A URL is read through its `.md` twin when one exists.
- `--extra-queries extra.json` takes 2–4 PR-added buyer queries. They must not contain "Unkey", must be 500 characters or fewer, and must be committed before the run.
- `--no-confirm` and `--confirm-queries N` turn down the Claude tier.
- Exit codes:
  - 0: PASS or NO MEASURABLE EFFECT
  - 1: FAIL or INCOMPLETE
  - 2: aborted (budget, no `--yes`, no token)

## What a run does (matches the proposal)
1. **Queries.**
   - Targets are the category's questions from `config/harness.json` (at most 6) plus any extras.
   - The guard set is Q1, Q11, Q17, Q20, Q23, Q26, Q29, Q30, minus any target question.
2. **Distractors.**
   - For each question, take the top 3 non-Unkey URLs the live engines cited in the latest `YYYY-MM-DD.json`. Rank by citation count, then first-seen order. Allow one URL per domain and skip PDFs. A mirrored copy of the same document (a GitHub checkout of published docs, `docs.cloud.google.cn`, or the IETF datatracker HTML of an RFC) is counted as the publisher's canonical URL instead.
   - Each page is fetched once (free, plain HTTP; `.md` twin first) and frozen.
   - Commit the frozen file before a paid run. Its sha256 goes into the justification block.
3. **Conditions** (P's slot rotates 1→4 by run index, distractors are identical across D_old and D_new):

   | Condition | Model | Context | n |
   |---|---|---|---|
   | A | gpt-4.1-mini | no page | 5 per target query |
   | D_old | gpt-4.1-mini | old P + 3 distractors | 20 per target query |
   | D_new | gpt-4.1-mini | new P + same 3 distractors | 20 per target query |
   | Guard | gpt-4.1-mini | D_old vs D_new | 5 per cell |
   | Confirm | claude-sonnet-4-5 | D_old vs D_new, first 6 targets | 5 per cell |

   Web search is off for every call.
4. **Chunking under DataForSEO's limits.**
   - Limits: system and user prompt 500 characters each; at most 10 chain messages; each message 480 ASCII characters or fewer; alternating user/ai.
   - Each document is one user message, `[Search result <url> part 1/1]` + the best local BM25 window (380 characters or fewer) for the query, followed by an "ai" acknowledgement.
   - 4 documents make 8 messages. Every body is validated before anything is sent.
5. **Parsing.** Same rules as `analyze.py`:
   - "named" = the regex `unkey` matches;
   - rank = first-mention order over `BRANDS`/`ALIAS`;
   - recommendation score = 1/rank;
   - share of voice = 1/number of products named.
6. **Statistics.**
   - One-sided Fisher exact test on pooled D_new vs D_old.
   - CMH test stratified by query (reported, not gated).
   - Paired bootstrap over queries (10,000 resamples, fixed seed) for recommendation score, top-1 and share of voice.
7. **Verdict** (§2.6):
   - **PASS:**
     - named rate up at least 10pp with p < 0.05 (or, if D_old is at 90% or more, a top-1 or share-of-voice CI lower bound above 0 with named rate down no more than 5pp);
     - the guard's pooled drop is 5pp or less, and no guard query goes from 4/5 or better to 1/5 or worse;
     - the page_check score is no lower and no binary check is lost.
   - **FAIL:** the guard or page_check check is violated, or a model's delta is significantly negative. "Computed per model" means a significantly negative Claude delta also fails.
   - **NO MEASURABLE EFFECT:** otherwise.
   - **INCOMPLETE:** fewer than 90% of answers parsed.
8. **page_check.**
   - Full mode is used when both sides are HTML (a URL or a `.html` file).
   - Source mode is used for `.mdx`. Site/template checks (robots, llms.txt, sitemap, canonical, JSON-LD, ...) come from one live check of `--page-url` and are identical on both sides. The 13 content checks come from each side's MDX rendered by a minimal renderer.
   - Only content can move the score in source mode.
   - The fetch-time check is excluded from the gate.
9. **Budget guard.**
   - Projected cost = calls × the estimate in config: gpt-4.1-mini $0.0018 (pilot max), Claude $0.0245 (catalog median).
   - The run aborts if the projection is over $2.20, or if the `ledger.jsonl` month-to-date total plus the projection is over $10.
   - During the run, a running total of `X-Treg-Cost-Micro` stops new calls before the limit.
   - Spend is written to the ledger even when a run aborts.
   - The first 3 answers are parsed before the rest are paid for.

## Treg HTTP API (as used; confirmed with 2 real calls on 2026-11-14)
- Request: `POST https://treg.to/call/<endpoint-id>`.
- Body: a one-element JSON array (DataForSEO live task).
- Headers:
  - `X-Treg-Token: $TREG_API_TOKEN`. A team token needs no `X-Treg-Org`.
  - `Content-Type: application/json`.
  - `Cache-Control: no-cache`. This matters: without it a repeated prompt can be served from Treg's archive, which would erase run-to-run variance.
  - `Idempotency-Key` (a retry after a lost answer is not charged twice).
  - `X-Treg-Route-Max-Cost` (per-call ceiling: $0.05 gpt, $0.10 Claude).
  - `X-Treg-Meta: feature=aeo-pr-eval, pr=<n>, run=<id>`.
- Response: the raw DataForSEO body (`tasks[0].status_code == 20000`; text in `tasks[0].result[0].items[].sections[].text`).
- Charge: response header `X-Treg-Cost-Micro`. Call id: `X-Treg-Call-Id`.
- Sources:
  - https://treg.to/integrate.md (§1 HTTP, Auth)
  - https://treg.to/llms.txt
  - https://treg.to/skill.md (Money, Retrying)
- `TregHTTPClient` in `aeo_eval.py` is the only class that touches the network for paid calls. Swap it to change transport.

## Running it on a pull request

`.github/workflows/aeo-eval.yml` runs only when someone adds the `aeo-eval` label, or via workflow_dispatch with a pull request number. It does not run on push. A rate-limiting run is about **$1.76** of Treg credit. The harness refuses a projection over **$2.20**, and refuses when the month-to-date ledger plus that projection would pass **$10**. Each changed page is its own run, so a pull request that touches several mapped pages spends that amount per page.

`/docs/*` is served from Mintlify out of the private `unkeyed/unkey` repo. This Action covers blog, glossary, and marketing pages in this repo only. Docs pull requests need the same Action in `unkeyed/unkey`.

1. A maintainer creates the `aeo-eval` label (it is not a default label) and adds the repository secret `TREG_API_TOKEN` under Settings → Secrets and variables → Actions. Fork pull requests do not receive the secret. The workflow comments and skips paid calls, and it never prints the token.
2. Commit the page change. If the path is not in `config/harness.json` `path_categories`, or you want different questions, commit `aeo/queries.json` on the pull request branch before adding the label. A fenced `aeo` block in the pull request body is used only when that file is absent. The file wins when both are present.

```json
{
  "category": "rate-limiting",
  "queries": [
    "API rate limiting per customer token bucket best practices",
    "How do I rate limit an API across regions without running Redis"
  ]
}
```

`category` overrides the path map for every changed page. `queries` is 2 to 4 buyer questions, 500 characters or fewer, with no "Unkey" in the text. `pages` can set `category`, `queries`, or an `https` `url` for one path. The homepage maps to `platform` and `/pricing` maps to `compute-ops`. Anything unmapped is skipped in the comment. Only `rate-limiting` has a frozen competitor snapshot today; other categories are skipped until `frozen/<category>-YYYY-MM-DD.json` is committed.

3. Add the `aeo-eval` label after that commit. Removing and re-adding the label runs it again and spends again. workflow_dispatch re-runs a numbered pull request without toggling the label. Set `force` only when the monthly ledger cannot be read and you accept that the $10 cap may be wrong.

The workflow checks out the pull request head, runs `--self-test`, then `--dry-run`, then the paid run with `--yes`. It posts one sticky comment (the HTML marker `<!-- aeo-eval-sticky -->`) containing the harness justification block: query set, models, conditions, before and after scores, n, delta, p and confidence interval, guard result, page-score change, PASS / FAIL / NO MEASURABLE EFFECT, and cost. The raw run directory is a workflow artifact.

**PASS** means the pre-registered rule held. The named rate rose by at least 10 percentage points with a one-sided Fisher p < 0.05, or, when the old page was already named in 90% or more of answers, top-1 or share of voice improved with a bootstrap confidence interval above 0 and the named rate did not fall by more than 5 points. The off-target guard did not regress, and the page score did not drop or lose a binary check. **NO MEASURABLE EFFECT** means the guard and the page score held but the recommendation change was inside the noise. **FAIL** means the guard, the page score, or a significantly negative delta failed.

The month-to-date ledger is the hidden `aeo-ledger-entry` markers on those sticky comments, because `actions/cache` is scoped to one branch and cannot see other pull requests. The cache is still restored and saved, keyed by the America/New_York year-month, as a same-branch copy. Before any paid call the workflow seeds `ledger.jsonl` to the higher of the two totals, which is what the harness caps against. A cache miss at the start of a month is an empty file, not an error. If the comment ledger cannot be read, paid calls are skipped and the job fails unless `force` is set. Do not delete the markers. That spend drops out of the $10 cap.

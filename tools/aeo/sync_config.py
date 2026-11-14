#!/usr/bin/env python3
"""Regenerate config/questions.json and config/brands.json from the daily panel's analyze.py,
so the harness parses answers exactly like the live panel. Run from the harness dir:
    python3 sync_config.py [--check]
--check exits 1 if the committed JSON differs from analyze.py (use in CI where analyze.py exists)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT); argv, sys.argv = sys.argv, [sys.argv[0]]
import analyze  # noqa: E402  (reads sys.argv at import time, so argv is swapped out above)
from categories import category_volume  # noqa: E402
sys.argv = argv
os.chdir(ROOT)
vol, _ = analyze.load_vol(analyze.VOLFILE)
cv = category_volume(vol)
questions = {"source": "analyze.py Q/CAT (30-question set, from 2026-11-05)",
             "questions": {str(k): {"text": v, "category": analyze.CAT[k], "category_volume": cv.get(analyze.CAT[k], 0)} for k, v in analyze.Q.items()}}
brands = {"source": "analyze.py BRANDS/ALIAS", "brands": analyze.BRANDS, "alias": analyze.ALIAS}
out = {"questions.json": questions, "brands.json": brands}
bad = 0
for name, obj in out.items():
    p = os.path.join(HERE, "config", name); s = json.dumps(obj, indent=1, ensure_ascii=False) + "\n"
    if "--check" in sys.argv:
        same = os.path.exists(p) and open(p).read() == s
        print(("ok      " if same else "DIFFERS ") + p); bad += (not same)
    else:
        open(p, "w").write(s); print("wrote", p)
sys.exit(1 if bad else 0)

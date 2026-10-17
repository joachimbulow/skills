# Python browser and output helpers

Resolve `SKILL_DIR` to this skill's installed directory. Keep run-specific scripts and captures in a separate task directory. The environment is reusable; do not put scraped data into the skill folder.

## Setup

```sh
SKILL_DIR="$HOME/.codex/skills/website-deal-finder"
uv sync --project "$SKILL_DIR" --frozen
uv run --project "$SKILL_DIR" --frozen python -m playwright install chromium
```

The committed `uv.lock` pins dependencies. Python 3.11+ and `uv` are required. On Linux, Chromium may also require OS libraries; follow Playwright's reported installation guidance within the environment's permissions. Headless Chromium does not require a desktop. Installation/network/browser execution may need normal environment approval; never treat a sandbox error as a website failure.

## Capture a page

```sh
uv run --project "$SKILL_DIR" --frozen python "$SKILL_DIR/scripts/capture.py" \
  'https://shop.example/category' --output /tmp/deal-search/category-01 \
  --locale en-GB
```

Each output directory must be new. The helper writes rendered text, links, raw JSON-LD, HTTP status, final URL, and capture time into `page.json`, plus `page.html` and `page.png`. A failure returns a nonzero exit status and preserves available evidence. HTTP 200 can still be a challenge/consent page; inspect content. Captures can contain private information if you adapt the context for an authorized authenticated session; avoid sharing those artifacts indiscriminately.

For delayed content, add `--wait-for '.product-card'` using an observed selector. Do not rely on `networkidle`: retailer analytics can keep connections open. `--settle-ms` is a short rendering allowance, not proof that inventory is loaded.

Use `--actions /path/to/actions.json` only after inspecting the page and checking the interactions are within the task scope. Supported operations:

```json
[
  {"op": "fill", "selector": "input[name=q]", "value": "running shoes"},
  {"op": "click", "selector": "button[type=submit]"},
  {"op": "wait", "selector": ".product-card"},
  {"op": "select", "selector": "select[name=size]", "value": "42"},
  {"op": "scroll", "pixels": 800}
]
```

These are illustrative selectors, not a generic retailer adapter. Each capture starts a fresh context. For a search spanning filters, pagination, regional settings, or consent, write a small Python script in the task directory and run it using `uv run --project "$SKILL_DIR" --frozen python /path/to/adapter.py`. Reuse one browser context in that script, inspect locators, cap pagination/scrolling, deduplicate final product URLs, and capture each shortlisted selected variant. Prefer role/label locators when available. Do not use a guessed consent button or a click-everything loop.

## Curate and export

The helpers deliberately do not guess arbitrary websites' prices or rank product quality. Read the evidence, compare offers, and write a JSON file in recommendation order. Use decimal strings for money and `null` for unknown shipping/extra costs. `extra_costs` means mandatory charges not already included in price or shipping; explicit `"0"` means verified none. Include any conditional coupon/member scenarios in caveats without changing the unconditional base price.

```json
{
  "website": "https://shop.example",
  "ranking_basis": "Best value within budget for the required size",
  "destination": "Denmark, postcode supplied by user",
  "coverage": "3 category pages; 7 product pages checked",
  "limitations": "No independent price history; one coupon unverified",
  "recommendation": "Choose Product A if its fit meets your needs; lowest known delivered cost among matching offers checked.",
  "offers": [
    {
      "name": "Product A",
      "variant": "Blue, EU 42, one pair, new",
      "currency": "DKK",
      "price": "599.00",
      "shipping": "39.00",
      "extra_costs": "0.00",
      "availability": "Selected size in stock; delivery 2–4 days",
      "url": "https://shop.example/product-a",
      "checked_at": "2026-10-17T12:00:00+00:00",
      "rationale": "Meets requirements; lowest verified delivered cost in the shortlist",
      "caveats": "Retailer advertises 25% off; historical reference price unverified",
      "evidence": ["/tmp/deal-search/product-a/page.json", "/tmp/deal-search/product-a/page.png"]
    }
  ]
}
```

```sh
uv run --project "$SKILL_DIR" --frozen python "$SKILL_DIR/scripts/export.py" \
  /tmp/deal-search/offers.json --output /tmp/deal-search/report
```

The report directory must be new. Outputs are `results.json`, `results.csv`, and `results.md`. Totals use decimal arithmetic; any unknown component produces an unknown total. Supplied ranking is preserved, including across mixed currencies; the agent must explain comparisons and conversions. JSON retains additional offer fields such as seller, return terms, or reference-price sources. CSV escapes cells that could execute as spreadsheet formulas. An empty `offers` list is valid when nothing qualifies: explain that in the recommendation and limitations.

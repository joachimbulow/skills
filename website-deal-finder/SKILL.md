---
name: website-deal-finder
description: Find and compare shopping deals on a supplied website using Python, Playwright, and headless Chromium. Use for product shortlists, budget shopping, and credible discounts with verified variants, availability, and delivered costs.
---

# Website Deal Finder

Find the best available offers within the user's chosen website and constraints. Produce a recommendation, a ranked comparison, and reusable JSON/CSV with source evidence.

## Establish the comparison

- Use the supplied website, product/category, budget, and required variants. Ask for missing information that prevents a useful search; continue independent browsing while optional preferences are pending.
- Default to best value among products meeting the constraints. If the user requests discount hunting, prioritize credible savings. State the ranking basis. For an exact product, compare the same model, variant, quantity, and condition.
- Obtain delivery country/postcode when needed for shipping or tax. Do not infer destination from timezone, language, or currency. Unknown costs stay unknown.
- Keep research on the supplied retailer/marketplace and relevant regional storefront. Ask before expanding comparison to other retailers. Third-party page assets do not expand research scope.
- Define completion: explore relevant search/category results, verify the strongest candidates on product pages, and provide a supported shortlist with coverage and limitations. Start with up to 5 result pages and 10 promising product pages; adapt to the request. Call it best among checked offers unless coverage supports a broader claim.

## Browse and collect evidence

Read [references/browser-and-output.md](references/browser-and-output.md) for environment setup, helper commands, site adaptation, and the result schema.

- Use the dedicated `uv` environment and Playwright Chromium. Start headless; use headed mode when a visible session is needed and supported. Use a fresh context rather than the user's personal browser profile.
- Inspect search, sorting, filters, pagination, and lazy loading. Choose interactions after inspecting the page. Reuse the capture helper for simple pages; write a small run-local Playwright adapter for multi-step site flows. Do not add one retailer's selectors to the reusable skill.
- Record visible prices, exact variants, stock, seller/condition, delivery estimates, and promotion terms. JSON-LD is a candidate source; reconcile it against the rendered selected variant. Save evidence and timestamps, and retain final URLs after redirects.
- Revisit shortlisted product pages. A listing's “from” price or cheapest unavailable size does not establish a purchasable offer. Label access failures, ambiguous stock, and stale/conflicting prices instead of silently treating them as verified.
- Use sequential requests and modest pacing. Honor explicit site access restrictions. On a rate limit, respect Retry-After and retry at most once; stop that route if still blocked. Do not repeatedly retry or bypass CAPTCHAs/login challenges. Report what remains inaccessible.
- Research may use filters, variant selectors, and shipping estimators. Do not add to cart, log in, subscribe, or alter accounts unless the current task authorizes that action. If shipping/coupons require a cart and that is outside scope, leave them unverified. Never purchase as part of deal research.

## Evaluate offers

- Compare total payable cost for the requested quantity: price + shipping + mandatory fees/tax not already included. Never count included VAT twice or assume unknown charges are zero. Explain thresholds, bundles, subscriptions, memberships, and minimum spends.
- Keep unconditional prices separate from coupon/new-customer/member prices. Treat conditional savings as scenarios until eligibility and applicability are established; do not subtract a merely advertised coupon from the primary price.
- Normalize unit prices only for equivalent units and quantities. Do not rank mixed currencies without an explicit dated conversion; prefer the site's destination currency.
- Distinguish retailer reference prices, historical prices, and independent comparisons. A crossed-out price proves only the retailer's advertised comparison. Without credible historical/comparison evidence, call the discount advertised and do not claim an all-time low or exceptional market bargain.
- Explain value using relevant specifications, suitability, seller reliability, returns, and delivery. Do not invent an objective score or imply hands-on product testing. Exclude products failing required constraints; label near matches separately.

## Deliver

Lead with the strongest recommendation and why it fits. Include a ranked table with exact product/variant, item price, known delivered total or unknown costs, availability, deal rationale/caveats, and direct link. Keep unknown-cost offers visibly provisional.

Save `results.json`, `results.csv`, and `results.md` using the export helper. The agent supplies the evidence-based rank; the helper validates money and computes totals without guessing missing costs. Include checked-at times, search coverage, ranking basis, destination if supplied, unverified conditions, and evidence paths. Report observed access limits and do not promise a universal or exhaustive scrape.

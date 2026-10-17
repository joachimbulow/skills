"""Capture rendered evidence from one page; inspect before choosing selectors."""

import argparse
import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import async_playwright


async def capture(args):
    if urlparse(args.url).scheme not in {"http", "https"}:
        raise ValueError("URL must use http or https")
    # One directory per capture prevents accidental evidence overwrites.
    args.output.mkdir(parents=True, exist_ok=False)
    actions = json.loads(args.actions.read_text()) if args.actions else []
    evidence = {"requested_url": args.url, "actions": actions}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=not args.headed)
        context = await browser.new_context(
            locale=args.locale, viewport={"width": 1440, "height": 1000}
        )
        page = await context.new_page()
        page.set_default_timeout(args.timeout * 1000)
        try:
            response = await page.goto(args.url, wait_until="domcontentloaded")
            evidence["http_status"] = response.status if response else None
            if response and response.status >= 400:
                raise RuntimeError(f"HTTP {response.status}; inspect access before retrying")
            for action in actions:
                operation = action["op"]
                if operation == "scroll":
                    await page.mouse.wheel(0, action.get("pixels", 800))
                elif operation == "wait":
                    await page.locator(action["selector"]).wait_for(state="visible")
                elif operation == "click":
                    await page.locator(action["selector"]).click()
                elif operation == "fill":
                    await page.locator(action["selector"]).fill(action["value"])
                elif operation == "select":
                    await page.locator(action["selector"]).select_option(action["value"])
                else:
                    raise ValueError(f"Unsupported action: {operation}")
            if args.wait_for:
                await page.locator(args.wait_for).wait_for(state="visible")
            await page.wait_for_timeout(args.settle_ms)
        except Exception as exc:
            evidence["error"] = f"{type(exc).__name__}: {exc}"
        try:
            evidence.update({
                "final_url": page.url,
                "title": await page.title(),
                "checked_at": datetime.now(timezone.utc).isoformat(),
                "locale": args.locale,
                "text": await page.locator("body").inner_text(),
                "links": await page.locator("a[href]").evaluate_all(
                    "els => els.map(a => ({text: a.innerText, url: a.href}))"
                ),
                "json_ld": await page.locator('script[type="application/ld+json"]').all_text_contents(),
            })
            await page.screenshot(path=str(args.output / "page.png"), full_page=True)
            (args.output / "page.html").write_text(await page.content(), encoding="utf-8")
        except Exception as exc:
            evidence["capture_error"] = f"{type(exc).__name__}: {exc}"
        finally:
            (args.output / "page.json").write_text(
                json.dumps(evidence, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            await browser.close()
    print(args.output / "page.json")
    return 1 if "error" in evidence or "capture_error" in evidence else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url")
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--actions", type=Path, help="JSON list of inspected page interactions")
    parser.add_argument("--wait-for", help="CSS/text selector that signals product content is ready")
    parser.add_argument("--locale", default="en-GB", help="Browser language, not delivery destination")
    parser.add_argument("--headed", action="store_true")
    parser.add_argument("--timeout", type=float, default=30)
    parser.add_argument("--settle-ms", type=int, default=1000)
    args = parser.parse_args()
    if args.timeout <= 0 or not 0 <= args.settle_ms <= 10000:
        parser.error("timeout must be positive; settle-ms must be between 0 and 10000")
    return asyncio.run(capture(args))


if __name__ == "__main__":
    raise SystemExit(main())

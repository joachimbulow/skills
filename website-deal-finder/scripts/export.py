"""Validate curated offers and export their supplied ranking without guessing costs."""

import argparse
import csv
import json
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from urllib.parse import urlparse


def money(value):
    if value is None:
        return None
    try:
        result = Decimal(str(value))
    except InvalidOperation as exc:
        raise ValueError(f"Invalid amount: {value!r}") from exc
    if not result.is_finite() or result < 0:
        raise ValueError(f"Amount must be finite and nonnegative: {value!r}")
    return result


def normalize(data):
    for key in ("website", "ranking_basis", "coverage", "limitations", "recommendation", "offers"):
        if key not in data:
            raise ValueError(f"Missing report field: {key}")
    offers = []
    for rank, raw in enumerate(data["offers"], 1):
        offer = dict(raw)
        for key in ("name", "variant", "currency", "price", "shipping", "extra_costs", "availability", "url", "checked_at", "rationale", "caveats", "evidence"):
            if key not in offer:
                raise ValueError(f"Offer {rank} missing field: {key}")
        if urlparse(offer["url"]).scheme not in {"http", "https"}:
            raise ValueError(f"Offer {rank} needs an HTTP(S) source URL")
        timestamp = datetime.fromisoformat(offer["checked_at"].replace("Z", "+00:00"))
        if timestamp.tzinfo is None:
            raise ValueError("checked_at must include a timezone")
        if len(offer["currency"]) != 3 or not offer["currency"].isascii() or not offer["currency"].isalpha():
            raise ValueError("Use a three-letter currency code")
        costs = [money(offer[key]) for key in ("price", "shipping", "extra_costs")]
        if costs[0] is None:
            raise ValueError("Item price is required; omit unpriced offers from the ranked list")
        for key, cost in zip(("price", "shipping", "extra_costs"), costs):
            offer[key] = str(cost) if cost is not None else None
        offer["total"] = str(sum(costs)) if all(c is not None for c in costs) else None
        offer["currency"] = offer["currency"].upper()
        offer["rank"] = rank
        offers.append(offer)
    return {**data, "generated_at": datetime.now(timezone.utc).isoformat(), "offers": offers}


def cell(value):
    if value is None:
        return "Unknown"
    if isinstance(value, (list, dict)):
        value = json.dumps(value, ensure_ascii=False)
    return str(value).replace("\\", "\\\\").replace("|", "\\|").replace("\n", " ").replace("\r", " ")


def csv_cell(value):
    if value is None:
        return ""
    text = json.dumps(value, ensure_ascii=False) if isinstance(value, (list, dict)) else str(value)
    # Product names and other website content are untrusted spreadsheet cells.
    return "'" + text if text.lstrip().startswith(("=", "+", "-", "@")) or text.startswith(("\t", "\r", "\n")) else text


def export(data, output):
    data = normalize(data)
    output.mkdir(parents=True, exist_ok=False)
    (output / "results.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    fields = ["rank", "name", "variant", "currency", "price", "shipping", "extra_costs", "total", "availability", "rationale", "caveats", "url", "checked_at", "evidence"]
    with (output / "results.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows({key: csv_cell(offer.get(key)) for key in fields} for offer in data["offers"])
    lines = [str(data["recommendation"]), "", f"Website: {data['website']}", "", f"Ranking: {data['ranking_basis']}", "", f"Coverage: {data['coverage']}", "", f"Limitations: {data['limitations']}", "", f"Destination: {data.get('destination') or 'Not supplied'}", "", f"Generated: {data['generated_at']}", "", "| Rank | Product / variant | Item price | Delivered total | Availability | Why / caveats | Link | Checked | Evidence |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for offer in data["offers"]:
        total = f"{offer['total']} {offer['currency']}" if offer["total"] is not None else "Unknown (shipping/extra costs unverified)"
        values = [offer["rank"], f"{offer['name']} / {offer['variant']}", f"{offer['price']} {offer['currency']}", total, offer["availability"], f"{offer['rationale']} / {offer['caveats']}", offer["url"], offer["checked_at"], offer["evidence"]]
        lines.append("| " + " | ".join(cell(value) for value in values) + " |")
    (output / "results.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    export(json.loads(args.input.read_text()), args.output)
    print(args.output)

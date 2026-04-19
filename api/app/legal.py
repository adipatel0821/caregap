import json
import logging
import os
import re

import anthropic
from dotenv import load_dotenv
from pydantic import BaseModel

from .models import BillExtract
from .cms import Anomaly

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv()

log = logging.getLogger(__name__)

LEGAL_KB_PATH = os.path.join(os.path.dirname(__file__), "../../data/legal_kb.md")


class LegalMatch(BaseModel):
    title: str
    citation: str
    why_it_applies: str
    confidence: str  # high, medium, low


class LegalResult(BaseModel):
    matches: dict[str, list[LegalMatch]]  # keyed by "line_index:code"


def _load_legal_kb() -> str:
    with open(LEGAL_KB_PATH, "r", encoding="utf-8") as f:
        return f.read()


_kb_text: str | None = None


def _get_kb() -> str:
    global _kb_text
    if _kb_text is None:
        _kb_text = _load_legal_kb()
        log.info(f"loaded legal kb: {len(_kb_text)} chars")
    return _kb_text


def _get_client():
    return anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))


MATCH_PROMPT = """You are a healthcare billing legal analyst. Given a billing anomaly from a patient's medical bill, determine which legal protections from the knowledge base apply.

Here is the full legal knowledge base:
<legal_kb>
{kb}
</legal_kb>

Here is the billing anomaly to analyze:
<anomaly>
CPT/HCPCS Code: {code}
Description: {description}
Flag type: {flag}
Charged amount: ${charged:.2f}
Medicare rate: ${medicare:.2f}
Multiplier: {multiplier}x
Place of service: {place}
</anomaly>

Additional context about the bill:
<context>
Provider: {provider}
Date of service: {date}
Insurance: {insurance}
Is emergency: {is_emergency}
</context>

Return ONLY valid JSON (no markdown fences) as an array of matches:
[
  {{
    "title": "Name of the legal protection (must match a section heading in the KB)",
    "citation": "Specific statute or regulation citation from the KB text",
    "why_it_applies": "1-2 sentence explanation of why this protection applies to this specific anomaly",
    "confidence": "high or medium or low"
  }}
]

Rules:
- Only return protections that genuinely apply to this anomaly. Don't stretch.
- The citation string MUST be a direct, exact copy-paste from the legal knowledge base above. Copy at least 10 words verbatim.
- For overcharges, look at sections about fair pricing, dispute rights, and billing errors.
- For emergency bills, check No Surprises Act and balance billing protections.
- For duplicates, check the billing errors section.
- Return an empty array [] if nothing clearly applies.
- Maximum 4 matches per anomaly."""


def match_protections(anomaly: Anomaly, context: BillExtract) -> list[LegalMatch]:
    kb = _get_kb()

    is_emergency = False
    if context.provider_name:
        is_emergency = any(
            kw in context.provider_name.lower()
            for kw in ["emergency", "er ", "e.r.", "urgent"]
        )
    for li in context.line_items:
        if li.code and li.code.startswith("9928"):
            is_emergency = True

    prompt = MATCH_PROMPT.format(
        kb=kb,
        code=anomaly.code or "N/A",
        description=anomaly.description,
        flag=anomaly.flag,
        charged=anomaly.charged_amount,
        medicare=anomaly.medicare_rate or 0,
        multiplier=anomaly.multiplier or "N/A",
        place=next(
            (li.place_of_service for li in context.line_items
             if li.code == anomaly.code and li.place_of_service),
            "unknown",
        ),
        provider=context.provider_name or "Unknown",
        date=context.date_of_service or "Unknown",
        insurance=context.insurance or "Unknown",
        is_emergency=is_emergency,
    )

    client = _get_client()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        temperature=0.1,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()
    parsed = _try_parse_json(raw)
    if parsed is None:
        log.error(f"claude returned invalid json for legal match: {raw[:300]}")
        return []

    # honesty gate: every citation must appear verbatim in the KB
    kb_normalized = re.sub(r'\s+', ' ', kb).lower()
    validated = []
    for item in parsed:
        citation = item.get("citation", "")
        if not citation:
            log.warning(f"dropped match with empty citation: {item.get('title', '?')}")
            continue

        citation_normalized = re.sub(r'\s+', ' ', citation).strip().lower()

        # exact match
        if citation_normalized in kb_normalized:
            validated.append(LegalMatch(**item))
            continue

        # partial match: check if any 10-word window from the citation appears in the KB
        words = citation_normalized.split()
        found = False
        if len(words) >= 10:
            for i in range(len(words) - 9):
                window = ' '.join(words[i:i+10])
                if window in kb_normalized:
                    found = True
                    break
        elif len(words) >= 5:
            window = ' '.join(words[:min(len(words), 8)])
            found = window in kb_normalized

        if found:
            validated.append(LegalMatch(**item))
        else:
            log.warning(f"dropped hallucinated citation: {citation[:80]}")

    return validated


def match_all_protections(
    anomalies: list[Anomaly], context: BillExtract
) -> dict[str, list[LegalMatch]]:
    results = {}
    for anomaly in anomalies:
        key = f"{anomaly.line_index}:{anomaly.code or 'none'}"
        try:
            matches = match_protections(anomaly, context)
            results[key] = matches
        except Exception as e:
            log.error(f"legal matching failed for {key}: {e}")
            results[key] = []
    return results


def _try_parse_json(text: str) -> list | None:
    cleaned = text
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = [l for l in lines if not l.startswith("```")]
        cleaned = "\n".join(lines)
    try:
        result = json.loads(cleaned)
        if isinstance(result, list):
            return result
        return None
    except json.JSONDecodeError:
        return None

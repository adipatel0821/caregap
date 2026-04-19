import json
import logging
import os

import anthropic
from dotenv import load_dotenv
from pydantic import BaseModel

from .models import BillExtract
from .cms import Anomaly
from .legal import LegalMatch

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv()

log = logging.getLogger(__name__)


class LetterResult(BaseModel):
    subject: str
    body: str
    recipient_block: str


class RoadmapStep(BaseModel):
    title: str
    detail: str
    deadline: str
    escalation: str  # low, medium, high


class GenerateResult(BaseModel):
    letter: LetterResult
    roadmap: list[RoadmapStep]
    summary: str


def _get_client():
    return anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))


LETTER_PROMPT = """You are a patient advocate drafting a formal medical bill dispute letter.

Bill details:
<bill>
Provider: {provider}
Provider Address: {provider_address}
Patient: {patient}
Date of Service: {date}
Account Number: {account}
Insurance: {insurance}
Total Charged: ${total_charged:.2f}
</bill>

Flagged overcharges:
<anomalies>
{anomaly_text}
</anomalies>

Applicable legal protections:
<legal>
{legal_text}
</legal>

Write a dispute letter in JSON format:
{{
  "subject": "short subject line for the letter",
  "body": "full letter body text",
  "recipient_block": "To:\\nProvider Name\\nAddress"
}}

Letter requirements:
- Firm but professional tone. Not threatening, not pleading.
- Open with identifying information: patient name, date of service, account number.
- For each disputed charge, state the CPT code, billed amount, Medicare-allowed amount, and the multiplier.
- Cite each applicable statute by section number (e.g., "under the No Surprises Act, effective January 1, 2022").
- Request itemized records under HIPAA §164.524.
- Set a 30-day response deadline.
- Close with next steps if unresolved (state AG, CFPB, or insurance commissioner complaint).
- If patient name is missing, use [Patient Name]. If address is missing, use [Your Address]. Never invent details.
- Do not include any markdown formatting in the letter body. Plain text only.
- Return ONLY the JSON object, no markdown fences."""


ROADMAP_PROMPT = """Based on a medical bill dispute, create an action roadmap for the patient.

Disputed bill summary:
- Provider: {provider}
- Total charged: ${total_charged:.2f}
- Estimated savings: ${savings:.2f}
- Number of flagged charges: {flagged_count}
- Is emergency bill: {is_emergency}
- Applicable laws: {laws}

Return ONLY valid JSON (no markdown fences) as an array of steps:
[
  {{
    "title": "short action title",
    "detail": "1-2 sentence explanation of what to do",
    "deadline": "relative deadline like 'within 7 days' or 'within 30 days'",
    "escalation": "low or medium or high"
  }}
]

Create 4-6 steps in order. Typical flow:
1. Request itemized bill with CPT codes
2. Review and compare against Medicare rates (already done by CareGap)
3. Send dispute letter to billing department
4. File insurance grievance if insured
5. File complaint with state AG or insurance commissioner if unresolved
6. Consult healthcare billing advocate or attorney if large amount

Tailor to the specifics — emergency bills get No Surprises Act steps, large amounts get attorney referral sooner."""


SUMMARY_PROMPT = """Write a 2-3 sentence plain-English summary of this medical bill analysis for a patient who isn't familiar with medical billing.

Bill: {provider}, {date}, total ${total_charged:.2f}
Flagged: {flagged_count} charges totaling ${savings:.2f} in potential overcharges
Top issue: {top_issue}

Be specific about the dollar amounts. Sound like a helpful friend, not a lawyer. Start with the most important finding."""


def generate_letter(
    extract: BillExtract,
    anomalies: list[Anomaly],
    legal_matches: dict[str, list[LegalMatch]],
) -> LetterResult:
    anomaly_lines = []
    for a in anomalies:
        line = f"- CPT {a.code}: {a.description} — Billed ${a.charged_amount:.2f}"
        if a.medicare_rate:
            line += f", Medicare rate ${a.medicare_rate:.2f} ({a.multiplier}x)"
        line += f" [Flag: {a.flag}]"
        anomaly_lines.append(line)

    legal_lines = []
    for key, matches in legal_matches.items():
        for m in matches:
            legal_lines.append(f"- {m.title}: {m.citation} (confidence: {m.confidence})")

    prompt = LETTER_PROMPT.format(
        provider=extract.provider_name or "[Provider Name]",
        provider_address=extract.provider_address or "[Provider Address]",
        patient=extract.patient_name or "[Patient Name]",
        date=extract.date_of_service or "[Date of Service]",
        account=extract.account_number or "[Account Number]",
        insurance=extract.insurance or "[Insurance]",
        total_charged=extract.total_charged or 0,
        anomaly_text="\n".join(anomaly_lines) or "None identified",
        legal_text="\n".join(legal_lines) or "None identified",
    )

    client = _get_client()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()
    parsed = _try_parse(raw)
    if parsed is None:
        log.error(f"claude failed to generate valid letter json: {raw[:300]}")
        raise ValueError("Failed to generate dispute letter")

    return LetterResult(**parsed)


def generate_roadmap(
    extract: BillExtract,
    anomalies: list[Anomaly],
    legal_matches: dict[str, list[LegalMatch]],
) -> list[RoadmapStep]:
    is_emergency = False
    if extract.provider_name and any(
        kw in extract.provider_name.lower()
        for kw in ["emergency", "er ", "urgent"]
    ):
        is_emergency = True

    laws = list({
        m.title for matches in legal_matches.values() for m in matches
    })
    savings = sum(a.estimated_savings for a in anomalies)

    prompt = ROADMAP_PROMPT.format(
        provider=extract.provider_name or "Unknown",
        total_charged=extract.total_charged or 0,
        savings=savings,
        flagged_count=len(anomalies),
        is_emergency=is_emergency,
        laws=", ".join(laws) or "general dispute rights",
    )

    client = _get_client()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()
    parsed = _try_parse(raw)
    if not isinstance(parsed, list):
        log.error(f"claude failed to generate roadmap: {raw[:300]}")
        return []

    return [RoadmapStep(**step) for step in parsed]


def generate_summary(
    extract: BillExtract,
    anomalies: list[Anomaly],
) -> str:
    savings = sum(a.estimated_savings for a in anomalies)
    top = anomalies[0] if anomalies else None
    top_issue = "no specific issues found"
    if top:
        top_issue = (
            f"CPT {top.code} ({top.description}) billed at "
            f"${top.charged_amount:.2f} vs Medicare rate ${top.medicare_rate:.2f}"
        )

    prompt = SUMMARY_PROMPT.format(
        provider=extract.provider_name or "your provider",
        date=extract.date_of_service or "your visit",
        total_charged=extract.total_charged or 0,
        flagged_count=len(anomalies),
        savings=savings,
        top_issue=top_issue,
    )

    client = _get_client()
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        temperature=0.4,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text.strip()


def generate_all(
    extract: BillExtract,
    anomalies: list[Anomaly],
    legal_matches: dict[str, list[LegalMatch]],
) -> GenerateResult:
    letter = generate_letter(extract, anomalies, legal_matches)
    roadmap = generate_roadmap(extract, anomalies, legal_matches)
    summary = generate_summary(extract, anomalies)
    return GenerateResult(letter=letter, roadmap=roadmap, summary=summary)


def _try_parse(text: str):
    cleaned = text
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = [l for l in lines if not l.startswith("```")]
        cleaned = "\n".join(lines)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None

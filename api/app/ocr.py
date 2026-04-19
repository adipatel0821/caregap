import json
import logging
import time
import os

from google import genai
from dotenv import load_dotenv

from .models import BillExtract

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv()

log = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    key = os.environ.get("GOOGLE_API_KEY", "")
    _client = genai.Client(api_key=key)
    return _client

EXTRACTION_PROMPT = """You are a medical bill parser. Extract structured data from this bill image.

Return ONLY valid JSON (no markdown fences, no commentary) with this exact schema:
{
  "provider_name": "string or null",
  "provider_address": "string or null",
  "provider_npi": "string or null",
  "patient_name": "string or null",
  "date_of_service": "MM/DD/YYYY or null",
  "account_number": "string or null",
  "insurance": "string or null",
  "line_items": [
    {
      "code": "5-digit CPT code like 99213, or HCPCS code like J1170, or null if not visible",
      "code_type": "CPT or HCPCS or null",
      "description": "service description from the bill",
      "units": 1,
      "charged_amount": 123.45,
      "place_of_service": "facility or non_facility or null"
    }
  ],
  "total_charged": 123.45
}

Rules:
- CPT codes are exactly 5 digits (e.g. 99213). HCPCS codes start with a letter followed by 4 digits (e.g. J1170).
- Parse all dollar amounts to floats in dollars and cents (e.g. 1234.56, not "$1,234.56").
- If a line item has a quantity/units column, use it. Otherwise default to 1.
- charged_amount should be the TOTAL for that line (unit price * quantity).
- If you see "Amount Due" or "Patient Responsibility", that is NOT total_charged. total_charged is the subtotal before insurance adjustments.
- Guess place_of_service from context: ER/hospital = "facility", doctor's office/clinic = "non_facility".
- Extract every line item, even ones with $0.00 charges."""


RETRY_PROMPT = """Your last reply was not valid JSON. Here is what you returned:

{raw}

Return ONLY the corrected JSON object, no markdown fences, no explanation."""


def extract_bill(image_bytes: bytes, mime_type: str = "image/jpeg") -> BillExtract:
    start = time.time()
    response = _get_client().models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            EXTRACTION_PROMPT,
            {"inline_data": {"mime_type": mime_type, "data": image_bytes}},
        ],
        config={"temperature": 0.1, "max_output_tokens": 4096},
    )
    raw = response.text.strip()
    elapsed = time.time() - start
    log.info(f"gemini ocr took {elapsed:.1f}s, response length {len(raw)} chars")

    parsed = _try_parse(raw)
    if parsed is not None:
        parsed["raw_text"] = raw
        return BillExtract(**parsed)

    # one retry with the raw output
    log.warning("first gemini response wasn't valid json, retrying")
    retry_response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=RETRY_PROMPT.format(raw=raw[:3000]),
        config={"temperature": 0.0, "max_output_tokens": 4096},
    )
    raw2 = retry_response.text.strip()
    parsed2 = _try_parse(raw2)
    if parsed2 is not None:
        parsed2["raw_text"] = raw2
        return BillExtract(**parsed2)

    log.error(f"gemini failed to return valid json after retry. raw: {raw2[:500]}")
    raise ValueError("Couldn't parse bill — check image resolution and try again")


def _try_parse(text: str) -> dict | None:
    cleaned = text
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = [l for l in lines if not l.startswith("```")]
        cleaned = "\n".join(lines)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None

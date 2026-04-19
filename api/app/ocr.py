import json
import logging
import time
import os
import base64

import anthropic
from dotenv import load_dotenv

from .models import BillExtract

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv()

log = logging.getLogger(__name__)

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


MIME_MAP = {
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
    "image/webp": "image/webp",
    "application/pdf": "application/pdf",
}


def _get_client():
    return anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))


def extract_bill(image_bytes: bytes, mime_type: str = "image/jpeg") -> BillExtract:
    client = _get_client()
    media_type = MIME_MAP.get(mime_type, "image/jpeg")
    b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

    start = time.time()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": b64,
                        },
                    },
                    {"type": "text", "text": EXTRACTION_PROMPT},
                ],
            }
        ],
    )
    raw = response.content[0].text.strip()
    elapsed = time.time() - start
    log.info(f"claude ocr took {elapsed:.1f}s, response length {len(raw)} chars")

    parsed = _try_parse(raw)
    if parsed is not None:
        parsed["raw_text"] = raw
        return BillExtract(**parsed)

    # one retry
    log.warning("first response wasn't valid json, retrying")
    retry = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": f"Your last reply was not valid JSON. Here it is:\n\n{raw[:3000]}\n\nReturn ONLY the corrected JSON object, no markdown fences.",
            }
        ],
    )
    raw2 = retry.content[0].text.strip()
    parsed2 = _try_parse(raw2)
    if parsed2 is not None:
        parsed2["raw_text"] = raw2
        return BillExtract(**parsed2)

    log.error(f"failed to get valid json after retry: {raw2[:500]}")
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

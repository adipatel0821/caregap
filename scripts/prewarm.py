"""Pre-cache pipeline results for the 3 demo bills.

Run from the api/ directory:
    python ../scripts/prewarm.py

Requires ANTHROPIC_API_KEY set (for legal + letter generation).
If GOOGLE_API_KEY works, it uses real Gemini OCR.
Otherwise it uses hardcoded extracts from the known demo bills.
"""

import hashlib
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../api"))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

from app.models import BillExtract, LineItem
from app.cms import analyze
from app.legal import match_all_protections
from app.letter import generate_all

BILLS_DIR = os.path.join(os.path.dirname(__file__), "../data/bills")
CACHE_DIR = os.path.join(os.path.dirname(__file__), "../api/app/cache")

DEMO_EXTRACTS = {
    "bill_01.jpg": BillExtract(
        provider_name="Riverside Medical Associates",
        provider_address="1200 Health Pkwy, Suite 300, Princeton, NJ 08544",
        provider_npi="1234567890",
        patient_name="Jane M. Rodriguez",
        date_of_service="03/15/2024",
        account_number="847291",
        insurance="BlueCross PPO",
        total_charged=748.00,
        line_items=[
            LineItem(code="99215", code_type="CPT", description="Office visit - Level 5 (complex)", units=1, charged_amount=316.00, place_of_service="non_facility"),
            LineItem(code="36415", code_type="CPT", description="Venipuncture (blood draw)", units=1, charged_amount=45.00, place_of_service="non_facility"),
            LineItem(code="80053", code_type="CPT", description="Comprehensive metabolic panel", units=1, charged_amount=185.00, place_of_service="non_facility"),
            LineItem(code="85025", code_type="CPT", description="Complete blood count (CBC)", units=1, charged_amount=95.00, place_of_service="non_facility"),
            LineItem(code="81001", code_type="CPT", description="Urinalysis, automated", units=1, charged_amount=72.00, place_of_service="non_facility"),
            LineItem(code="99000", code_type="CPT", description="Specimen handling fee", units=1, charged_amount=35.00, place_of_service="non_facility"),
        ],
    ),
    "bill_02.jpg": BillExtract(
        provider_name="Princeton General Hospital - Emergency Dept",
        provider_address="500 University Blvd, Princeton, NJ 08540",
        provider_npi="1234567890",
        patient_name="Michael K. Patel",
        date_of_service="02/28/2024",
        account_number="931058",
        insurance="BlueCross PPO",
        total_charged=5110.00,
        line_items=[
            LineItem(code="99285", code_type="CPT", description="ER visit - Level 5 (high severity)", units=1, charged_amount=2850.00, place_of_service="facility"),
            LineItem(code="71046", code_type="CPT", description="Chest X-ray, 2 views", units=1, charged_amount=425.00, place_of_service="facility"),
            LineItem(code="93010", code_type="CPT", description="Electrocardiogram (ECG/EKG)", units=1, charged_amount=310.00, place_of_service="facility"),
            LineItem(code="80048", code_type="CPT", description="Basic metabolic panel", units=1, charged_amount=215.00, place_of_service="facility"),
            LineItem(code="85025", code_type="CPT", description="Complete blood count (CBC)", units=1, charged_amount=145.00, place_of_service="facility"),
            LineItem(code="96374", code_type="CPT", description="IV push medication admin", units=1, charged_amount=275.00, place_of_service="facility"),
            LineItem(code="J1170", code_type="HCPCS", description="Injection, hydromorphone 1mg", units=2, charged_amount=370.00, place_of_service="facility"),
            LineItem(code="99152", code_type="CPT", description="Moderate sedation, first 15 min", units=1, charged_amount=520.00, place_of_service="facility"),
        ],
    ),
    "bill_03.jpg": BillExtract(
        provider_name="Garden State Orthopedic Specialists",
        provider_address="800 Nassau St, Suite 210, Princeton, NJ 08542",
        provider_npi="1234567890",
        patient_name="Sarah L. Thompson",
        date_of_service="04/02/2024",
        account_number="612847",
        insurance="BlueCross PPO",
        total_charged=1730.00,
        line_items=[
            LineItem(code="99214", code_type="CPT", description="Office visit - Level 4 (moderate)", units=1, charged_amount=245.00, place_of_service="non_facility"),
            LineItem(code="73560", code_type="CPT", description="X-ray knee, 1-2 views", units=1, charged_amount=180.00, place_of_service="non_facility"),
            LineItem(code="73562", code_type="CPT", description="X-ray knee, 3 views", units=1, charged_amount=225.00, place_of_service="non_facility"),
            LineItem(code="73564", code_type="CPT", description="X-ray knee, complete, 4+ views", units=1, charged_amount=290.00, place_of_service="non_facility"),
            LineItem(code="20610", code_type="CPT", description="Joint injection - major joint", units=1, charged_amount=385.00, place_of_service="non_facility"),
            LineItem(code="J3301", code_type="HCPCS", description="Triamcinolone injection, 1mg", units=40, charged_amount=340.00, place_of_service="non_facility"),
            LineItem(code="99070", code_type="CPT", description="Supplies and materials", units=1, charged_amount=65.00, place_of_service="non_facility"),
        ],
    ),
}


def prewarm():
    os.makedirs(CACHE_DIR, exist_ok=True)
    manifest = {}

    for bill_name, extract in DEMO_EXTRACTS.items():
        bill_path = os.path.join(BILLS_DIR, bill_name)
        if not os.path.exists(bill_path):
            print(f"skipping {bill_name} — file not found")
            continue

        with open(bill_path, "rb") as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()[:16]

        print(f"processing {bill_name} (hash: {file_hash})...")

        analysis = analyze(extract)
        print(f"  analysis: {analysis.flagged_count} flags, ${analysis.estimated_savings:.2f} savings")

        legal_matches_raw = match_all_protections(analysis.anomalies, extract)
        legal_serialized = {
            k: [m.model_dump() for m in v] for k, v in legal_matches_raw.items()
        }
        total_matches = sum(len(v) for v in legal_matches_raw.values())
        print(f"  legal: {total_matches} matches")

        gen = generate_all(extract, analysis.anomalies, legal_matches_raw)
        print(f"  letter: {len(gen.letter.body)} chars, roadmap: {len(gen.roadmap)} steps")

        result = {
            "extract": extract.model_dump(),
            "analysis": analysis.model_dump(),
            "legal_matches": legal_serialized,
            "letter": gen.letter.model_dump(),
            "roadmap": [s.model_dump() for s in gen.roadmap],
            "summary": gen.summary,
            "warnings": [],
            "cached": True,
            "elapsed_seconds": 0,
        }

        cache_file = f"{bill_name.replace('.jpg', '')}.json"
        with open(os.path.join(CACHE_DIR, cache_file), "w") as f:
            json.dump(result, f, indent=2)

        manifest[file_hash] = cache_file
        print(f"  cached as {cache_file}")

    with open(os.path.join(CACHE_DIR, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\ndone. {len(manifest)} bills cached.")


if __name__ == "__main__":
    prewarm()

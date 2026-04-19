import hashlib
import json
import logging
import os
import time
from concurrent.futures import ThreadPoolExecutor

from .models import BillExtract
from .ocr import extract_bill
from .cms import analyze
from .legal import match_all_protections, LegalMatch
from .letter import generate_all

log = logging.getLogger(__name__)

CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
MANIFEST_PATH = os.path.join(CACHE_DIR, "manifest.json")


def _load_manifest() -> dict:
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {}


def _file_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:16]


def _check_cache(file_hash: str) -> dict | None:
    manifest = _load_manifest()
    if file_hash not in manifest:
        return None
    cache_file = os.path.join(CACHE_DIR, manifest[file_hash])
    if not os.path.exists(cache_file):
        return None
    with open(cache_file) as f:
        result = json.load(f)
    result["cached"] = True
    log.info(f"serving cached result for hash {file_hash}")
    return result


def run_pipeline(image_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    start = time.time()
    warnings = []

    # check cache first
    fhash = _file_hash(image_bytes)
    cached = _check_cache(fhash)
    if cached:
        return cached

    # stage 1: extract
    try:
        extract = extract_bill(image_bytes, mime_type)
    except Exception as e:
        log.error(f"ocr failed: {e}")
        return {
            "extract": None,
            "analysis": None,
            "legal_matches": None,
            "letter": None,
            "roadmap": None,
            "summary": None,
            "warnings": [f"Bill extraction failed: {e}"],
            "cached": False,
            "elapsed_seconds": round(time.time() - start, 1),
        }

    # stage 2: analyze (doesn't need external API)
    try:
        analysis = analyze(extract)
    except Exception as e:
        log.error(f"analysis failed: {e}")
        warnings.append(f"CMS analysis failed: {e}")
        analysis = None

    # stage 3 + 4: legal matching and letter generation
    # legal matching can run, then letter needs its results
    legal_matches_raw = {}
    if analysis and analysis.anomalies:
        try:
            legal_matches_raw = match_all_protections(analysis.anomalies, extract)
        except Exception as e:
            log.error(f"legal matching failed: {e}")
            warnings.append(f"Legal matching failed: {e}")

    legal_matches_serialized = {
        k: [m.model_dump() for m in v] for k, v in legal_matches_raw.items()
    }

    generate_result = None
    if analysis and analysis.anomalies:
        try:
            generate_result = generate_all(
                extract, analysis.anomalies, legal_matches_raw
            )
        except Exception as e:
            log.error(f"letter generation failed: {e}")
            warnings.append(f"Letter generation failed: {e}")

    elapsed = round(time.time() - start, 1)
    log.info(f"pipeline completed in {elapsed}s with {len(warnings)} warnings")

    return {
        "extract": extract.model_dump(),
        "analysis": analysis.model_dump() if analysis else None,
        "legal_matches": legal_matches_serialized,
        "letter": generate_result.letter.model_dump() if generate_result else None,
        "roadmap": [s.model_dump() for s in generate_result.roadmap] if generate_result else None,
        "summary": generate_result.summary if generate_result else None,
        "warnings": warnings,
        "cached": False,
        "elapsed_seconds": elapsed,
    }

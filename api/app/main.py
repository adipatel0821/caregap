import logging

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models import BillExtract
from .ocr import extract_bill
from .cms import analyze, Anomaly, AnalysisResult
from .legal import match_all_protections, LegalMatch, LegalResult
from .letter import generate_all, GenerateResult
from .pipeline import run_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(message)s")

app = FastAPI(title="CareGap API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://caregap.tech",
        "https://www.caregap.tech",
        "https://care-gap.us",
        "https://www.care-gap.us",
        "https://web-aditya-patels-projects-78586680.vercel.app",
        "https://web-nn6snyc44-aditya-patels-projects-78586680.vercel.app",
        "https://web-9n2hren7e-aditya-patels-projects-78586680.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/health")
def health():
    import os
    has_anthropic = bool(os.environ.get("ANTHROPIC_API_KEY"))
    has_tavily = bool(os.environ.get("TAVILY_API_KEY"))
    data_dir = os.path.join(os.path.dirname(__file__), "../../data")
    has_data = os.path.exists(os.path.join(data_dir, "caregap_pricing_merged.csv"))
    cache_dir = os.path.join(os.path.dirname(__file__), "cache")
    cache_files = len([f for f in os.listdir(cache_dir) if f.endswith(".json")]) if os.path.exists(cache_dir) else 0
    return {
        "ok": True,
        "anthropic_key": has_anthropic,
        "tavily_key": has_tavily,
        "data_dir_exists": has_data,
        "cached_bills": cache_files,
    }


@app.post("/api/extract")
async def extract(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")

    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(400, "File too large — 10 MB max")

    try:
        result = extract_bill(data, mime_type=file.content_type)
    except ValueError as e:
        raise HTTPException(422, str(e))

    return result.model_dump()


@app.post("/api/extract/manual")
async def extract_manual(bill: BillExtract):
    return bill.model_dump()


@app.post("/api/analyze")
async def analyze_bill(bill: BillExtract):
    result = analyze(bill)
    return result.model_dump()


class LegalRequest(BaseModel):
    extract: BillExtract
    anomalies: list[Anomaly]


@app.post("/api/legal")
async def legal_match(req: LegalRequest):
    results = match_all_protections(req.anomalies, req.extract)
    return {"matches": {k: [m.model_dump() for m in v] for k, v in results.items()}}


class GenerateRequest(BaseModel):
    extract: BillExtract
    anomalies: list[Anomaly]
    legal_matches: dict[str, list[LegalMatch]]


@app.post("/api/generate")
async def generate(req: GenerateRequest):
    try:
        result = generate_all(req.extract, req.anomalies, req.legal_matches)
    except ValueError as e:
        raise HTTPException(422, str(e))
    return result.model_dump()


@app.post("/api/run")
async def run_full(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")

    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(400, "File too large — 10 MB max")

    return run_pipeline(data, mime_type=file.content_type)

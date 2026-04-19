import logging

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import BillExtract
from .ocr import extract_bill
from .cms import analyze, AnalysisResult

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(message)s")

app = FastAPI(title="CareGap API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://caregap.tech",
        "https://www.caregap.tech",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/health")
def health():
    return {"ok": True}


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

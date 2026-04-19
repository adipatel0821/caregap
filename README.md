# CareGap

AI-powered medical bill analyzer. Upload a bill, get overcharges flagged against Medicare rates, matched to your legal protections, with a ready-to-send dispute letter.

## Run locally

```bash
# backend (requires Python 3.11+)
cd api && pip install -e . && cp .env.example .env  # fill in your keys
uvicorn app.main:app --reload --port 8000

# frontend (requires Node 18+)
cd web && npm install && npm run dev
```

Or use the helper script: `bash scripts/run_local.sh`

## Architecture

FastAPI backend with four pipeline stages: **Gemini Vision OCR** extracts line items from bill images, **CMS PFS lookup** compares charges against Medicare rates, **Claude** matches overcharges to federal/state legal protections and generates a dispute letter + action roadmap. Frontend is Next.js on Vercel, backend on DigitalOcean App Platform.

## Demo

<!-- URL goes here after deploy -->

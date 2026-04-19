#!/usr/bin/env bash
set -e

trap 'kill 0' EXIT

echo "starting caregap backend on :8000"
cd "$(dirname "$0")/../api"
source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate 2>/dev/null || true
uvicorn app.main:app --reload --port 8000 &

echo "starting caregap frontend on :3000"
cd "$(dirname "$0")/../web"
npm run dev &

wait

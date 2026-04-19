import os
import logging
from collections import Counter

import pandas as pd
from pydantic import BaseModel

from .models import BillExtract, LineItem

log = logging.getLogger(__name__)

# check api/data/ first (Vercel deployment), then repo root data/
_api_data = os.path.join(os.path.dirname(__file__), "../data")
_root_data = os.path.join(os.path.dirname(__file__), "../../data")
DATA_DIR = _api_data if os.path.exists(_api_data) else _root_data


class MedicareRate(BaseModel):
    code: str
    description: str
    non_facility_price: float
    facility_price: float


class Anomaly(BaseModel):
    line_index: int
    code: str | None
    description: str
    charged_amount: float
    medicare_rate: float | None = None
    multiplier: float | None = None
    flag: str  # overcharge, duplicate, missing_code, unknown_code
    estimated_savings: float = 0.0


class AnalysisResult(BaseModel):
    anomalies: list[Anomaly]
    total_charged: float
    total_medicare: float
    estimated_savings: float
    line_count: int
    flagged_count: int


def _load_pricing() -> pd.DataFrame:
    # prefer the merged file, fall back to cms_pfs.csv
    merged = os.path.join(DATA_DIR, "caregap_pricing_merged.csv")
    fallback = os.path.join(DATA_DIR, "cms_pfs.csv")
    path = merged if os.path.exists(merged) else fallback

    df = pd.read_csv(path, dtype={"CPT_CODE": str})
    df.columns = [c.strip().lower() for c in df.columns]

    col_map = {
        "cpt_code": "code",
        "hcpcs": "code",
        "non_facility_price": "non_facility_price",
        "facility_price": "facility_price",
    }
    df = df.rename(columns={k: v for k, v in col_map.items() if k in df.columns})

    df["code"] = df["code"].str.strip()
    df = df.set_index("code")

    log.info(f"loaded {len(df)} codes from {os.path.basename(path)}")
    return df


_pricing_df: pd.DataFrame | None = None


def _get_pricing() -> pd.DataFrame:
    global _pricing_df
    if _pricing_df is None:
        _pricing_df = _load_pricing()
    return _pricing_df


def lookup(code: str, place_of_service: str | None = None) -> MedicareRate | None:
    df = _get_pricing()
    if code not in df.index:
        return None

    row = df.loc[code]
    nf = float(row.get("non_facility_price", 0) or 0)
    fac = float(row.get("facility_price", 0) or 0)

    return MedicareRate(
        code=code,
        description=str(row.get("description", "")),
        non_facility_price=nf,
        facility_price=fac,
    )


def _pick_rate(rate: MedicareRate, place_of_service: str | None) -> float:
    if place_of_service == "facility" and rate.facility_price > 0:
        return rate.facility_price
    if rate.non_facility_price > 0:
        return rate.non_facility_price
    return rate.facility_price


OVERCHARGE_THRESHOLD = 2.0


def analyze(extract: BillExtract) -> AnalysisResult:
    anomalies: list[Anomaly] = []
    total_charged = 0.0
    total_medicare = 0.0

    # detect duplicates: same code on same date
    code_counts = Counter(
        li.code for li in extract.line_items if li.code
    )

    for i, li in enumerate(extract.line_items):
        total_charged += li.charged_amount

        if not li.code:
            anomalies.append(Anomaly(
                line_index=i,
                code=None,
                description=li.description,
                charged_amount=li.charged_amount,
                flag="missing_code",
            ))
            continue

        rate = lookup(li.code, li.place_of_service)

        if rate is None:
            anomalies.append(Anomaly(
                line_index=i,
                code=li.code,
                description=li.description,
                charged_amount=li.charged_amount,
                flag="unknown_code",
            ))
            continue

        medicare_price = _pick_rate(rate, li.place_of_service)
        total_medicare += medicare_price * li.units

        if medicare_price > 0:
            mult = li.charged_amount / (medicare_price * li.units)
        else:
            mult = None

        # duplicate check
        if code_counts.get(li.code, 0) > 1:
            savings = max(li.charged_amount - medicare_price * li.units, 0)
            anomalies.append(Anomaly(
                line_index=i,
                code=li.code,
                description=li.description,
                charged_amount=li.charged_amount,
                medicare_rate=medicare_price,
                multiplier=round(mult, 1) if mult else None,
                flag="duplicate",
                estimated_savings=round(savings, 2),
            ))
            continue

        if mult is not None and mult >= OVERCHARGE_THRESHOLD:
            savings = round(li.charged_amount - medicare_price * li.units, 2)
            anomalies.append(Anomaly(
                line_index=i,
                code=li.code,
                description=li.description,
                charged_amount=li.charged_amount,
                medicare_rate=medicare_price,
                multiplier=round(mult, 1),
                flag="overcharge",
                estimated_savings=max(savings, 0),
            ))

    estimated_savings = sum(a.estimated_savings for a in anomalies)

    return AnalysisResult(
        anomalies=anomalies,
        total_charged=round(total_charged, 2),
        total_medicare=round(total_medicare, 2),
        estimated_savings=round(estimated_savings, 2),
        line_count=len(extract.line_items),
        flagged_count=len(anomalies),
    )

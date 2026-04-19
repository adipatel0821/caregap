from pydantic import BaseModel, Field


class LineItem(BaseModel):
    code: str | None = Field(None, description="CPT or HCPCS code, 5 chars")
    code_type: str | None = Field(None, description="CPT, HCPCS, or ICD-10")
    description: str
    units: int = 1
    charged_amount: float
    place_of_service: str | None = None


class BillExtract(BaseModel):
    provider_name: str | None = None
    provider_address: str | None = None
    provider_npi: str | None = None
    patient_name: str | None = None
    date_of_service: str | None = None
    account_number: str | None = None
    insurance: str | None = None
    line_items: list[LineItem] = []
    total_charged: float | None = None
    raw_text: str | None = Field(None, exclude=True)

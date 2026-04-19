import os
import pytest

BILL_PATH = os.path.join(os.path.dirname(__file__), "../../data/bills/bill_01.jpg")


@pytest.mark.skipif(
    not os.path.exists(BILL_PATH), reason="bill_01.jpg not found"
)
@pytest.mark.skipif(
    not os.environ.get("GOOGLE_API_KEY"), reason="GOOGLE_API_KEY not set"
)
def test_extract_bill_01():
    from app.ocr import extract_bill

    with open(BILL_PATH, "rb") as f:
        image_bytes = f.read()

    result = extract_bill(image_bytes)

    assert result.provider_name is not None, "should extract provider name"
    assert len(result.line_items) > 0, "should extract at least one line item"
    assert result.total_charged is not None and result.total_charged > 0

    # bill_01 has CPT 99215, 36415, 80053 among others
    codes = [li.code for li in result.line_items if li.code]
    assert any(c in codes for c in ["99215", "36415", "80053"]), (
        f"expected at least one known CPT code from bill_01, got {codes}"
    )

    for li in result.line_items:
        if li.charged_amount > 0:
            assert li.description, "line items with charges should have descriptions"

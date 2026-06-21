from fastapi import APIRouter, HTTPException
from models import VariantReport
from data.variants import VARIANT_DB

router = APIRouter()

@router.get("/{variant_id}", response_model=VariantReport)
def get_variant(variant_id: str):
    variant = VARIANT_DB.get(variant_id)
    if not variant:
        raise HTTPException(status_code=404, detail=f"Variant '{variant_id}' not found in database")
    return variant

@router.get("/")
def list_variants():
    return [
        {"variant_id": v["variant_id"], "standard_name": v["standard_name"],
         "common_name": v.get("common_name"), "gene": v["gene"], "severity": v["severity"]}
        for v in VARIANT_DB.values()
    ]

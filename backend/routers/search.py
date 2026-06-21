from fastapi import APIRouter
from typing import List
from models import SearchResult
from data.variants import SEARCH_INDEX

router = APIRouter()

@router.get("/", response_model=List[SearchResult])
def search_variants(q: str = ""):
    if not q or len(q) < 1:
        return SEARCH_INDEX[:10]
    q_lower = q.lower()
    results = []
    for entry in SEARCH_INDEX:
        if (q_lower in entry["standard_name"].lower() or
            (entry["common_name"] and q_lower in entry["common_name"].lower()) or
            q_lower in entry["gene"].lower() or
            q_lower in entry["severity"].lower()):
            results.append(entry)
    return results

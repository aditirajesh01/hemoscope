from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
import requests

router = APIRouter()

ALPHAFOLD_API = "https://alphafold.ebi.ac.uk/api/prediction"

UNIPROT_MAP = {
    "HBB": "P68871",
    "HBA1": "P69905",
    "HBA2": "P69905",
}

@router.get("/{gene}", response_class=PlainTextResponse)
def get_structure(gene: str):
    uniprot_id = UNIPROT_MAP.get(gene.upper())
    if not uniprot_id:
        raise HTTPException(status_code=404, detail=f"No structure available for gene '{gene}'")
    try:
        meta_resp = requests.get(f"{ALPHAFOLD_API}/{uniprot_id}", timeout=10)
        meta_resp.raise_for_status()
        entries = meta_resp.json()
        if not entries:
            raise HTTPException(status_code=404, detail="No AlphaFold2 entry found")
        pdb_url = entries[0].get("pdbUrl")
        if not pdb_url:
            raise HTTPException(status_code=404, detail="No PDB URL in AlphaFold2 entry")
        pdb_resp = requests.get(pdb_url, timeout=15)
        pdb_resp.raise_for_status()
        return pdb_resp.text
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"AlphaFold2 API unavailable: {str(e)}")

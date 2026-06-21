from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class SeverityLevel(str, Enum):
    BENIGN = "benign"
    MILD = "mild"
    SEVERE = "severe"
    UNKNOWN = "unknown"

class PopulationEntry(BaseModel):
    state: str
    frequency: float
    source: str

class ToolComparison(BaseModel):
    sift_score: Optional[float]
    sift_prediction: Optional[str]
    polyphen_score: Optional[float]
    polyphen_prediction: Optional[str]
    hemoscope_confidence: float
    hemoscope_prediction: SeverityLevel

class SequenceFeatures(BaseModel):
    blosum62_score: int
    conservation_score: float
    pssm_score: float
    position_entropy: float

class StructuralFeatures(BaseModel):
    rmsd_angstrom: float
    heme_distance_angstrom: float
    residue_exposure: str
    is_interface_residue: bool
    contact_map_delta: float
    af2_confidence: float

class VariantReport(BaseModel):
    variant_id: str
    standard_name: str
    common_name: Optional[str]
    gene: str
    position: int
    wildtype_aa: str
    mutant_aa: str
    severity: SeverityLevel
    confidence: float
    sequence_features: SequenceFeatures
    structural_features: StructuralFeatures
    tool_comparison: ToolComparison
    population_data: List[PopulationEntry]
    plain_language_summary: str
    clinical_notes: Optional[str]
    uniprot_id: str

class SearchResult(BaseModel):
    variant_id: str
    standard_name: str
    common_name: Optional[str]
    gene: str
    severity: SeverityLevel

# HemoScope 🧬

**Structure-informed hemoglobin variant interpretation for the Indian population**

A web platform that takes a hemoglobin gene variant as input and returns a structured clinical interpretation — severity classification using AlphaFold2 structural features + sequence conservation, Indian population frequency data, 3D molecular visualization, and plain-language summaries.

Built for India's National Sickle Cell Elimination Mission and thalassemia screening programs.

---

## Project Structure

```
hemoscope/
├── backend/          # FastAPI Python backend
├── frontend/         # React + Tailwind frontend
└── notebooks/        # Jupyter notebooks for ML pipeline
```

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/variant/{variant_id}` | Full variant report |
| GET | `/api/variant/` | List all variants |
| GET | `/api/search/?q={query}` | Search variants |
| GET | `/api/structure/{gene}` | AlphaFold2 PDB structure |

---

## Variant IDs (current database)

| ID | Variant | Common Name | Severity |
|----|---------|-------------|----------|
| `HBB-Glu6Val` | HBB:p.Glu6Val | Sickle Cell (HbS) | Severe |
| `HBB-Glu26Lys` | HBB:p.Glu26Lys | Hemoglobin E | Mild |
| `HBB-Lys17Asn` | HBB:p.Lys17Asn | — | Benign |
| `HBA1-Asp74His` | HBA1:p.Asp74His | Hb Q-India | Mild |
| `HBB-Val98Met` | HBB:p.Val98Met | — | Severe |
| `HBB-Glu121Gln` | HBB:p.Glu121Gln | Hemoglobin D-Punjab (HbD) | Benign |
| `HBB-Glu121Lys` | HBB:p.Glu121Lys | Hemoglobin O-Arab (HbO) | Benign |
| `HBA1-Ala120Thr` | HBA1:p.Ala120Thr | Hemoglobin J-Meerut | Benign |
| `HBA1-Asp47His` | HBA1:p.Asp47His | Hemoglobin Hasharon | Mild |
| `HBB-Asn102Thr` | HBB:p.Asn102Thr | Hemoglobin Kansas | Mild |

---

## Roadmap

- [x] ML classifier pipeline (Jupyter → backend)
- [ ] Full HbVar database integration (300+ variants)
- [x] Interactive India choropleth map
- [x] PDF report export
- [ ] Wildtype vs mutant structure comparison
- [ ] Deploy to Vercel (frontend) + Render (backend)

---

## Model Audit

The classifier's training data and predictions were independently audited end-to-end (`notebooks/06_full_label_audit.ipynb`, full writeup in `notebooks/AUDIT_FINDINGS.md`). Key findings, all corrected or disclosed in `backend/data/variants.py`:

- Honest 5-fold cross-validated performance is macro-F1 0.502 / accuracy 0.654 — not the 1.00 figure from the full-data refit in notebook 04, which is in-sample and not a generalization estimate.
- A data leakage bug affected 2 of the 10 deployed variants (HbE, Hb Hasharon), which had been scored in-sample by a model fit on their own labels; both now show honest out-of-fold values.
- 8 of 153 training variants (5.2%) show a severity-flip error (predicted the opposite extreme of their true label), and all 8 are in HBA1, none in HBB — a gene-specific pattern not explained by sample size or AlphaFold2 confidence.
- 100% of the "mild" training class (106/106) is ClinVar's "uncertain significance" bucket rather than a confirmed mild-phenotype call — a structural limitation of the three-class framing, not a bug.

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Recharts, 3Dmol.js, Framer Motion  
**Backend:** FastAPI, Pydantic, Biopython, scikit-learn  
**Data:** HbVar, ClinVar, AlphaFold2 DB, ICMR registries  

---


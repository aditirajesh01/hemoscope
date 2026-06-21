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

---

## Roadmap

- [ ] ML classifier pipeline (Jupyter → backend)
- [ ] Full HbVar database integration (300+ variants)
- [ ] Interactive India choropleth map
- [ ] PDF report export
- [ ] Wildtype vs mutant structure comparison
- [ ] Deploy to Vercel (frontend) + Render (backend)

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Recharts, 3Dmol.js, Framer Motion  
**Backend:** FastAPI, Pydantic, Biopython, scikit-learn  
**Data:** HbVar, ClinVar, AlphaFold2 DB, ICMR registries  

---

## Course Context

Built for BT266TEB — Healthcare Analytics (Semester VI), VTU-affiliated engineering college.  
Addresses the research gap: no tool exists combining AlphaFold2 structural interpretation, Indian population frequency data, and a hemoglobin-specific severity classifier in a single clinical interface.

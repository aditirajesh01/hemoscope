#!/usr/bin/env bash
# Run the HemoScope ML pipeline end-to-end.
# Execute from the notebooks/ directory:
#   cd notebooks && bash run_pipeline.sh
#
# Each notebook is executed in-place (outputs saved back to the .ipynb file).
# Estimated runtime: 5-15 min depending on network speed (API calls are the bottleneck).

set -e
VENV_PYTHON="../backend/venv/bin/python3.14"
JUPYTER="$VENV_PYTHON -m jupyter nbconvert --to notebook --execute --inplace"

echo "=== HemoScope ML Pipeline ==="
echo "Python: $($VENV_PYTHON --version)"
echo ""

echo "[1/5] Fetching ClinVar training data..."
$JUPYTER 01_fetch_training_data.ipynb

echo "[2/5] Computing sequence features (BLOSUM62 + Pfam MSA)..."
$JUPYTER 02_sequence_features.ipynb

echo "[3/5] Computing structural features (AlphaFold EBI API)..."
$JUPYTER 03_structural_features.ipynb

echo "[4/5] Training classifier..."
$JUPYTER 04_train_classifier.ipynb

echo "[5/5] Generating variants_ml.py..."
$JUPYTER 05_generate_variants_py.ipynb

echo ""
echo "=== Done! ==="
echo "Review ../backend/data/variants_ml.py, then:"
echo "  cp ../backend/data/variants_ml.py ../backend/data/variants.py"

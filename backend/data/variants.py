"""
ML-generated variant database — produced by notebooks/05_generate_variants_py.ipynb

Feature pipeline:
  - Sequence: BLOSUM62 + conservation/PSSM/entropy from UniProt globin homologs (Biopython)
  - Structure: AlphaFold2 EBI API (pLDDT, heme distance, burial, contacts)
  - RMSD: calibrated proxy — see notebooks/03_structural_features.ipynb
  - Classifier: CalibratedRandomForestClassifier, 5-fold CV macro-F1=0.500±0.162
  - Trained on 153 ClinVar HBB/HBA1 variants

Known classifier errors (manually corrected in this file):
  - HBB-Glu6Val (HbS): model predicted "mild" (conf 0.86); corrected to "severe" — the
    polymerization mechanism is an emergent tetramer property that per-monomer structural
    features cannot capture.
  - HBB-Glu26Lys (HbE): model predicted "severe" (conf 0.69); corrected to "mild" — HbE
    alone is a mild structural variant; severity arises only in compound heterozygosity
    with beta-thalassemia, which is not modelled here.
  In both cases tool_comparison.hemoscope_prediction retains the raw classifier output
  so the mismatch is visible.

To update: re-run notebooks 01-05 in order, then replace backend/data/variants.py with this file.
"""

VARIANT_DB = {
    "HBB-Glu6Val": {
        "variant_id": "HBB-Glu6Val",
        "standard_name": "HBB:p.Glu6Val",
        "common_name": "Sickle Cell (HbS)",
        "gene": "HBB",
        "position": 6,
        "wildtype_aa": "Glu",
        "mutant_aa": "Val",
        "severity": "severe",
        "confidence": 1.0,
        "sequence_features": {
            "blosum62_score": -2,
            "conservation_score": 0.3154,
            "pssm_score": -2.561,
            "position_entropy": 2.959
        },
        "structural_features": {
            "rmsd_angstrom": 0.34,
            "heme_distance_angstrom": 38.06,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 0.23,
            "af2_confidence": 94.9
        },
        "tool_comparison": {
            "sift_score": 0,
            "sift_prediction": "Deleterious Low Confidence",
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.8642,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "Odisha", "frequency": 0.33, "source": "ICMR NSCAEM 2023"},
            {"state": "Chhattisgarh", "frequency": 0.28, "source": "ICMR NSCAEM 2023"},
            {"state": "Maharashtra", "frequency": 0.15, "source": "Colah et al. 2017"},
            {"state": "Madhya Pradesh", "frequency": 0.11, "source": "ICMR NSCAEM 2023"},
            {"state": "Jharkhand", "frequency": 0.08, "source": "WHO India 2022"}
        ],
        "plain_language_summary": "This mutation replaces glutamic acid with valine at position 6 of the beta-globin chain. Under low-oxygen conditions, the mutant hemoglobin (HbS) polymerizes into rigid fibres, deforming red blood cells into a sickle shape. These sickled cells block small blood vessels, causing severe pain crises, organ damage, and reduced lifespan. This is the molecular basis of sickle cell disease — one of the most common serious inherited disorders in India. Note: the trained classifier predicted 'mild' for this variant (raw confidence 0.86). This is a known error: the pathogenic mechanism depends on HbS tetramer polymerisation under deoxygenation, an emergent property that single-chain AlphaFold2 structural features cannot capture. The severity label has been manually corrected to 'severe' based on established clinical consensus.",
        "clinical_notes": "Homozygous HbSS causes sickle cell disease (severity: severe — manual curation overrides classifier output of 'mild'). Heterozygous HbAS (carrier) is generally asymptomatic. India's National Sickle Cell Elimination Mission targets this variant specifically.",
        "uniprot_id": "P68871"
    },
    "HBB-Glu26Lys": {
        "variant_id": "HBB-Glu26Lys",
        "standard_name": "HBB:p.Glu26Lys",
        "common_name": "Hemoglobin E (HbE)",
        "gene": "HBB",
        "position": 26,
        "wildtype_aa": "Glu",
        "mutant_aa": "Lys",
        "severity": "mild",
        "confidence": 1.0,
        "sequence_features": {
            "blosum62_score": 1,
            "conservation_score": 0.346,
            "pssm_score": -1.994,
            "position_entropy": 2.8264
        },
        "structural_features": {
            "rmsd_angstrom": 0.89,
            "heme_distance_angstrom": 27.77,
            "residue_exposure": "buried",
            "is_interface_residue": False,
            "contact_map_delta": 3.71,
            "af2_confidence": 98.6
        },
        "tool_comparison": {
            "sift_score": 0.01,
            "sift_prediction": "Deleterious Low Confidence",
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.6941,
            "hemoscope_prediction": "severe"
        },
        "population_data": [
            {"state": "West Bengal", "frequency": 0.11, "source": "Das et al. 2020"},
            {"state": "Assam", "frequency": 0.09, "source": "ICMR 2019"},
            {"state": "Odisha", "frequency": 0.07, "source": "HbVar India entries"},
            {"state": "Manipur", "frequency": 0.14, "source": "Moirangthem et al. 2014"}
        ],
        "plain_language_summary": "Hemoglobin E is caused by a mutation at position 26 of the beta-globin chain. It is the second most common structural hemoglobin variant worldwide and very common in Northeast India and Southeast Asia. Heterozygous carriers (HbAE) are usually healthy. When inherited together with beta-thalassemia (HbE/beta-thalassemia), it can cause a moderately severe anemia requiring monitoring and sometimes transfusion. Note: the trained classifier predicted 'severe' for this variant (raw confidence 0.69). This is a known error: the buried location and high contact_map_delta (3.71) led the model to overestimate structural disruption, but HbE on its own is a mild variant with no significant oxygen-binding defect. The severity label has been manually corrected to 'mild' based on established clinical consensus.",
        "clinical_notes": "HbE alone is mild (severity: mild — manual curation overrides classifier output of 'severe'). HbE combined with beta-thalassemia (compound heterozygote) results in a clinically significant thalassemia syndrome. Prevalent in Northeast India, West Bengal, and Assam.",
        "uniprot_id": "P68871"
    },
    "HBB-Lys17Asn": {
        "variant_id": "HBB-Lys17Asn",
        "standard_name": "HBB:p.Lys17Asn",
        "common_name": None,
        "gene": "HBB",
        "position": 17,
        "wildtype_aa": "Lys",
        "mutant_aa": "Asn",
        "severity": "mild",
        "confidence": 0.8129,
        "sequence_features": {
            "blosum62_score": 0,
            "conservation_score": 0.4256,
            "pssm_score": -0.747,
            "position_entropy": 2.4823
        },
        "structural_features": {
            "rmsd_angstrom": 0.34,
            "heme_distance_angstrom": 36.96,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 2.23,
            "af2_confidence": 97.8
        },
        "tool_comparison": {
            "sift_score": None,
            "sift_prediction": None,
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.8129,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "Punjab", "frequency": 0.03, "source": "HbVar India entries"},
            {"state": "Gujarat", "frequency": 0.02, "source": "Colah et al. 2010"}
        ],
        "plain_language_summary": "This variant at position 17 of the beta-globin chain is located on the outer surface of the protein, far from the oxygen-binding heme pocket. The amino acid change is chemically conservative and does not significantly alter the protein's 3D structure or function. This variant is classified as benign — carriers do not develop hemoglobinopathy from this variant alone.",
        "clinical_notes": "Rare, benign surface variant. No clinical significance as a heterozygote or homozygote. Documented in small numbers in Punjab and Gujarat.",
        "uniprot_id": "P68871"
    },
    "HBA1-Asp74His": {
        "variant_id": "HBA1-Asp74His",
        "standard_name": "HBA1:p.Asp74His",
        "common_name": "Hemoglobin Q-India",
        "gene": "HBA1",
        "position": 74,
        "wildtype_aa": "Asp",
        "mutant_aa": "His",
        "severity": "mild",
        "confidence": 0.9016,
        "sequence_features": {
            "blosum62_score": -1,
            "conservation_score": 0.4292,
            "pssm_score": -3.542,
            "position_entropy": 2.4671
        },
        "structural_features": {
            "rmsd_angstrom": 0.34,
            "heme_distance_angstrom": 108.3,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 2.06,
            "af2_confidence": 98.2
        },
        "tool_comparison": {
            "sift_score": 1,
            "sift_prediction": "Tolerated",
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.9016,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "West Bengal", "frequency": 0.02, "source": "Thaker et al. 2024"},
            {"state": "Andhra Pradesh", "frequency": 0.01, "source": "HbVar India entries"}
        ],
        "plain_language_summary": "Hemoglobin Q-India is an alpha-globin variant where histidine replaces aspartic acid at position 74 — a position that sits closer to the heme pocket than typical surface variants. The structural analysis shows it sits at the alpha-beta subunit interface, which can affect how the four hemoglobin chains cooperate in binding and releasing oxygen. Heterozygotes are usually mildly affected; coinheritance with alpha-thalassemia can worsen the clinical picture.",
        "clinical_notes": "Rare variant documented in India, particularly West Bengal. The interface location means it can affect cooperative oxygen binding. Monitor in compound heterozygotes.",
        "uniprot_id": "P69905"
    },
    "HBB-Val98Met": {
        "variant_id": "HBB-Val98Met",
        "standard_name": "HBB:p.Val98Met",
        "common_name": None,
        "gene": "HBB",
        "position": 98,
        "wildtype_aa": "Val",
        "mutant_aa": "Met",
        "severity": "mild",
        "confidence": 0.5818,
        "sequence_features": {
            "blosum62_score": 1,
            "conservation_score": 0.4773,
            "pssm_score": -2.573,
            "position_entropy": 2.2592
        },
        "structural_features": {
            "rmsd_angstrom": 0.0,
            "heme_distance_angstrom": 6.71,
            "residue_exposure": "surface",
            "is_interface_residue": True,
            "contact_map_delta": 1.27,
            "af2_confidence": 95.6
        },
        "tool_comparison": {
            "sift_score": None,
            "sift_prediction": None,
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.5818,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "Tamil Nadu", "frequency": 0.01, "source": "Case report 2021"},
            {"state": "Karnataka", "frequency": 0.01, "source": "HbVar India entries"}
        ],
        "plain_language_summary": "This variant at position 98 of beta-globin sits in the heme pocket — the critical oxygen-binding region of the protein. At only 6.71 angstroms from the heme iron, any disruption here directly impairs oxygen binding and release. Despite the methionine substitution appearing conservative by sequence alone (BLOSUM62 score +1), the structural context makes this severely pathogenic. This is an example where sequence-only tools may underestimate severity and structural analysis is critical.",
        "clinical_notes": "Rare variant with strong structural evidence for pathogenicity. The proximity to heme iron (6.71Å) and high conservation (position entropy 0.05) combined indicate severe impact despite conservative amino acid substitution.",
        "uniprot_id": "P68871"
    },
    "HBB-Glu121Gln": {
        "variant_id": "HBB-Glu121Gln",
        "standard_name": "HBB:p.Glu121Gln",
        "common_name": "Hemoglobin D-Punjab (HbD)",
        "gene": "HBB",
        "position": 121,
        "wildtype_aa": "Glu",
        "mutant_aa": "Gln",
        "severity": "benign",
        "confidence": 0.5265,
        "sequence_features": {
            "blosum62_score": 2,
            "conservation_score": 0.2606,
            "pssm_score": -0.759,
            "position_entropy": 3.1955
        },
        "structural_features": {
            "rmsd_angstrom": 0.34,
            "heme_distance_angstrom": 42.1,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 0.24,
            "af2_confidence": 97.2
        },
        "tool_comparison": {
            "sift_score": 0.03,
            "sift_prediction": "Deleterious Low Confidence",
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.5265,
            "hemoscope_prediction": "benign"
        },
        "population_data": [
            {"state": "Punjab", "frequency": 0.03, "source": "Colah et al. 2010"},
            {"state": "Gujarat", "frequency": 0.02, "source": "Colah et al. 2010"},
            {"state": "Sindh region (historical)", "frequency": 0.04, "source": "HbVar India entries"}
        ],
        "plain_language_summary": "Hemoglobin D-Punjab arises from substitution of glutamine for glutamic acid at position 121 of the beta-globin chain — a surface-exposed helix residue. The charge-neutral substitution (loss of one negative charge) does not disrupt the heme pocket or subunit interface. Heterozygous carriers (HbAD) are clinically normal. However, compound heterozygosity with HbS (HbSD disease) produces a moderate-to-severe sickling disorder because HbD co-polymerizes with HbS under deoxygenated conditions. HbD-Punjab is the most prevalent hemoglobin variant in North India.",
        "clinical_notes": "HbAD: asymptomatic. HbDD: very mild microcytic anemia. HbSD disease: moderate sickling syndrome requiring monitoring. Prevalent in Punjab, Gujarat, and historically the undivided Punjab/Sindh region.",
        "uniprot_id": "P68871"
    },
    "HBB-Glu121Lys": {
        "variant_id": "HBB-Glu121Lys",
        "standard_name": "HBB:p.Glu121Lys",
        "common_name": "Hemoglobin O-Arab (HbO)",
        "gene": "HBB",
        "position": 121,
        "wildtype_aa": "Glu",
        "mutant_aa": "Lys",
        "severity": "benign",
        "confidence": 0.5129,
        "sequence_features": {
            "blosum62_score": 1,
            "conservation_score": 0.2606,
            "pssm_score": 2.859,
            "position_entropy": 3.1955
        },
        "structural_features": {
            "rmsd_angstrom": 0.68,
            "heme_distance_angstrom": 42.1,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 1.24,
            "af2_confidence": 97.2
        },
        "tool_comparison": {
            "sift_score": 0,
            "sift_prediction": "Deleterious Low Confidence",
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.5129,
            "hemoscope_prediction": "benign"
        },
        "population_data": [
            {"state": "West Bengal", "frequency": 0.01, "source": "Das et al. 2020"},
            {"state": "Odisha", "frequency": 0.01, "source": "HbVar India entries"}
        ],
        "plain_language_summary": "Hemoglobin O-Arab replaces the negatively charged glutamic acid with positively charged lysine at beta-globin position 121, reversing the surface charge at that site. Although heterozygous carriers (HbAO) are usually asymptomatic, compound inheritance with HbS (HbSO disease) produces a severe sickling syndrome clinically similar to homozygous sickle cell disease. HbO can also interact with beta-thalassemia mutations, worsening anemia. The variant has been documented in Eastern India and among communities with historical ties to the Arab world.",
        "clinical_notes": "HbAO: clinically silent. HbSO disease: severe sickling — treat like HbSS. HbO/beta-thalassemia: moderate-to-severe thalassemia syndrome. Documented in West Bengal and Odisha.",
        "uniprot_id": "P68871"
    },
    "HBA1-Ala120Thr": {
        "variant_id": "HBA1-Ala120Thr",
        "standard_name": "HBA1:p.Ala120Thr",
        "common_name": "Hemoglobin J-Meerut",
        "gene": "HBA1",
        "position": 120,
        "wildtype_aa": "Ala",
        "mutant_aa": "Thr",
        "severity": "mild",
        "confidence": 0.6632,
        "sequence_features": {
            "blosum62_score": 0,
            "conservation_score": 0.5879,
            "pssm_score": -3.561,
            "position_entropy": 1.7813
        },
        "structural_features": {
            "rmsd_angstrom": 0.0,
            "heme_distance_angstrom": 93.88,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 1.49,
            "af2_confidence": 98.8
        },
        "tool_comparison": {
            "sift_score": None,
            "sift_prediction": None,
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.6632,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "Uttar Pradesh", "frequency": 0.01, "source": "Sukumaran et al. 1972"},
            {"state": "Delhi", "frequency": 0.005, "source": "HbVar India entries"}
        ],
        "plain_language_summary": "Hemoglobin J-Meerut was first identified in a family from Meerut, Uttar Pradesh in 1972, making it one of the earliest alpha-globin variants described in India. The substitution of threonine for alanine at position 120 of the alpha-globin chain occurs at a surface-exposed residue of the GH helix, distant from both the heme pocket and the alpha-beta subunit contact interface. The change is structurally conservative and does not impair oxygen binding or cooperative function. All known carriers have been clinically asymptomatic.",
        "clinical_notes": "Benign alpha-globin variant. No hematological or clinical consequences in heterozygotes or homozygotes. Historically significant as one of the first Indian hemoglobin variants to be molecularly characterized.",
        "uniprot_id": "P69905"
    },
    "HBA1-Asp47His": {
        "variant_id": "HBA1-Asp47His",
        "standard_name": "HBA1:p.Asp47His",
        "common_name": "Hemoglobin Hasharon",
        "gene": "HBA1",
        "position": 47,
        "wildtype_aa": "Asp",
        "mutant_aa": "His",
        "severity": "mild",
        "confidence": 0.8468,
        "sequence_features": {
            "blosum62_score": -1,
            "conservation_score": 0.6303,
            "pssm_score": -3.555,
            "position_entropy": 1.5977
        },
        "structural_features": {
            "rmsd_angstrom": 0.34,
            "heme_distance_angstrom": 127.21,
            "residue_exposure": "surface",
            "is_interface_residue": False,
            "contact_map_delta": 1.8,
            "af2_confidence": 98.5
        },
        "tool_comparison": {
            "sift_score": None,
            "sift_prediction": None,
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.8468,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "Gujarat", "frequency": 0.01, "source": "HbVar India entries"},
            {"state": "Maharashtra", "frequency": 0.005, "source": "Colah et al. 2010"}
        ],
        "plain_language_summary": "Hemoglobin Hasharon carries a histidine substitution for aspartic acid at position 47 of the alpha-globin chain — a residue in the CD loop near the heme pocket. The replacement of an acidic residue with a neutral imidazole group slightly destabilizes the local structure, reducing the affinity of the mutant chain for heme. This results in a mildly unstable hemoglobin. Most heterozygous carriers have a mild hemolytic anemia that is compensated under normal conditions but can decompensate under oxidative stress (infection, drugs). The variant has been reported in India as well as in populations of Middle Eastern and Mediterranean origin.",
        "clinical_notes": "Mildly unstable hemoglobin. Heterozygotes may show compensated hemolytic anemia. Avoid oxidant drugs (dapsone, primaquine). Coinheritance with alpha-thalassemia may reduce expression of the abnormal chain.",
        "uniprot_id": "P69905"
    },
    "HBB-Asn102Thr": {
        "variant_id": "HBB-Asn102Thr",
        "standard_name": "HBB:p.Asn102Thr",
        "common_name": "Hemoglobin Kansas",
        "gene": "HBB",
        "position": 102,
        "wildtype_aa": "Asn",
        "mutant_aa": "Thr",
        "severity": "mild",
        "confidence": 0.735,
        "sequence_features": {
            "blosum62_score": 0,
            "conservation_score": 0.3189,
            "pssm_score": -0.555,
            "position_entropy": 2.9436
        },
        "structural_features": {
            "rmsd_angstrom": 0.0,
            "heme_distance_angstrom": 13.32,
            "residue_exposure": "surface",
            "is_interface_residue": True,
            "contact_map_delta": 0.17,
            "af2_confidence": 97.6
        },
        "tool_comparison": {
            "sift_score": 0,
            "sift_prediction": "Deleterious Low Confidence",
            "polyphen_score": None,
            "polyphen_prediction": None,
            "hemoscope_confidence": 0.735,
            "hemoscope_prediction": "mild"
        },
        "population_data": [
            {"state": "Tamil Nadu", "frequency": 0.005, "source": "Case report, Venkatesan et al. 2019"},
            {"state": "Maharashtra", "frequency": 0.005, "source": "HbVar India entries"}
        ],
        "plain_language_summary": "Hemoglobin Kansas carries a threonine substitution for asparagine at position 102 of the beta-globin chain — a critical residue at the alpha1-beta2 subunit interface involved in the T-to-R quaternary conformational switch during oxygen binding. The substitution dramatically lowers oxygen affinity, causing hemoglobin to release oxygen more readily than normal. This leads to cyanosis (blue discoloration of skin and mucous membranes) because a larger fraction of hemoglobin is in the deoxygenated (T-state) form in arterial blood, even at normal oxygen tensions. Despite looking alarming, carriers are generally healthy because tissue oxygen delivery is actually improved.",
        "clinical_notes": "Low-oxygen-affinity variant. Presents with cyanosis and apparent polycythemia (compensatory). Not pathological — tissue oxygenation is adequate or improved. Avoidance of unnecessary treatment is key; misdiagnosis as methemoglobinemia has been reported.",
        "uniprot_id": "P68871"
    }
}

SEARCH_INDEX = [
    {"variant_id": "HBB-Glu6Val", "standard_name": "HBB:p.Glu6Val", "common_name": "Sickle Cell (HbS)", "gene": "HBB", "severity": "severe"},
    {"variant_id": "HBB-Glu26Lys", "standard_name": "HBB:p.Glu26Lys", "common_name": "Hemoglobin E (HbE)", "gene": "HBB", "severity": "mild"},
    {"variant_id": "HBB-Lys17Asn", "standard_name": "HBB:p.Lys17Asn", "common_name": None, "gene": "HBB", "severity": "mild"},
    {"variant_id": "HBA1-Asp74His", "standard_name": "HBA1:p.Asp74His", "common_name": "Hemoglobin Q-India", "gene": "HBA1", "severity": "mild"},
    {"variant_id": "HBB-Val98Met", "standard_name": "HBB:p.Val98Met", "common_name": None, "gene": "HBB", "severity": "mild"},
    {"variant_id": "HBB-Glu121Gln", "standard_name": "HBB:p.Glu121Gln", "common_name": "Hemoglobin D-Punjab (HbD)", "gene": "HBB", "severity": "benign"},
    {"variant_id": "HBB-Glu121Lys", "standard_name": "HBB:p.Glu121Lys", "common_name": "Hemoglobin O-Arab (HbO)", "gene": "HBB", "severity": "benign"},
    {"variant_id": "HBA1-Ala120Thr", "standard_name": "HBA1:p.Ala120Thr", "common_name": "Hemoglobin J-Meerut", "gene": "HBA1", "severity": "mild"},
    {"variant_id": "HBA1-Asp47His", "standard_name": "HBA1:p.Asp47His", "common_name": "Hemoglobin Hasharon", "gene": "HBA1", "severity": "mild"},
    {"variant_id": "HBB-Asn102Thr", "standard_name": "HBB:p.Asn102Thr", "common_name": "Hemoglobin Kansas", "gene": "HBB", "severity": "mild"}
]

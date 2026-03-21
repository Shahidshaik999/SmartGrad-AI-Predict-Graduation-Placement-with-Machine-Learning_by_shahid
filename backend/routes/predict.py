"""
SmartGrad AI - Prediction Routes
POST /predict/placement  → placement probability + label
POST /predict/graduation → graduation status + delay months
POST /predict/full       → both predictions + recommendations
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import joblib
import os

from backend.utils.recommender import generate_recommendations

router = APIRouter(prefix="/predict", tags=["Predictions"])

# ── Load models once at startup ────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

def _load(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}. Run train_models.py first.")
    return joblib.load(path)

placement_model   = _load("placement_model.pkl")
placement_scaler  = _load("placement_scaler.pkl")
placement_features= _load("placement_features.pkl")

graduation_model  = _load("graduation_model.pkl")
graduation_scaler = _load("graduation_scaler.pkl")
graduation_features=_load("graduation_features.pkl")

GRAD_LABELS = {0: "On-time", 1: "Delayed by ~1 Semester", 2: "Delayed by 2+ Semesters"}
DELAY_MONTHS = {0: 0, 1: 6, 2: 12}

# ── Request Schema ─────────────────────────────────────────────────────────────
class StudentInput(BaseModel):
    cgpa:            float = Field(..., ge=0.0, le=10.0,  description="CGPA on 10-point scale")
    backlogs:        int   = Field(..., ge=0,   le=20,    description="Number of active backlogs")
    attendance:      float = Field(..., ge=0.0, le=100.0, description="Attendance percentage")
    projects:        int   = Field(..., ge=0,   le=20,    description="Number of projects completed")
    internships:     int   = Field(..., ge=0,   le=10,    description="Number of internships")
    certifications:  int   = Field(..., ge=0,   le=20,    description="Number of certifications")
    speaking_skills: int   = Field(..., ge=1,   le=5,     description="Communication skills (1-5)")
    ml_knowledge:    int   = Field(..., ge=1,   le=5,     description="ML/Technical knowledge (1-5)")
    aptitude_score:  float = Field(..., ge=0.0, le=100.0, description="Aptitude test score (0-100)")
    technical_skills:Optional[List[str]] = Field(default=[], description="List of technical skills")

# ── Helpers ────────────────────────────────────────────────────────────────────
def _to_array(student: StudentInput, feature_list: List[str]) -> np.ndarray:
    data = student.model_dump()
    return np.array([[data[f] for f in feature_list]])

# ── Endpoints ──────────────────────────────────────────────────────────────────
@router.post("/placement")
def predict_placement(student: StudentInput):
    """Returns placement probability and label."""
    X = _to_array(student, placement_features)
    X_s = placement_scaler.transform(X)
    prob = float(placement_model.predict_proba(X_s)[0][1])
    label = "Placed" if prob >= 0.5 else "Not Placed"
    return {
        "placement_probability": round(prob * 100, 2),
        "placement_label": label,
        "confidence": round(max(prob, 1 - prob) * 100, 2),
    }

@router.post("/graduation")
def predict_graduation(student: StudentInput):
    """Returns graduation status and estimated delay in months."""
    X = _to_array(student, graduation_features)
    X_s = graduation_scaler.transform(X)
    pred = int(graduation_model.predict(X_s)[0])
    proba = graduation_model.predict_proba(X_s)[0].tolist()
    return {
        "graduation_status": GRAD_LABELS[pred],
        "delay_months": DELAY_MONTHS[pred],
        "probabilities": {
            "on_time":       round(proba[0] * 100, 2),
            "delayed_1_sem": round(proba[1] * 100, 2),
            "delayed_2_sem": round(proba[2] * 100, 2),
        },
    }

@router.post("/full")
def predict_full(student: StudentInput):
    """Combined endpoint: placement + graduation + recommendations."""
    placement = predict_placement(student)
    graduation = predict_graduation(student)

    student_dict = student.model_dump()
    recommendations = generate_recommendations(student_dict)

    return {
        "placement":       placement,
        "graduation":      graduation,
        "recommendations": recommendations,
    }

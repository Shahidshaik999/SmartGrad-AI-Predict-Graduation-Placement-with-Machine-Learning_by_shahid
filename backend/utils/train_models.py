"""
SmartGrad AI - Model Training Script
Trains Placement Prediction and Graduation Prediction models
using real data + synthetic augmentation.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# ── Paths ──────────────────────────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
PLACEMENT_TRAIN = os.path.join(
    DATA_DIR, "Prediction of Placement Status Data", "01 Train Data.xlsx"
)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

FEATURES = [
    "cgpa", "backlogs", "attendance", "projects", "internships",
    "certifications", "speaking_skills", "ml_knowledge", "aptitude_score"
]

# ── 1. PLACEMENT MODEL ─────────────────────────────────────────────────────────

def build_placement_dataset():
    """Load real data and augment with synthetic features."""
    df = pd.read_excel(PLACEMENT_TRAIN)
    df = df[df["Placement Status"].notna() & df["CGPA"].notna()].copy()
    df["Placement Status"] = df["Placement Status"].str.strip()

    df["cgpa"]            = pd.to_numeric(df["CGPA"], errors="coerce")
    df["speaking_skills"] = pd.to_numeric(df["Speaking Skills"], errors="coerce")
    df["ml_knowledge"]    = pd.to_numeric(df["ML Knowledge"], errors="coerce")
    df = df.dropna(subset=["cgpa", "speaking_skills", "ml_knowledge"])

    real = df[["cgpa", "speaking_skills", "ml_knowledge"]].copy()
    n = len(real)
    np.random.seed(42)

    # Synthetic features correlated with CGPA for realism
    real["backlogs"]       = np.clip(np.random.poisson(lam=np.clip(8 - real["cgpa"], 0, 5), size=n), 0, 7).astype(int)
    real["attendance"]     = np.clip(real["cgpa"] * 8 + np.random.normal(0, 5, n), 40, 100).round(1)
    real["projects"]       = np.clip(np.random.poisson(lam=real["cgpa"] / 3, size=n), 0, 8).astype(int)
    real["internships"]    = np.clip(np.random.poisson(lam=real["cgpa"] / 5, size=n), 0, 4).astype(int)
    real["certifications"] = np.clip(np.random.poisson(lam=real["cgpa"] / 4, size=n), 0, 6).astype(int)
    real["aptitude_score"] = np.clip(real["cgpa"] * 7 + np.random.normal(0, 8, n), 20, 100).round(1)

    # Derive placement label from composite score
    score = (
        (real["cgpa"] - 6) / 4 * 0.30 +
        real["projects"] / 8 * 0.15 +
        real["internships"] / 4 * 0.15 +
        (real["speaking_skills"] - 1) / 4 * 0.15 +
        (real["aptitude_score"] - 20) / 80 * 0.15 +
        real["certifications"] / 6 * 0.10
    )
    real["placed"] = (score + np.random.normal(0, 0.04, n) > 0.42).astype(int)
    return real[FEATURES + ["placed"]]


def train_placement_model():
    print("Training Placement Prediction Model...")
    df = build_placement_dataset()
    X, y = df[FEATURES], df["placed"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    model = GradientBoostingClassifier(
        n_estimators=200, max_depth=4, learning_rate=0.1, random_state=42
    )
    model.fit(X_train_s, y_train)

    y_pred = model.predict(X_test_s)
    print(f"Placement Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred, target_names=["Not Placed", "Placed"]))

    joblib.dump(model,    os.path.join(MODEL_DIR, "placement_model.pkl"))
    joblib.dump(scaler,   os.path.join(MODEL_DIR, "placement_scaler.pkl"))
    joblib.dump(FEATURES, os.path.join(MODEL_DIR, "placement_features.pkl"))
    print("Saved placement model.\n")


# ── 2. GRADUATION MODEL ────────────────────────────────────────────────────────

def build_graduation_dataset():
    """
    Synthetic graduation dataset.
    Labels: 0=On-time, 1=Delayed 1 semester, 2=Delayed 2+ semesters
    """
    np.random.seed(99)
    n = 6000
    cgpa           = np.clip(np.random.normal(7.5, 1.2, n), 4.0, 10.0).round(1)
    backlogs       = np.clip(np.random.poisson(lam=np.clip(8 - cgpa, 0, 5)), 0, 7).astype(int)
    attendance     = np.clip(cgpa * 8 + np.random.normal(0, 6, n), 30, 100).round(1)
    projects       = np.clip(np.random.poisson(lam=cgpa / 3), 0, 8).astype(int)
    internships    = np.clip(np.random.poisson(lam=cgpa / 5), 0, 4).astype(int)
    certifications = np.clip(np.random.poisson(lam=cgpa / 4), 0, 6).astype(int)
    speaking_skills= np.random.randint(1, 6, n)
    ml_knowledge   = np.random.randint(1, 6, n)
    aptitude_score = np.clip(cgpa * 7 + np.random.normal(0, 8, n), 20, 100).round(1)

    risk = (
        backlogs / 7 * 0.40 +
        (100 - attendance) / 70 * 0.30 +
        (10 - cgpa) / 6 * 0.20 +
        np.random.normal(0, 0.05, n)
    )
    grad_status = np.where(risk < 0.25, 0, np.where(risk < 0.55, 1, 2))

    return pd.DataFrame({
        "cgpa": cgpa, "backlogs": backlogs, "attendance": attendance,
        "projects": projects, "internships": internships,
        "certifications": certifications, "speaking_skills": speaking_skills,
        "ml_knowledge": ml_knowledge, "aptitude_score": aptitude_score,
        "grad_status": grad_status
    })


def train_graduation_model():
    print("Training Graduation Prediction Model...")
    df = build_graduation_dataset()
    X, y = df[FEATURES], df["grad_status"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=200, max_depth=8, random_state=42, n_jobs=-1
    )
    model.fit(X_train_s, y_train)

    y_pred = model.predict(X_test_s)
    print(f"Graduation Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred, target_names=["On-time", "Delayed 1 sem", "Delayed 2+ sem"]))

    joblib.dump(model,    os.path.join(MODEL_DIR, "graduation_model.pkl"))
    joblib.dump(scaler,   os.path.join(MODEL_DIR, "graduation_scaler.pkl"))
    joblib.dump(FEATURES, os.path.join(MODEL_DIR, "graduation_features.pkl"))
    print("Saved graduation model.\n")


if __name__ == "__main__":
    train_placement_model()
    train_graduation_model()
    print("All models trained and saved successfully.")

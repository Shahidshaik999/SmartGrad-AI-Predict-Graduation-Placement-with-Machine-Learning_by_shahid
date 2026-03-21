# SmartGrad AI — Student Academic & Placement Prediction System

A full-stack, production-ready AI system that predicts student placement probability and graduation timeline using machine learning, and delivers personalized career improvement recommendations through a premium animated dashboard.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Data Sources](#4-data-sources)
5. [Machine Learning Pipeline](#5-machine-learning-pipeline)
6. [Backend — FastAPI](#6-backend--fastapi)
7. [Frontend — React](#7-frontend--react)
8. [Recommendation Engine](#8-recommendation-engine)
9. [Authentication](#9-authentication)
10. [API Reference](#10-api-reference)
11. [Local Setup Guide](#11-local-setup-guide)
12. [Deployment Guide](#12-deployment-guide)
13. [Model Performance](#13-model-performance)
14. [Feature Thresholds & Logic](#14-feature-thresholds--logic)
15. [Known Limitations & Future Work](#15-known-limitations--future-work)

---

## 1. Project Overview

SmartGrad AI is an intelligent academic analytics platform built for engineering and degree students. A student fills in their academic profile — CGPA, backlogs, attendance, projects, internships, certifications, communication skills, technical knowledge, and aptitude score — and the system instantly returns:

- **Placement Probability** — the likelihood (%) of getting placed, powered by a Gradient Boosting classifier
- **Graduation Prediction** — whether the student will graduate on time, or be delayed by 1 or 2+ semesters, powered by a Random Forest classifier
- **Risk Score** — a composite risk percentage across all 9 features
- **Personalized Recommendations** — specific courses, platforms, and improvement tips for every weak area

The UI is built to feel like a premium SaaS product — glassmorphism cards, animated SVG progress rings, Framer Motion transitions, radar charts, and a cinematic landing page.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons |
| Backend | FastAPI (Python), Uvicorn |
| Machine Learning | Scikit-learn (GradientBoosting, RandomForest), Joblib, Pandas, NumPy |
| Authentication | JWT (python-jose), Bcrypt (passlib) |
| Database | In-memory (dev) — MongoDB Atlas ready via Motor |
| Deployment | Vercel (frontend), Render (backend) |
| Fonts | Inter (via @fontsource/inter) |

---

## 3. Project Structure

```
ML_prediction/
│
├── backend/                        # FastAPI application
│   ├── main.py                     # App entry point, CORS, router registration
│   ├── requirements.txt            # Python dependencies
│   ├── Procfile                    # Render deployment command
│   │
│   ├── models/                     # Trained ML model files (auto-generated)
│   │   ├── placement_model.pkl     # GradientBoostingClassifier
│   │   ├── placement_scaler.pkl    # StandardScaler for placement features
│   │   ├── placement_features.pkl  # Ordered feature list
│   │   ├── graduation_model.pkl    # RandomForestClassifier
│   │   ├── graduation_scaler.pkl   # StandardScaler for graduation features
│   │   └── graduation_features.pkl # Ordered feature list
│   │
│   ├── routes/
│   │   ├── predict.py              # POST /predict/placement|graduation|full
│   │   └── auth.py                 # POST /auth/register|login  GET /auth/me
│   │
│   └── utils/
│       ├── train_models.py         # One-time model training script
│       └── recommender.py          # Rule-based recommendation engine
│
├── smartgrad-frontend/             # React + Vite application
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                 # SPA routing for Vercel
│   ├── .env.example
│   │
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Router, auth state, page transitions
│       ├── index.css               # Global styles, glassmorphism, animations
│       │
│       ├── lib/
│       │   └── utils.js            # cn() utility (clsx + tailwind-merge)
│       │
│       ├── services/
│       │   └── api.js              # Axios client, all API calls
│       │
│       ├── components/
│       │   ├── Navbar.jsx          # Fixed top navbar with auth state
│       │   ├── StudentForm.jsx     # 3-step animated multi-step form
│       │   ├── ResultCard.jsx      # Full results dashboard with charts
│       │   └── ui/
│       │       ├── Background.jsx  # Animated blob + grid background
│       │       ├── Button.jsx      # Reusable animated button
│       │       ├── Card.jsx        # Glassmorphism card with entrance animation
│       │       ├── Input.jsx       # Floating label input with focus states
│       │       └── SkeletonCard.jsx # Shimmer skeleton loader
│       │
│       └── pages/
│           ├── Landing.jsx         # Hero, stats, features, CTA
│           ├── Dashboard.jsx       # Predict page (form + results)
│           ├── Login.jsx           # JWT login
│           └── Register.jsx        # Account creation
│
├── data/                           # Input data (copied from Downloads)
│   └── Prediction of Placement Status Data/
│       └── 01 Train Data.xlsx      # Real dataset used for placement model
│
├── render.yaml                     # Render deployment config
└── README.md
```

---

## 4. Data Sources

### Real Dataset — Placement Prediction

**File:** `data/Prediction of Placement Status Data/01 Train Data.xlsx`

This is a real-world dataset collected from a student event (4,894 rows). The columns used for training are:

| Column | Used As | Notes |
|---|---|---|
| `CGPA` | `cgpa` | Core academic feature |
| `Speaking Skills` | `speaking_skills` | Rating 1–5 |
| `ML Knowledge` | `ml_knowledge` | Rating 1–5 |
| `Placement Status` | Target label | "Placed" / "Not placed" |

The dataset only has 1,098 rows with a valid `Placement Status`. The remaining columns (backlogs, attendance, projects, internships, certifications, aptitude score) are **not present** in the original data, so they are synthetically generated during training (see Section 5).

### Synthetic Dataset — Graduation Prediction

The `Year of Graduation Data` file only contains student registration info (name, email, college, academic year) — no numeric features suitable for ML. Therefore, the graduation model is trained entirely on a **programmatically generated synthetic dataset** of 6,000 samples with realistic statistical distributions.

### Why Synthetic Augmentation?

Real-world student datasets rarely contain all the features needed for a comprehensive prediction. Synthetic augmentation allows the model to learn relationships between features (e.g., higher CGPA → fewer backlogs → better attendance) while still being anchored to real CGPA and skill distributions from the actual dataset.

---

## 5. Machine Learning Pipeline

### How Training Works

Run once before starting the server:

```bash
python backend/utils/train_models.py
```

This script:
1. Loads the real Excel data
2. Augments it with correlated synthetic features
3. Trains two models
4. Saves 6 `.pkl` files to `backend/models/`

### Model 1 — Placement Prediction

**Algorithm:** `GradientBoostingClassifier`

**Why Gradient Boosting?** It handles mixed feature types well, is robust to outliers, and produces well-calibrated probabilities — important for showing a meaningful percentage to the student.

**Training data construction:**

```
Real data (CGPA, Speaking Skills, ML Knowledge)
    +
Synthetic features (correlated with CGPA via Poisson/Normal distributions):
  - backlogs       ~ Poisson(max(8 - CGPA, 0))
  - attendance     ~ Normal(CGPA × 8, 5), clipped to [40, 100]
  - projects       ~ Poisson(CGPA / 3)
  - internships    ~ Poisson(CGPA / 5)
  - certifications ~ Poisson(CGPA / 4)
  - aptitude_score ~ Normal(CGPA × 7, 8), clipped to [20, 100]
```

**Label derivation (composite score):**

```
score = CGPA_norm × 0.30
      + projects_norm × 0.15
      + internships_norm × 0.15
      + speaking_norm × 0.15
      + aptitude_norm × 0.15
      + certifications_norm × 0.10
      + noise(0, 0.04)

placed = 1 if score > 0.42 else 0
```

**Hyperparameters:**
- `n_estimators = 200`
- `max_depth = 4`
- `learning_rate = 0.1`
- `random_state = 42`

**Preprocessing:** `StandardScaler` (fit on train, applied to test and inference)

**Train/Test split:** 80/20, stratified by label

---

### Model 2 — Graduation Prediction

**Algorithm:** `RandomForestClassifier`

**Why Random Forest?** Multi-class classification (3 labels) with tabular data — Random Forest is stable, interpretable via feature importance, and parallelizable.

**Labels:**
- `0` → On-time graduation
- `1` → Delayed by ~1 semester (6 months)
- `2` → Delayed by 2+ semesters (12+ months)

**Risk score formula used to derive labels:**

```
risk = backlogs/7 × 0.40
     + (100 - attendance)/70 × 0.30
     + (10 - CGPA)/6 × 0.20
     + noise(0, 0.05)

label = 0 if risk < 0.25
      = 1 if 0.25 ≤ risk < 0.55
      = 2 if risk ≥ 0.55
```

**Hyperparameters:**
- `n_estimators = 200`
- `max_depth = 8`
- `n_jobs = -1` (uses all CPU cores)
- `random_state = 42`

---

### Inference Flow (per API call)

```
Student form input (JSON)
        ↓
Pydantic validation (FastAPI)
        ↓
Feature array: [cgpa, backlogs, attendance, projects, internships,
                certifications, speaking_skills, ml_knowledge, aptitude_score]
        ↓
StandardScaler.transform()
        ↓
model.predict_proba()  →  probability scores
        ↓
JSON response to frontend
```

---

## 6. Backend — FastAPI

### Entry Point

`backend/main.py` — creates the FastAPI app, registers CORS middleware, and mounts both routers.

**CORS:** Currently set to `allow_origins=["*"]` for local development. In production, restrict this to your Vercel domain.

### Routes

#### `backend/routes/predict.py`

All prediction endpoints share the same `StudentInput` Pydantic model:

```python
class StudentInput(BaseModel):
    cgpa:            float  # 0.0 – 10.0
    backlogs:        int    # 0 – 20
    attendance:      float  # 0.0 – 100.0
    projects:        int    # 0 – 20
    internships:     int    # 0 – 10
    certifications:  int    # 0 – 20
    speaking_skills: int    # 1 – 5
    ml_knowledge:    int    # 1 – 5
    aptitude_score:  float  # 0.0 – 100.0
    technical_skills: List[str]  # optional, used for display only
```

Models are loaded **once at startup** using `joblib.load()` — not on every request — so inference is fast.

#### `backend/routes/auth.py`

JWT-based authentication using `python-jose` and `passlib[bcrypt]`.

- Tokens expire after 24 hours
- User store is in-memory for development (replace with MongoDB for production)
- `OAuth2PasswordBearer` scheme for protected routes

---

## 7. Frontend — React

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Landing.jsx` | Hero, animated stats, feature grid, CTA |
| `/predict` | `Dashboard.jsx` | Multi-step form + results dashboard |
| `/login` | `Login.jsx` | JWT login with floating label inputs |
| `/register` | `Register.jsx` | Account creation |

### Key Components

**`StudentForm.jsx`** — 3-step multi-step form with:
- Step 1: Academic Info (CGPA, backlogs, attendance)
- Step 2: Skills & Projects (projects, certifications, technical skills multi-select)
- Step 3: Career & Soft Skills (internships, aptitude, communication/ML sliders)
- Animated step indicator with progress connectors
- Slide transitions between steps using `AnimatePresence`
- Floating label inputs, color-coded rating sliders, skill chip toggles

**`ResultCard.jsx`** — Full analytics dashboard with:
- Animated SVG circular progress rings (count-up animation from 0 to final value)
- Graduation probability bar chart (Recharts)
- Skill gap radar chart (Recharts)
- Staggered card entrance animations
- Priority-tagged course recommendation cards

**`Background.jsx`** — Fixed animated background with:
- Three animated gradient blobs (CSS keyframe animation)
- Subtle dot grid overlay
- Radial vignette

### Design System

- **Theme:** Soft dark (`#03050a` base)
- **Glass cards:** `backdrop-filter: blur(20px)` + `rgba(255,255,255,0.03)` background
- **Animations:** Framer Motion for all transitions (200–400ms, ease-out curves)
- **Typography:** Inter font (400/500/600/700 weights via @fontsource)
- **Colors:** Indigo primary (`#6366f1`), Cyan accent (`#22d3ee`), semantic green/yellow/red

### State Management

No external state library. Auth state lives in `App.jsx` and is passed as props. API calls are centralized in `src/services/api.js` using Axios with a JWT interceptor.

---

## 8. Recommendation Engine

`backend/utils/recommender.py` — pure rule-based engine, no ML involved.

### How it works

Each of the 9 features has a defined threshold. If a student's value falls below (or above, for backlogs) the threshold, that feature is flagged as a weak area.

| Feature | Threshold | Direction |
|---|---|---|
| CGPA | 7.0 | below = weak |
| Backlogs | 2 | above = weak |
| Attendance | 75% | below = weak |
| Projects | 3 | below = weak |
| Internships | 1 | below = weak |
| Certifications | 2 | below = weak |
| Speaking Skills | 3/5 | below = weak |
| ML Knowledge | 3/5 | below = weak |
| Aptitude Score | 60 | below = weak |

For each weak area, the engine returns:
- A human-readable improvement tip
- 1–3 specific course recommendations with platform and URL

**Risk Score** = `(number of weak areas / 9) × 100`
- 0–24%: Low Risk
- 25–54%: Medium Risk
- 55–100%: High Risk

---

## 9. Authentication

The system uses stateless JWT authentication.

**Register flow:**
1. `POST /auth/register` with `{ name, email, password }`
2. Password is hashed with bcrypt
3. JWT token returned (24h expiry)
4. Token stored in `localStorage` as `sg_token`

**Login flow:**
1. `POST /auth/login` with OAuth2 form data (`username`, `password`)
2. Password verified against bcrypt hash
3. JWT token returned

**Protected requests:**
- Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request
- `GET /auth/me` returns current user info

---

## 10. API Reference

### Base URL (local)
```
http://localhost:8000
```

### Endpoints

#### `POST /predict/full`
Combined prediction — placement + graduation + recommendations in one call.

**Request body:**
```json
{
  "cgpa": 7.8,
  "backlogs": 0,
  "attendance": 82.0,
  "projects": 3,
  "internships": 1,
  "certifications": 2,
  "speaking_skills": 4,
  "ml_knowledge": 3,
  "aptitude_score": 68.0,
  "technical_skills": ["Python", "React", "SQL"]
}
```

**Response:**
```json
{
  "placement": {
    "placement_probability": 87.43,
    "placement_label": "Placed",
    "confidence": 87.43
  },
  "graduation": {
    "graduation_status": "On-time",
    "delay_months": 0,
    "probabilities": {
      "on_time": 78.21,
      "delayed_1_sem": 21.34,
      "delayed_2_sem": 0.45
    }
  },
  "recommendations": {
    "weak_areas": ["Certifications"],
    "tips": ["Earn 2–3 industry certifications..."],
    "courses": [...],
    "risk_score": 11.1,
    "risk_level": "Low"
  }
}
```

#### `POST /predict/placement`
Returns only placement prediction.

#### `POST /predict/graduation`
Returns only graduation prediction.

#### `POST /auth/register`
```json
{ "name": "Student Name", "email": "student@example.com", "password": "secret" }
```

#### `POST /auth/login`
OAuth2 form data: `username=email&password=secret`

#### `GET /auth/me`
Returns `{ name, email }` for the authenticated user. Requires `Authorization: Bearer <token>` header.

#### `GET /docs`
Interactive Swagger UI — auto-generated by FastAPI.

---

## 11. Local Setup Guide

### Prerequisites

- Python 3.10 or 3.11
- Node.js 18+
- The input data file at: `data/Prediction of Placement Status Data/01 Train Data.xlsx`

### Step 1 — Clone and set up Python environment

```bash
# From the ML_prediction directory
pip install -r backend/requirements.txt
```

### Step 2 — Train the ML models

This only needs to be done once. It reads the Excel data, trains both models, and saves `.pkl` files to `backend/models/`.

```bash
python backend/utils/train_models.py
```

Expected output:
```
Training Placement Prediction Model...
Placement Accuracy: 0.9318
...
Training Graduation Prediction Model...
Graduation Accuracy: 0.8425
...
All models trained and saved successfully.
```

### Step 3 — Start the backend

```bash
uvicorn backend.main:app --reload --port 8000
```

The API is now live at `http://localhost:8000`.
Swagger docs: `http://localhost:8000/docs`

### Step 4 — Start the frontend

```bash
cd smartgrad-frontend
npm install
npm run dev
```

Open `http://localhost:5173` (or whichever port Vite assigns).

### Environment Variables (Frontend)

Copy `.env.example` to `.env.local`:

```bash
VITE_API_URL=http://localhost:8000
```

If not set, the frontend defaults to `http://localhost:8000`.

---

## 12. Deployment Guide

### Backend → Render

1. Push the project to a GitHub repository
2. Go to [render.com](https://render.com) → New Web Service → Connect repo
3. Render auto-detects `render.yaml` and configures:
   - Build command: `pip install -r backend/requirements.txt && python backend/utils/train_models.py`
   - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `SECRET_KEY` → any long random string
5. After deploy, note your Render URL (e.g. `https://smartgrad-api.onrender.com`)
6. Update `backend/main.py` CORS to allow only your Vercel domain

### Frontend → Vercel

```bash
cd smartgrad-frontend
npx vercel --prod
```

When prompted, set:
```
VITE_API_URL = https://smartgrad-api.onrender.com
```

`vercel.json` already handles SPA routing (all paths → `index.html`).

---

## 13. Model Performance

### Placement Model (GradientBoostingClassifier)

Evaluated on 20% holdout (220 samples):

| Metric | Not Placed | Placed |
|---|---|---|
| Precision | 0.92 | 0.94 |
| Recall | 0.93 | 0.94 |
| F1-Score | 0.92 | 0.94 |
| **Accuracy** | **93.2%** | |

### Graduation Model (RandomForestClassifier)

Evaluated on 20% holdout (1,200 samples):

| Metric | On-time | Delayed 1 sem | Delayed 2+ sem |
|---|---|---|---|
| Precision | 0.85 | 0.83 | 0.93 |
| Recall | 0.85 | 0.86 | 0.64 |
| F1-Score | 0.85 | 0.84 | 0.76 |
| **Accuracy** | **84.3%** | | |

Note: The "Delayed 2+ semesters" class has lower recall because it is a minority class (~7% of samples). This can be improved with class weighting or SMOTE oversampling.

---

## 14. Feature Thresholds & Logic

The recommendation engine uses these thresholds to identify weak areas. These are based on general industry expectations for engineering students in India:

| Feature | Good | Needs Work | Why it matters |
|---|---|---|---|
| CGPA | ≥ 7.0 | < 7.0 | Most companies filter at 6.5–7.0 cutoff |
| Backlogs | ≤ 2 | > 2 | Active backlogs disqualify from many drives |
| Attendance | ≥ 75% | < 75% | Minimum required by most universities |
| Projects | ≥ 3 | < 3 | Demonstrates practical application of skills |
| Internships | ≥ 1 | < 1 | Real-world experience is a strong differentiator |
| Certifications | ≥ 2 | < 2 | Shows initiative and domain knowledge |
| Speaking Skills | ≥ 3/5 | < 3/5 | HR rounds heavily test communication |
| ML Knowledge | ≥ 3/5 | < 3/5 | Most tech roles require some ML/data awareness |
| Aptitude Score | ≥ 60 | < 60 | Online aptitude tests are the first filter in most companies |

---

## 15. Known Limitations & Future Work

### Current Limitations

- **Synthetic features:** Backlogs, attendance, projects, internships, certifications, and aptitude score are synthetically generated during training because the real dataset doesn't contain them. This means the model has learned from simulated relationships, not observed ones.
- **In-memory auth:** User accounts are lost on server restart. MongoDB Atlas integration is scaffolded but not wired up.
- **No historical tracking:** Each prediction is stateless — there's no way to track a student's progress over time.
- **Graduation model minority class:** The "Delayed 2+ semesters" class has lower recall due to class imbalance.

### Planned Improvements

- Wire up MongoDB Atlas for persistent user accounts and prediction history
- Add SMOTE oversampling for the graduation model's minority class
- Resume upload with skill extraction (spaCy or a fine-tuned NER model)
- AI chatbot for career advice (OpenAI API or local LLM)
- Admin dashboard to view aggregate prediction statistics
- Email notifications with weekly progress reports
- Replace synthetic feature generation with a real collected dataset

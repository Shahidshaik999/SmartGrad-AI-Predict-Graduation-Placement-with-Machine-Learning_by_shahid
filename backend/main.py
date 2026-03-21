"""
SmartGrad AI - FastAPI Application Entry Point
Run: uvicorn backend.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.predict import router as predict_router
from backend.routes.auth    import router as auth_router

app = FastAPI(
    title="SmartGrad AI API",
    description="Student Academic & Placement Prediction System",
    version="1.0.0",
)

# ── CORS — allow Vercel frontend + local dev ───────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev: allow all origins; restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(auth_router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "SmartGrad AI API is running"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}

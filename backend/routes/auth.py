"""
SmartGrad AI - Auth Routes
Simple JWT-based email/password authentication.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "smartgrad-secret-change-in-production")
ALGORITHM  = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# In-memory user store (replace with MongoDB in production)
_users: dict = {}

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str
    email: str

def _create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None or email not in _users:
            raise HTTPException(status_code=401, detail="Invalid token")
        return _users[email]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    if req.email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")
    _users[req.email] = {
        "name": req.name,
        "email": req.email,
        "hashed_password": pwd_ctx.hash(req.password),
    }
    token = _create_token({"sub": req.email})
    return TokenResponse(access_token=token, name=req.name, email=req.email)

@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = _users.get(form.username)
    if not user or not pwd_ctx.verify(form.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = _create_token({"sub": form.username})
    return TokenResponse(access_token=token, name=user["name"], email=user["email"])

@router.get("/me")
def me(user=Depends(get_current_user)):
    return {"name": user["name"], "email": user["email"]}

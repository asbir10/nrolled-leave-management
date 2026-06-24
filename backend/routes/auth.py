import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    leave_balance: int


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    password_matches = bcrypt.checkpw(
        body.password.encode(), 
        user.password.encode()
    )
    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return LoginResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        leave_balance=user.leave_balance,
    )
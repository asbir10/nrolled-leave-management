from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User

router = APIRouter(prefix="/users", tags=["users"])


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    leave_balance: int


@router.get("/all", response_model=list[EmployeeResponse])
def get_all_employees(db: Session = Depends(get_db)):
    employees = db.query(User).filter(User.role == "employee").all()
    return [
        EmployeeResponse(
            id=employee.id,
            name=employee.name,
            email=employee.email,
            leave_balance=employee.leave_balance,
        )
        for employee in employees
    ]

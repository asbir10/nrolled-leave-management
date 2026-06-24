from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import LeaveRequest, User

router = APIRouter(prefix="/leave", tags=["leave"])


class LeaveRequestResponse(BaseModel):
    id: int
    user_id: int
    reason: str
    start_date: str
    end_date: str
    days: int
    status: str
    created_at: str

    class Config:
        from_attributes = True


class ApplyLeaveRequest(BaseModel):
    user_id: int
    reason: str
    start_date: str
    end_date: str
    days: int


@router.get("/my/{user_id}", response_model=list[LeaveRequestResponse])
def get_my_leaves(user_id: int, db: Session = Depends(get_db)):
    leaves = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.user_id == user_id)
        .order_by(LeaveRequest.created_at.desc())
        .all()
    )
    return leaves


@router.post("/apply", response_model=LeaveRequestResponse)
def apply_leave(body: ApplyLeaveRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == body.user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if body.days > user.leave_balance:
        raise HTTPException(
            status_code=400,
            detail="Requested days exceed available leave balance",
        )

    leave_request = LeaveRequest(
        user_id=body.user_id,
        reason=body.reason,
        start_date=body.start_date,
        end_date=body.end_date,
        days=body.days,
        status="PENDING",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    )
    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.patch("/action/{leave_id}", response_model=LeaveRequestResponse)
def leave_action(
    leave_id: int,
    action: str = Query(...),
    db: Session = Depends(get_db),
):
    if action not in ("APPROVED", "REJECTED"):
        raise HTTPException(status_code=400, detail="Invalid action")

    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if leave_request is None:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave_request.status = action

    if action == "APPROVED":
        user = db.query(User).filter(User.id == leave_request.user_id).first()
        if user is not None:
            user.leave_balance -= leave_request.days

    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.get("/all", response_model=list[LeaveRequestResponse])
def get_all_leaves(db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).all()
    return leaves

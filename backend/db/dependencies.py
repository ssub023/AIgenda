from db.database import SessionLocal
from sqlalchemy.orm import Session
from db.models import User
from fastapi import Request, HTTPException
from fastapi import Depends

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 현재 로그인한 사용자 가져오기
def get_current_user(request: Request, db: Session = Depends(get_db)):
    user_id = request.session.get("user")

    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
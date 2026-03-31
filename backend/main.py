from fastapi import FastAPI
from api import upload
from db import models
from db.database import engine
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Meeting

app = FastAPI()

# 테이블 생성
models.Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(upload.router)

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 회의 저장 API
@app.post("/meeting")
def create_meeting(text: str, db: Session = Depends(get_db)):
    new_meeting = Meeting(title="test", transcript=text)
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting
from fastapi import FastAPI
from api import upload
from db import models
from db.database import engine
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Meeting
import os
from starlette.middleware.sessions import SessionMiddleware
from api import auth
from db.dependencies import get_db
from dotenv import load_dotenv
from db.dependencies import get_current_user
from db.models import User
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# 세션 활성화
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY"),
    same_site="lax",     # 기본은 lax (OAuth에 안전)
    https_only=False     # 배포 시 True
)

# 세션 유지
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 테이블 생성
models.Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(upload.router)
app.include_router(auth.router)

# 회의 저장 API
@app.post("/meeting")
def create_meeting(text: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_meeting = Meeting(title="test", transcript=text, user_id=user.id)
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting
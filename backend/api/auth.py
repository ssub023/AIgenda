from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import User
from authlib.integrations.starlette_client import OAuth
from db.dependencies import get_db
import os
from dotenv import load_dotenv
from db.dependencies import get_current_user

load_dotenv()

router = APIRouter()
oauth = OAuth()

oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "prompt": "select_account"
    }
)

def get_or_create_user(db, email, name):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=name, provider="google")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
    
# 로그인
@router.get("/auth/google")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

# 구글 로그인 콜백
@router.get("/auth/google/callback", name="auth_callback") 
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    email = user_info["email"]
    name = user_info.get("name")

    user = get_or_create_user(db, email, name)

    # 세션 저장
    request.session["user"] = user.id

    return {"message": "login success"}

# 로그아웃
@router.get("/auth/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "logout"}

# 로그인한 사용자 정보 가져오기
@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name
    }
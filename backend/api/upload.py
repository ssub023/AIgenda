from fastapi import APIRouter, UploadFile, File
import os, uuid
from services.stt_service import transcribe
from db.database import SessionLocal
from db.models import Meeting
from db.dependencies import get_current_user

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user):
    # 파일명 UUID로 변경
    filename = str(uuid.uuid4()) + ".wav"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # 파일 저장
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # STT 실행
    text = transcribe(file_path)

    # DB 저장
    meeting = Meeting(
        title=filename,
        transcript=text,
        user_id=current_user.id
    )
    db.add(meeting)
    db.commit()

    return {"text": text, "filename": filename}

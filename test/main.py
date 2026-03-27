import os
from google import genai

# --- [필수 1] 제미나이 API 키 ---
GEMINI_API_KEY = "YOUR_KEY"
# 최신 구글 GenAI 클라이언트 초기화
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# --- [필수 2] 허깅페이스 토큰 ---
os.environ["HF_TOKEN"] = "YOUR_KEY"
# -----------------------------------------------------------

import torch
import torch.serialization

# === [PyTorch 보안 정책 패치] ===
try:
    from torch.torch_version import TorchVersion
    torch.serialization.add_safe_globals([TorchVersion])
    _original_load = torch.load
    def _patched_load(*args, **kwargs):
        kwargs['weights_only'] = False
        return _original_load(*args, **kwargs)
    torch.load = _patched_load
except Exception as e:
    print(f"[시스템] 보안 패치 중 알림: {e}")
# =================================

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import whisper
import warnings

warnings.filterwarnings('ignore')

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f">>> [시스템] 현재 사용 장치: {device.upper()} (MX450 가속 활성화)")

app = FastAPI()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
HTML_FILENAME = "testapp.html"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

print(">>> [시스템] Whisper Base 모델 로드 중...")
model = whisper.load_model("base", device=device)

print(">>> [시스템] Pyannote 화자 분리 AI 로드 중...")
try:
    from pyannote.audio import Pipeline
    diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1")
    if diarization_pipeline:
        diarization_pipeline.to(torch.device(device))
        print(">>> [시스템] 화자 분리 AI 로드 완료!")
except Exception as e:
    print(f"!!! [경고] 로드 실패: {e}")
    diarization_pipeline = None

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(BASE_DIR, HTML_FILENAME), headers={"Cache-Control": "no-cache"})

def align_segments_with_diarization(whisper_segments, diarization_result):
    speaker_map = {}; speaker_counter = 1; aligned_data = []
    for seg in whisper_segments:
        w_mid = (seg['start'] + seg['end']) / 2
        assigned_speaker = "알 수 없음"
        for turn, _, speaker in diarization_result.itertracks(yield_label=True):
            if turn.start <= w_mid <= turn.end:
                if speaker not in speaker_map:
                    speaker_map[speaker] = f"화자 {speaker_counter}"; speaker_counter += 1
                assigned_speaker = speaker_map[speaker]; break
        time_str = f"{int(seg['start']//60)}:{int(seg['start']%60):02d}"
        if aligned_data and aligned_data[-1]['speaker'] == assigned_speaker:
            aligned_data[-1]['text'] += f" {seg['text'].strip()}"
        else:
            aligned_data.append({"speaker": assigned_speaker, "text": seg['text'].strip(), "time": time_str})
    return aligned_data

# === [자동 탐색 기능이 추가된 제미나이 요약 엔진] ===
def run_gemini_summarization(text):
    print(">>> [분석] 제미나이(Gemini) API 호출 중...")
    if len(text) < 30: 
        return "회의 내용이 너무 짧아 AI 분석이 어렵습니다.", ["사안 부족"]
    
    try:
        prompt = f"""
        다음은 회의 녹음의 STT(텍스트 변환) 결과입니다. 문맥을 파악하여 비즈니스 회의록을 작성하세요.
        반드시 아래의 2가지 항목만 출력해야 하며, 다른 인삿말이나 부연 설명은 절대 하지 마세요.

        요약: (전체 대화를 관통하는 핵심 내용 1~2문장)
        결정:
        - (결정된 사안이나 향후 액션 아이템 1)
        - (결정된 사안이나 향후 액션 아이템 2)
        - (결정된 사안이나 향후 액션 아이템 3)

        회의 내용:
        {text}
        """
        
        # 작동 가능한 모델을 순차적으로 찔러보는 안전망
        target_models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']
        response = None
        
        for model_name in target_models:
            try:
                response = gemini_client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                print(f"    -> [성공] {model_name} 모델과 연결되었습니다!")
                break  # 성공하면 반복문 탈출
            except Exception as inner_e:
                if "404" in str(inner_e) or "not found" in str(inner_e).lower():
                    continue  # 404 에러면 다음 모델로 넘어감
                else:
                    raise inner_e  # 다른 종류의 에러면 밖으로 던짐
                    
        if not response:
            raise Exception("API 키에 허용된 모델을 찾을 수 없습니다.")
            
        result_text = response.text
        parts = result_text.split("결정:")
        summary = parts[0].replace("요약:", "").strip()
        
        if len(parts) > 1:
            bullets_raw = parts[1].strip().split('\n')
            bullets = [b.strip("-* ") for b in bullets_raw if b.strip("-* ")]
        else:
            bullets = ["명확하게 도출된 결정 사안이 없습니다."]
            
        return summary, bullets[:4]
        
    except Exception as e:
        print(f"!!! 제미나이 API 에러: {e}")
        return "AI 요약 생성 중 오류가 발생했습니다.", ["API 연결 확인 필요"]
# ====================================

@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    try:
        save_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(save_path, "wb") as buffer: buffer.write(await file.read())
        
        print(f"[1/3] Whisper STT 시작 ({device})...")
        result = model.transcribe(save_path, fp16=(device=="cuda"), language="ko")
        full_text = result['text']
        
        print(f"[2/3] Pyannote 화자 추적 시작 ({device})...")
        if diarization_pipeline:
            diarization_result = diarization_pipeline(save_path)
            diarized_contents = align_segments_with_diarization(result['segments'], diarization_result)
        else:
            diarized_contents = [{"speaker": "화자 1", "text": full_text, "time": "0:00"}]
            
        print(f"[3/3] 제미나이(Gemini) 딥러닝 요약 진행...")
        summary, bullets = run_gemini_summarization(full_text)
        
        return {"summary": summary, "bullets": bullets, "diarized": diarized_contents}
    except Exception as e:
        print(f"!!! 에러: {e}"); return {"error": str(e)}
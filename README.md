# 🎙️ AIgenda (캡스톤 디자인 프로젝트)

> **프로젝트 한줄 소개:** OpenAI Whisper로 음성을 텍스트로 변환하고, Google Gemini API를 활용해 회의록을 요약 및 분석(RAG)하여 마인드맵 형태로 시각화해주는 AI 기반 회의 관리 서비스

## 👥 팀원 및 역할 (Team Roles)

| 이름 | 역할 및 담당 파트 |
| :---: | :--- |
| **최성민**<br>(팀장/PM) | **[PM / AI]**<br>- 프로젝트 총괄 (PM)<br>- 오픈소스 모델 연동 및 관리<br>- AI 모델 학습 및 프롬프트 엔지니어링<br>- RAG 알고리즘 설계 |
| **김희진** | **[Front-end]**<br>- 웹서비스 UI/UX 구축<br>- 사용자 인터페이스 설계 및 구현 |
| **윤수빈** | **[Front-end]**<br>- 데이터 시각화 인터랙션 구현<br>- 전체 레이아웃 설계 |
| **한혜현** | **[Back-end]**<br>- 서버 인프라 구축<br>- API 개발<br>- DB 연동 및 관리 |


<br>

## 🛠️ 기술 스택 (Tech Stack)

- **Front-end:** React
- **Back-end:** FastAPI
- **AI / Data:** OpenAI Whisper, Google Gemini API, ChromaDB
- **Collaboration & Tools:** GitHub, Visual Studio Code (IDE)

<br>

## 📂 디렉토리 구조 (Directory Structure)
```text
AIgenda/
├── frontend/    # UI 컴포넌트 (React), 마인드맵 렌더링, API 요청 등
├── backend/     # API 서버 (FastAPI), DB 연동 (ChromaDB), Gemini API 호출 등
├── ai/          # Whisper STT 로직, 프롬프트 테스트 스크립트 등
└── README.md

// 1. 날짜 예쁘게 깎기 (2026-04-14T19:27... -> 2026. 4. 14.)
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
};

// 2. 파일 용량 변환 (1048576 -> 1 MB) : 파일 업로드 UI 등에 사용
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 3. STT 원시 초(Seconds)를 시간 포맷(MM:SS)으로 변환
// (예: 서버가 125초를 주면 "02:05"로 변환해서 회의록 탭에 표시)
export const formatTimeCode = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

// 4. LLM 텍스트 쓰레기값 청소기
// (AI가 멋대로 넣은 **, # 같은 마크다운 특수기호를 날려버립니다)
export const cleanLlmText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/#/g, '').trim();
};

// 5. LLM 배열(리스트) 추출기
// (서버가 텍스트 덩어리로 준 결정 사안들을 예쁜 배열 형태로 쪼개줍니다)
export const parseBullets = (rawText) => {
    if (!rawText) return [];
    
    // 줄바꿈으로 나누고, 문장 앞의 점(•, -, *)을 지운 뒤 빈 줄을 걸러냅니다.
    return rawText.split('\n')
        .map(line => line.replace(/^[-*+•]\s+/, '').trim()) 
        .filter(line => line.length > 0);
};


// 활용 예시 (나중에 meeting.js나 Workspace.js에서 백엔드 데이터를 받았을 때)

// import { formatDate, formatTimeCode, cleanLlmText, parseBullets } from '../utils/format';

// // 서버에서 받은 못생긴 데이터
// const rawData = await response.json(); 

// // 프론트엔드에서 예쁘게 세탁한 데이터
// const cleanData = {
//     meta: formatDate(rawData.created_at),               // "2026. 4. 14."
//     summary: cleanLlmText(rawData.llm_summary),         // 특수기호 빠진 깔끔한 글
//     bullets: parseBullets(rawData.llm_decisions),       // 배열로 쪼개진 결정 사안
//     transcript: rawData.stt_result.map(item => ({
//         time: formatTimeCode(item.start_time),          // "02:05"
//         text: item.text
//     }))
// };
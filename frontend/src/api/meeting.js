// FastAPI 서버 주소 (보통 로컬 테스트 시 8000번 포트를 씁니다)
const BASE_URL = 'http://localhost:8000/api';

// 1. 서버에 저장된 모든 회의 목록 가져오기
export const fetchMeetings = async () => {
    try {
        const response = await fetch(`${BASE_URL}/meetings`);
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
        return await response.json();
    } catch (error) {
        console.error("fetchMeetings Error:", error);
        return null;
    }
};

// 2. 음성 파일 업로드하고 요약 결과 받아오기 (제일 중요한 기능!)
export const uploadAudioFile = async (file) => {
    const formData = new FormData();
    formData.append('audio_file', file);

    try {
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData, // 파일은 JSON이 아니라 FormData로 쏴야 합니다!
        });
        
        if (!response.ok) throw new Error('파일 업로드에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error("uploadAudioFile Error:", error);
        throw error;
    }
};

// 3. 노트 삭제하기
export const deleteMeeting = async (meetingId) => {
    try {
        const response = await fetch(`${BASE_URL}/meetings/${meetingId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('삭제 실패');
        return true;
    } catch (error) {
        console.error("deleteMeeting Error:", error);
        return false;
    }
};
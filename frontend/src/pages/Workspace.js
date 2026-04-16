import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Summary from '../components/Summary';
import MindMap from '../components/MindMap';
import Transcript from '../components/Transcript';

// 임시 데이터
const initialMeetingData = {
  "meeting_003": {
    title: "AIgenda 모바일 앱 V2.0 디자인 시스템 최종 검수",
    meta: "2026. 4. 8.",
    summary: "사용자 편의성을 위해 '다크 모드'의 대비감을 조정하고, 마인드맵 시각화 화면에서 핀치 줌 기능을 강화하기로 했습니다. 특히 시각적 요소가 강조된 Mermaid 차트의 가독성을 높이는 것에 집중했습니다.",
    bullets: [
      "[디자인] 다크모드 텍스트 컬러를 #FFFFFF로 상향 조정",
      "[개발] Mermaid.js 렌더링 시 폰트 크기 18px 강제 적용",
      "[QA] 저사양 단말기에서의 시각화 로딩 속도 최적화"
    ],
    transcript: [
      { time: "00:00", text: "본격적으로 회의 시작하도록 하겠습니다. 오늘 안건은 AIgenda 모바일 앱 V2.0 디자인 시스템 최종 검수입니다." },
      { time: "12:05", text: "마인드맵이 모바일에서 너무 작게 보인다는 사용자 피드백이 지속적으로 들어오고 있습니다." },
      { time: "14:30", text: "네, 그래서 차트 렌더링 옵션에서 useMaxWidth를 끄고 핀치 줌을 활성화하는 방향으로 수정하겠습니다." },
      { time: "18:45", text: "다크모드일 때 글씨가 잘 안 보인다는 의견도 있었으니, 텍스트 컬러를 #FFFFFF로 상향 조정해 주세요." },
      { time: "22:10", text: "알겠습니다. 해당 사항들 반영해서 다음 주 수요일까지 QA 넘기도록 하겠습니다." }
    ],
    mermaidCode: "flowchart TB\n  Root([UX/UI 개편]) --> UI{UI 개선}\n  Root --> Dev{개발 과제}\n  UI --> UI1[다크모드 대비 조정]\n  Dev --> Dev1[줌 기능 강화]\n  Dev --> Dev2[폰트 크기 확대]"
  },
  "meeting_002": {
    title: "2026년 1분기 영업 실적 분석 및 2분기 전망",
    meta: "2026. 4. 5.",
    summary: "1분기 매출은 전년 대비 12% 성장했으나, 원자재 가격 상승으로 인해 영업 이익률이 3% 감소했습니다. 이를 보완하기 위해 공급망 다변화와 공정 효율화 작업을 우선순위로 두기로 결정했습니다.",
    bullets: [
      "[재무] 영업 이익 방어를 위한 비상 경영 체제 돌입",
      "[SCM] 베트남 신규 공급처 계약 검토 완료 (4월 말까지)",
      "[인사] 공정 효율화 전담 TF팀 구성"
    ],
    transcript: [
      { time: "01:10", text: "1분기 실적 보고서 다들 확인하셨죠? 매출은 올랐는데 이익률이 떨어졌습니다." },
      { time: "05:20", text: "원가 비중이 너무 높습니다. 다른 공급처 확보가 시급해요." },
      { time: "08:10", text: "다음 주까지 베트남 쪽 파트너사 리스트업해서 보고하겠습니다." },
      { time: "15:00", text: "내부 공정 효율화도 필요하니, 인사팀에서는 다음 달 초까지 전담 TF팀을 구성해 주세요." }
    ],
    mermaidCode: "flowchart LR\n  Root([1분기 실적]) --> Status{현황}\n  Status --> Revenue[매출 12% 상승]\n  Status --> Profit[이익률 3% 하락]\n  Profit --> Solution[대응책]\n  Solution --> S1[공급망 다변화]\n  Solution --> S2[TF팀 구성]"
  }
};

function Workspace() {
  const [meetings, setMeetings] = useState(initialMeetingData);
  const [currentId, setCurrentId] = useState(null);
  const [currentTab, setCurrentTab] = useState('summary');
  const [isDark, setIsDark] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null });
  const editInputRef = useRef(null);

  useEffect(() => {
    const sortedKeys = Object.keys(meetings).sort().reverse();
    if (sortedKeys.length > 0 && !currentId) setCurrentId(sortedKeys[0]);
  }, [meetings, currentId]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleToggleTheme = (e) => {
    const checked = e.target.checked;
    setIsDark(checked);
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light');
  };

  const handleFileUpload = (e) => {
    alert("아직 백엔드 서버가 연결되지 않았습니다!");
    e.target.value = '';
  };

  // 노트 삭제 확정 함수
  const confirmDelete = () => {
    const { targetId } = deleteModal;
    if (!targetId) return;

    const newMeetings = { ...meetings };
    delete newMeetings[targetId];

    setMeetings(newMeetings);
    setDeleteModal({ isOpen: false, targetId: null });

    if (currentId === targetId) {
      const remainingKeys = Object.keys(newMeetings).sort().reverse();
      setCurrentId(remainingKeys.length > 0 ? remainingKeys[0] : null);
    }
  };

  // 사이드바에서 제목을 저장할 때 호출되는 함수
  const saveTitle = (id, newTitle) => {
    if (newTitle.trim()) {
      setMeetings({
        ...meetings,
        [id]: { ...meetings[id], title: newTitle }
      });
    }
    setEditingId(null);
  };

  // 우측 메인 화면에서 제목을 저장할 때 호출되는 함수
  const saveHeaderTitle = (newTitle) => {
    if (newTitle.trim()) {
      setMeetings({ ...meetings, [currentId]: { ...meetings[currentId], title: newTitle } });
    }
    setIsEditingHeader(false);
  };

  const activeMeeting = meetings[currentId];

  return (
    <>
      <Header onUpload={handleFileUpload} onToggleTheme={handleToggleTheme} />

      <main className="app-container">
        <Sidebar
          meetings={meetings}
          currentId={currentId}
          onSelect={setCurrentId}
          editingId={editingId}
          setEditingId={setEditingId}
          saveTitle={saveTitle}
          onDeleteClick={(id) => setDeleteModal({ isOpen: true, targetId: id })}
        />

        <section className="right-panel">
          {activeMeeting ? (
            <>
              <div className="workspace-header" style={{ display: 'block' }}>
                <div className="ws-meta">{activeMeeting.meta}</div>
                <div className="ws-title-container">
                  {/* 분리된 상태(isEditingHeader)와 함수(saveHeaderTitle)를 사용 */}
                  {isEditingHeader ? (
                    <input
                      style={{ 
                        fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', 
                        fontWeight: 800, 
                        width: '100%', 
                        border: 'none', 
                        outline: 'none', 
                        background: 'transparent', 
                        color: 'var(--ink)' 
                      }}
                      defaultValue={activeMeeting.title}
                      autoFocus
                      onBlur={(e) => saveHeaderTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveHeaderTitle(e.target.value);
                        if (e.key === 'Escape') setIsEditingHeader(false);
                      }}
                    />
                  ) : (
                    <>
                      <h2 className="ws-title">{activeMeeting.title}</h2>
                      <button className="header-edit-btn" onClick={() => setIsEditingHeader(true)} title="수정">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button className="header-delete-btn" onClick={() => setDeleteModal({ isOpen: true, targetId: currentId })} title="삭제">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="tabs-container">
                <button className={`tab-btn ${currentTab === 'summary' ? 'active' : ''}`} onClick={() => setCurrentTab('summary')}>요약</button>
                <button className={`tab-btn ${currentTab === 'visualization' ? 'active' : ''}`} onClick={() => setCurrentTab('visualization')}>시각화</button>
                <button className={`tab-btn ${currentTab === 'transcript' ? 'active' : ''}`} onClick={() => setCurrentTab('transcript')}>회의록</button>
              </div>

              <div className="workspace-content">
                {currentTab === 'summary' && <Summary meeting={activeMeeting} />}
                {currentTab === 'visualization' && <MindMap meetingId={currentId} mermaidCode={activeMeeting.mermaidCode} isDark={isDark} />}
                {currentTab === 'transcript' && <Transcript meeting={activeMeeting} />}
              </div>
            </>
          ) : (
            // 모든 노트가 지워졌을 때 보여줄 빈 화면
            <div className="workspace-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="empty-state">
                <button className="btn-new" style={{ marginBottom: '1.2rem', boxShadow: 'var(--sh-sm)' }} onClick={() => document.getElementById('fileInput').click()}>
                  <span className="btn-plus">+</span> 새로운 노트
                </button>
                <p className="empty-label">우측 상단이나 중앙의 버튼을 눌러<br />새로운 회의 음성을 업로드해보세요.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 휴지통 버튼을 눌렀을 때 뜨는 삭제 확인 모달창 */}
      <div className={`modal-overlay ${deleteModal.isOpen ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-title">노트 삭제</div>
          <div className="modal-desc">이 노트를 정말 삭제하시겠습니까?<br />삭제된 데이터는 복구할 수 없습니다.</div>
          <div className="modal-actions">
            <button className="btn-modal-cancel" onClick={() => setDeleteModal({ isOpen: false, targetId: null })}>취소</button>
            <button className="btn-modal-danger" onClick={confirmDelete}>삭제</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Workspace;
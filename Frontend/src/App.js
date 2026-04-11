import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Summary from './components/Summary';
import MindMap from './components/MindMap';

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
    mermaidCode: "flowchart LR\n  Root([1분기 실적]) --> Status{현황}\n  Status --> Revenue[매출 12% 상승]\n  Status --> Profit[이익률 3% 하락]\n  Profit --> Solution[대응책]\n  Solution --> S1[공급망 다변화]\n  Solution --> S2[TF팀 구성]"
  }
};

function App() {
  const [meetings, setMeetings] = useState(initialMeetingData);
  const [currentId, setCurrentId] = useState(null);
  const [currentTab, setCurrentTab] = useState('summary');
  const [isDark, setIsDark] = useState(false);

  const [editingId, setEditingId] = useState(null);
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

  // 제목 수정 저장 함수
  const saveTitle = (id, newTitle) => {
    if (newTitle.trim()) {
      setMeetings({
        ...meetings,
        [id]: { ...meetings[id], title: newTitle }
      });
    }
    setEditingId(null);
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
                  <h2 className="ws-title">{activeMeeting.title}</h2>
                </div>
              </div>

              <div className="tabs-container">
                <button className={`tab-btn ${currentTab === 'summary' ? 'active' : ''}`} onClick={() => setCurrentTab('summary')}>요약</button>
                <button className={`tab-btn ${currentTab === 'visualization' ? 'active' : ''}`} onClick={() => setCurrentTab('visualization')}>시각화</button>
              </div>

              <div className="workspace-content">
                {currentTab === 'summary' && <Summary meeting={activeMeeting} />}
                {currentTab === 'visualization' && <MindMap meetingId={currentId} mermaidCode={activeMeeting.mermaidCode} isDark={isDark} />}
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

export default App;
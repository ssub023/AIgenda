import React, { useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: '이곳에 주제 입력' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: '첫 번째 핵심 키워드' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: '두 번째 핵심 키워드' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('mindmap');

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', !isDark ? 'dark' : 'light');
  };

  // 파일 업로드 처리 (가짜 백엔드 연동)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);

    // 실제로는 여기서 fetch('/upload') 로 백엔드에 보내야 하지만,
    // 지금은 백엔드가 없으므로 setTimeout으로 2초 뒤에 가짜 데이터를 생성함.
    setTimeout(() => {
      const newMeeting = {
        id: 'meeting_' + Date.now(),
        title: file.name.split('.')[0] + ' 회의',
        date: new Date().toLocaleDateString(),
        summary: "이곳은 AI가 요약한 텍스트가 들어갈 자리입니다. 프롬프트 엔지니어링 결과물이 이곳에 출력됩니다."
      };

      setMeetings([newMeeting, ...meetings]);
      setActiveMeeting(newMeeting);
      setIsLoading(false);
      
      event.target.value = '';
    }, 2000);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay" style={{ display: 'flex' }}>
          <div className="loader-ring"></div>
          <div className="loading-text">AI가 회의록을 분석하고 있습니다...</div>
        </div>
      )}

      <div className="bg-mesh"><div className="blob blob1"></div><div className="blob blob2"></div><div className="blob blob3"></div></div>

      <header className="top-navbar">
        <div className="logo-wrap"><div className="logo">AIgenda</div></div>
        <input type="text" className="global-search" placeholder="전체 워크스페이스 검색..." />
        <div className="top-actions">
          <button className="btn-icon" onClick={toggleDarkMode} title="다크모드 전환">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          
          <input type="file" id="fileInput" accept="audio/*,video/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          
          <button className="btn-new" onClick={() => document.getElementById('fileInput').click()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>새 회의 녹음
          </button>
        </div>
      </header>

      <main className="app-container">
        <aside className="left-panel">
          <div className="panel-header">회의 기록 보관함 <span style={{ fontSize: '1rem', color: '#8b5cf6', fontWeight: 800, background: '#f3f0ff', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>{meetings.length}건</span></div>
          <div className="meeting-list">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className={`meeting-item ${activeMeeting?.id === meeting.id ? 'active' : ''}`}
                onClick={() => setActiveMeeting(meeting)}
              >
                <div className="m-title">{meeting.title}</div>
                <div className="m-meta">📅 {meeting.date}</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="right-panel">
          {!activeMeeting && (
            <div className="workspace-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ textAlign:'center', color: 'var(--text-muted)', fontSize: '1.3rem' }}>
                우측 상단의 <b>'+ 새 회의 녹음'</b> 버튼을 눌러 오디오 파일을 업로드해보세요.
              </div>
            </div>
          )}

          {activeMeeting && (
            <>
              <div className="workspace-header" style={{ display: 'block' }}>
                <div className="ws-meta">📅 업로드 일자: {activeMeeting.date}</div>
                <h2 className="ws-title">{activeMeeting.title}</h2>
                <div className="tabs">
                  <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>텍스트 요약</button>
                  <button className={`tab-btn ${activeTab === 'mindmap' ? 'active' : ''}`} onClick={() => setActiveTab('mindmap')}>마인드맵 시각화</button>
                </div>
              </div>
              
              <div className="workspace-content" style={{ padding: activeTab === 'mindmap' ? 0 : '3rem' }}> 
                {/* 탭이 'mindmap'일 때 */}
                {activeTab === 'mindmap' && (
                  <div style={{ width: '100%', height: '100%', flex: 1, minHeight: '600px' }}>
                    <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
                      <Background />
                      <Controls />
                    </ReactFlow>
                  </div>
                )}

                {/* 탭이 'summary'일 때 */}
                {activeTab === 'summary' && (
                  <div className="summary-section">
                    <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg> 회의 핵심 요약</h3>
                    <div className="summary-card">
                      <p>{activeMeeting.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
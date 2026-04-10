import React from 'react';

// 부모(App.js)로부터 데이터(meetings), 현재 선택된 ID(currentId), 클릭 함수(onSelect)를 받아옵니다.
function Sidebar({ meetings, currentId, onSelect }) {
  // 회의 ID들을 최신순(내림차순)으로 정렬
  const sortedIds = Object.keys(meetings).sort().reverse();

  return (
    <aside className="left-panel">
      {/* 스프링 노트 구멍 디자인 */}
      <div className="binding-strip">
        {[...Array(15)].map((_, i) => <div key={i} className="ring"></div>)}
      </div>
      
      <div className="left-inner">
        <div className="panel-header">
          <div className="search-wrap">
            <span className="search-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input type="text" className="global-search" placeholder="회의 제목 검색" />
          </div>
        </div>
        
        <div className="meeting-list">
          {sortedIds.map(id => (
            <div 
              key={id} 
              className={`meeting-item ${id === currentId ? 'active' : ''}`}
              onClick={() => onSelect(id)}
            >
              <div className="m-title">{meetings[id].title}</div>
              <div className="m-meta">{meetings[id].meta}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
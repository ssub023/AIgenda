import React, { useState, useRef, useEffect } from 'react';

function Sidebar({ meetings, currentId, onSelect, editingId, setEditingId, saveTitle, onDeleteClick }) {
  const sortedIds = Object.keys(meetings).sort().reverse();
  
  // 어떤 아이템의 '...' 메뉴가 열려있는지 기억하는 State
  const [menuOpenId, setMenuOpenId] = useState(null);
  const editInputRef = useRef(null);
  const dropdownRef = useRef(null); // 🌟 드롭다운 영역을 감지하기 위한 Ref

  // 🌟 메뉴 바깥 클릭 시 드롭다운을 닫는 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 클릭된 곳이 드롭다운 메뉴 안쪽이 아니라면 메뉴를 닫음
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };

    // 마우스 클릭 이벤트 등록
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // 컴포넌트가 사라질 때 이벤트 해제
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 수정 모드가 켜지면 자동으로 인풋창에 커서를 줌
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  return (
    <aside className="left-panel">
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
              style={{ position: 'relative' }} // 🌟 드롭다운의 기준점이 됨
              onClick={() => {
                if (editingId !== id) {
                  onSelect(id);
                  setMenuOpenId(null);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                
                {/* 1. 수정 모드일 때 */}
                {editingId === id ? (
                  <input
                    ref={editInputRef}
                    className="sidebar-edit-input"
                    defaultValue={meetings[id].title}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => saveTitle(id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTitle(id, e.target.value);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                ) : (
                  /* 2. 일반 모드일 때 */
                  <div className="m-title">{meetings[id].title}</div>
                )}

                {/* 3. 메뉴 (...) 및 드롭다운 영역 */}
                {!editingId && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    ref={menuOpenId === id ? dropdownRef : null} // 🌟 열린 메뉴에만 Ref 연결
                  >
                    <button 
                      className="btn-more" 
                      onClick={() => setMenuOpenId(menuOpenId === id ? null : id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>

                    {/* 🌟 수정된 드롭다운 메뉴 구조 */}
                    {menuOpenId === id && (
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item" 
                          onClick={() => { setEditingId(id); setMenuOpenId(null); }}
                        >
                          수정
                        </button>
                        <button 
                          className="dropdown-item del" 
                          onClick={() => { onDeleteClick(id); setMenuOpenId(null); }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="m-meta">{meetings[id].meta}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
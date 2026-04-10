import React from 'react';

// App.js에서 onUpload와 onToggleTheme을 전달받음
function Header({ onUpload, onToggleTheme }) {
  return (
    <header className="top-navbar">
      <div className="logo-wrap">
        <div className="logo-text">
          <span className="logo-name">AIgenda</span>
        </div>
      </div>
      
      <div className="top-actions">
        {/* 다크모드 토글 스위치 */}
        <label className="theme-toggle-wrapper">
          <span className="theme-toggle-text">어두운 모드</span>
          <div className="theme-switch">
            <input type="checkbox" id="theme-toggle-cb" onChange={onToggleTheme} />
            <span className="switch-slider"></span>
          </div>
        </label>
        
        {/* 숨겨진 파일 업로드 인풋 */}
        <input 
          type="file" 
          id="fileInput" 
          accept="audio/*,video/*" 
          style={{ display: 'none' }} 
          onChange={onUpload} 
        />
        
        {/* 새로운 노트 버튼 (클릭 시 숨겨진 input을 대신 클릭함) */}
        <button className="btn-new" onClick={() => document.getElementById('fileInput').click()}>
          <span className="btn-plus">+</span> 새로운 노트
        </button>
      </div>
    </header>
  );
}

export default Header;
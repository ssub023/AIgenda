import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

function MindMap({ meetingId, mermaidCode, isDark }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const mainRef = useRef(null);
  const modalRef = useRef(null);
  
  const mainDragRef = useRef(null);
  const modalDragRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const renderMermaid = async () => {
      try {
        if (mainRef.current) {
          const { svg } = await mermaid.render(`main-${meetingId}-${Date.now()}`, mermaidCode);
          mainRef.current.innerHTML = svg;
        }
        if (isModalOpen && modalRef.current) {
          const { svg } = await mermaid.render(`modal-${meetingId}-${Date.now()}`, mermaidCode);
          modalRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid 렌더링 에러:", error);
      }
    };

    renderMermaid();
  }, [meetingId, mermaidCode, isDark, isModalOpen]);

  const handleMouseDown = (e, ref) => {
    if (!ref.current) return;
    const ele = ref.current;
    ele.isDown = true;
    ele.startX = e.pageX - ele.offsetLeft;
    ele.scrollLeftStart = ele.scrollLeft;
    ele.startY = e.pageY - ele.offsetTop;
    ele.scrollTopStart = ele.scrollTop;
    
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
  };

  const handleMouseLeaveOrUp = (ref) => {
    if (!ref.current) return;
    const ele = ref.current;
    ele.isDown = false;
    
    ele.style.cursor = 'grab';
    ele.style.userSelect = '';
  };

  const handleMouseMove = (e, ref) => {
    if (!ref.current || !ref.current.isDown) return;
    e.preventDefault();
    const ele = ref.current;
    const x = e.pageX - ele.offsetLeft;
    const y = e.pageY - ele.offsetTop;
    const walkX = x - ele.startX;
    const walkY = y - ele.startY;
    ele.scrollLeft = ele.scrollLeftStart - walkX;
    ele.scrollTop = ele.scrollTopStart - walkY;
  };

  return (
    <div className="viz-full-container">
      {/* ── 기본 마인드맵 화면 ── */}
      <div className="viz-card-expanded">
        <button className="btn-expand-viz" onClick={() => setIsModalOpen(true)} title="크게 보기">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
        </button>
        
        <div 
          ref={mainDragRef}
          className="viz-drag-area"
          onMouseDown={(e) => handleMouseDown(e, mainDragRef)}
          onMouseLeave={() => handleMouseLeaveOrUp(mainDragRef)}
          onMouseUp={() => handleMouseLeaveOrUp(mainDragRef)}
          onMouseMove={(e) => handleMouseMove(e, mainDragRef)}
        >
          <div ref={mainRef} className="mermaid-render-area" style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>

      {/* ── 전체화면 확대 모달창 ── */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal-content modal-viz-content">
          <div className="modal-viz-header">
            <div className="modal-viz-title">마인드맵 상세 보기</div>
            <button className="btn-close-viz" onClick={() => setIsModalOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div 
            ref={modalDragRef}
            className="modal-viz-body viz-drag-area"
            onMouseDown={(e) => handleMouseDown(e, modalDragRef)}
            onMouseLeave={() => handleMouseLeaveOrUp(modalDragRef)}
            onMouseUp={() => handleMouseLeaveOrUp(modalDragRef)}
            onMouseMove={(e) => handleMouseMove(e, modalDragRef)}
          >
            {isModalOpen && (
              <div ref={modalRef} className="mermaid-render-area" style={{ width: '100%', height: '100%' }}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MindMap;
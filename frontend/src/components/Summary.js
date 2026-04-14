import React from 'react';

function Summary({ meeting }) {
  if (!meeting) return null;

  return (
    <>
      <div className="summary-section">
        <h3>핵심 요약</h3>
        <div className="summary-card">{meeting.summary}</div>
      </div>
      <div className="summary-section">
        <h3>결정 사안</h3>
        <div className="decision-list">
          {meeting.bullets.map((b, i) => {
            // "[분류] 내용" 형태의 텍스트를 배지와 일반 텍스트로 분리하는 로직
            const badgeMatch = b.match(/^\[(.*?)\]/);
            const badge = badgeMatch ? badgeMatch[1] : "사안";
            const text = b.replace(/^\[.*?\]\s*/, '');
            
            return (
              <label key={i} className="decision-item-wrap">
                <input type="checkbox" className="check-box-ui" />
                <span className="decision-badge">{badge}</span>
                <span className="decision-text">{text}</span>
              </label>
            )
          })}
        </div>
      </div>
    </>
  );
}

export default Summary;
import React from 'react';

function Transcript({ meeting }) {
  // 회의 데이터가 없거나 회의록(transcript) 데이터가 없으면 빈 화면 반환
  if (!meeting || !meeting.transcript) return null;

  return (
    <div className="transcript-container" key={meeting.title}>
      {meeting.transcript.map((item, index) => (
        <div key={index} className="transcript-line" style={{ animationDelay: `${index * 0.05}s` }}>
          <div className="ts-time-badge">{item.time}</div>
          <div className="ts-text">{item.text}</div>
        </div>
      ))}
    </div>
  );
}

export default Transcript;
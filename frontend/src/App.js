import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Workspace from './pages/Workspace';

function App() {
  // 지금은 프론트엔드 프로토타입 단계이므로 State로 로그인 여부를 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 성공 시 호출될 함수
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* 1. 로그인 페이지: 로그인되지 않았다면 Login 컴포넌트를 보여줍니다. */}
        <Route 
          path="/login" 
          element={!isLoggedIn ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/" />} 
        />

        {/* 2. 메인 워크스페이스: 로그인된 경우에만 접근 가능하도록 보호합니다. */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Workspace /> : <Navigate to="/login" />} 
        />

        {/* 3. 잘못된 주소로 들어오면 로그인 페이지로 보냅니다. */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
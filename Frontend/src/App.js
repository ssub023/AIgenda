import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// 우리가 화면에 띄울 상자(노드) 정보
const initialNodes = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: '이곳에 주제 입력' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: '첫 번째 핵심 키워드' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: '두 번째 핵심 키워드' } },
];

// 상자들을 연결하는 선(엣지) 정보
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
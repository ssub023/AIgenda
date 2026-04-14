import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Login.css';
import googleIcon from '../assets/images/google.png';

function Login({ onLogin }) {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'auto';
        
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.style.height = 'auto';
            rootElement.style.padding = '0';
        }

        AOS.init({ 
            duration: 1000, 
            once: false 
        });
        
        setTimeout(() => AOS.refresh(), 100);

        return () => {
            document.body.style.overflow = 'hidden';
            if (rootElement) {
                rootElement.style.height = '100vh';
                rootElement.style.padding = 'clamp(14px, 1.2vw, 22px)';
            }
        };
    }, []);

    const handleGoogleLogin = () => {
        // 실제 구글 로그인 API가 연동되기 전까지는 
        // 클릭 시 바로 로그인이 완료된 것으로 처리
        onLogin(); 
        navigate('/'); // 로그인 후 메인 화면으로 이동
    };

    return (
        <div className="login-page">
            <section className="hero">
                <div data-aos="fade-down" data-aos-duration="1000">
                    <h1>AIgenda</h1>
                    <p>녹음된 일상이 지식이 되는 순간,<br />파일 업로드 한 번으로 완성되는 스마트 회의 리포트</p>
                    {/* 클릭 이벤트 연결 */}
                    <button className="btn-google" onClick={handleGoogleLogin}>
                        <img src={googleIcon} alt="Google" style={{ width: '20px', marginRight: '12px' }} />
                        Google 계정으로 시작하기
                    </button>
                </div>
            </section>

            <section className="section-surface">
                <div className="container">
                    <div className="text-area" data-aos="fade-right">
                        <span className="badge">Recording Upload</span>
                        <h2>기록은 AI에게,<br />대화에만 몰입하세요.</h2>
                        <p>회의나 강의 중 녹음한 파일을 업로드하세요. <br />정교한 음성 인식 기술이 모든 대화를 텍스트로 정확하게 변환해 드립니다.</p>
                    </div>
                    <div className="image-area" data-aos="fade-left">
                        [파일 업로드 및 STT 변환 화면 이미지]
                    </div>
                </div>
            </section>

            <section>
                <div className="container" style={{ flexDirection: 'row-reverse' }}>
                    <div className="text-area" data-aos="fade-left">
                        <span class="badge">LLM Summary</span>
                        <h2>긴 대화 속에서<br />핵심만 골라냅니다.</h2>
                        <p>방대한 텍스트 데이터를 일일이 읽을 필요 없습니다. <br />LLM 기반 AI가 회의의 주요 안건과 결정 사항을 요약 리포트로 제공합니다.</p>
                    </div>
                    <div className="image-area" data-aos="fade-right">
                        [AI 요약 리포트 화면 이미지]
                    </div>
                </div>
            </section>

            <section className="section-surface">
                <div className="container">
                    <div className="text-area" data-aos="fade-up">
                        <span className="badge">Mind Map Visualization</span>
                        <h2>복잡한 생각의 흐름을<br />한눈에 파악하세요.</h2>
                        <p>요약된 핵심 키워드를 중심으로 마인드맵을 생성합니다. <br />대화의 구조를 시각적으로 확인하고 아이디어를 확장해 보세요.</p>
                    </div>
                    <div className="image-area" data-aos="zoom-in">
                        [지능형 마인드맵 시각화 화면 이미지]
                    </div>
                </div>
            </section>

            <footer>
                <p>© 2026 AIgenda Lab | 졸업 프로젝트</p>
            </footer>
        </div>
    );
}

export default Login;
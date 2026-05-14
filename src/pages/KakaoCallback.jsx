import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallback() {
    const navigate = useNavigate();
    // 화면이 렌더링 된 후 실행되는 코드
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const nickname = params.get('nickname');

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('nickname', nickname);
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#E8547A',
            fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        }}>
            🥐 로그인 중...
        </div>
    );
}
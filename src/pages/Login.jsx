import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = {
  bg: '#FFF8F2',
  header: '#FFFFFF',
  primary: '#C8854A',
  primaryLight: '#F5E6D8',
  primaryHover: '#A8673A',
  text: '#3D2B1F',
  textMuted: '#8C6E5A',
  border: '#EDD9C8',
  card: '#FFFFFF',
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    // 샘플: 로그인 성공 시 메인으로
    navigate('/');
  };

  const handleKakao = () => {
    // 샘플: 카카오 팝업 시뮬레이션
    const confirmed = window.confirm('카카오 로그인 팝업 (샘플)\n\n확인을 누르면 로그인됩니다.');
    if (confirmed) navigate('/');
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans KR', sans-serif" }}>

      {/* 카드 */}
      <div style={{
        backgroundColor: COLORS.card,
        borderRadius: '24px',
        border: `1px solid ${COLORS.border}`,
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
      }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥐</div>
          <div style={{ fontWeight: '700', fontSize: '24px', color: COLORS.primary }}>Pastry</div>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '4px' }}>달콤한 중고거래 플랫폼</div>
        </div>

        {/* 이메일 */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: COLORS.text, display: 'block', marginBottom: '6px' }}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
              fontSize: '14px', color: COLORS.text, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: COLORS.text, display: 'block', marginBottom: '6px' }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
              fontSize: '14px', color: COLORS.text, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div style={{ fontSize: '12px', color: '#E24B4A', marginBottom: '12px' }}>{error}</div>
        )}

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            backgroundColor: COLORS.primary, color: '#fff',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
            marginBottom: '12px',
          }}
        >
          로그인
        </button>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
          <span style={{ fontSize: '12px', color: COLORS.textMuted }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
        </div>

        {/* 카카오 로그인 */}
        <button
          onClick={handleKakao}
          style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            backgroundColor: '#FEE500', color: '#3D2B1F',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '18px' }}>💬</span>
          카카오로 로그인
        </button>

        {/* 회원가입 링크 */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: COLORS.textMuted }}>
          아직 계정이 없으신가요?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: COLORS.primary, fontWeight: '600', cursor: 'pointer' }}
          >
            회원가입
          </span>
        </div>

      </div>
    </div>
  );
}
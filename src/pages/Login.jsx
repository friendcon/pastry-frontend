import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const T = {
  bg:           '#FFF5F7',
  primary:      '#E8547A',
  primaryLight: '#FEEAEE',
  primaryDark:  '#C03060',
  text:         '#2D1520',
  textMuted:    '#9B6878',
  border:       '#F0D0DA',
  card:         '#FFFFFF',
  error:        '#E84040',
};

/* ── 눈 아이콘 (비번 토글) ── */
function EyeIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      )}
    </svg>
  );
}

/* ── 인풋 컴포넌트 ── */
function Input({ label, type, value, onChange, placeholder, rightSlot, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: error ? '6px' : '14px' }}>
      <label style={{
        fontSize: '12.5px', fontWeight: '700',
        color: focused ? T.primary : T.textMuted,
        display: 'block', marginBottom: '6px',
        transition: 'color 0.15s', letterSpacing: '0.02em',
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1.5px solid ${error ? T.error : focused ? T.primary : T.border}`,
        borderRadius: '12px', background: T.bg,
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: focused ? `0 0 0 3px ${T.primary}18` : 'none',
        overflow: 'hidden',
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: '12px 16px', fontSize: '14px', color: T.text,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        {rightSlot && (
          <div style={{ padding: '0 12px', color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <div style={{ fontSize: '12px', color: T.error, marginTop: '5px', paddingLeft: '2px' }}>{error}</div>
      )}
    </div>
  );
}

/* ── 로그인 페이지 (메인 컴포넌트) ── */
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email)    e.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = '올바른 이메일 형식이 아니에요.';
    if (!password) e.password = '비밀번호를 입력해주세요.';
    return e;
  };

  const handleLogin = async () => {
    const e = validate(); 
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {email, password});
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('nickname', response.data.nickname);
      navigate('/'); // 로그인 후 홈 화면으로 이동
    } catch(error) {
      if(error.response?.status === 401) {
        setErrors({ password: '이메일 또는 비밀번호가 올바르지 않아요.' });
      } else {
        setErrors({ password: '로그인에 실패했어요. 다시 시도해주세요.' });
      }
    } finally {
      setLoading(false); // 성공이든 실패든 로딩을 끔
    }
  };

  const handleKakao = () => {
    window.location.href = 'http://localhost:8080/api/auth/kakao';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #FFF0F4 0%, #FFF5F7 50%, #FFE8EE 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    }}>

      {/* 카드 */}
      <div style={{
        background: T.card,
        borderRadius: '24px',
        border: `1px solid ${T.border}`,
        padding: '44px 40px 40px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 48px rgba(232,84,122,0.10), 0 2px 12px rgba(0,0,0,0.04)',
      }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            onClick={() => navigate('/')}
            style={{ fontSize: '36px', marginBottom: '10px', lineHeight: 1, cursor: 'pointer' }}
          >🥐</div>
          <div style={{ fontWeight: '800', fontSize: '22px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</div>
          <div style={{ fontSize: '13px', color: T.textMuted, marginTop: '5px' }}>달콤한 중고거래 플랫폼</div>
        </div>

        {/* 이메일 */}
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
          placeholder="이메일을 입력하세요"
          error={errors.email}
        />

        {/* 비밀번호 */}
        <Input
          label="비밀번호"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
          placeholder="비밀번호를 입력하세요"
          error={errors.password}
          rightSlot={
            <div onClick={() => setShowPw(s => !s)} style={{ color: showPw ? T.primary : T.textMuted, transition: 'color 0.15s' }}>
              <EyeIcon open={showPw} />
            </div>
          }
        />

        {/* 비밀번호 찾기 */}
        <div style={{ textAlign: 'right', marginTop: '-6px', marginBottom: '20px' }}>
          <span
            onClick={() => navigate('/forgot-password')}
            style={{ fontSize: '12.5px', color: T.textMuted, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = T.primary}
            onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
          >
            비밀번호 찾기
          </span>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: loading
              ? T.primaryLight
              : `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
            color: loading ? T.primary : '#fff',
            fontSize: '15px', fontWeight: '700',
            cursor: loading ? 'default' : 'pointer',
            marginBottom: '12px', transition: 'all 0.18s',
            boxShadow: loading ? 'none' : `0 4px 16px ${T.primary}40`,
            letterSpacing: '-0.2px',
          }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: T.border }} />
          <span style={{ fontSize: '12px', color: T.textMuted }}>또는</span>
          <div style={{ flex: 1, height: '1px', background: T.border }} />
        </div>

        {/* 카카오 로그인 */}
        <button
          onClick={handleKakao}
          disabled={kakaoLoading}
          style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: kakaoLoading ? '#F5D800' : '#FEE500',
            color: '#3C1E1E',
            fontSize: '15px', fontWeight: '700',
            cursor: kakaoLoading ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            marginBottom: '24px', transition: 'background 0.18s',
            boxShadow: '0 2px 8px rgba(254,229,0,0.4)',
          }}
          onMouseEnter={e => { if (!kakaoLoading) e.currentTarget.style.background = '#F5D800'; }}
          onMouseLeave={e => { if (!kakaoLoading) e.currentTarget.style.background = '#FEE500'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.636 5.08 4.126 6.51L5.2 21l4.56-2.97c.73.1 1.48.17 2.24.17 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
          </svg>
          {kakaoLoading ? '연결 중...' : '카카오로 로그인'}
        </button>

        {/* 회원가입 링크 */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: T.textMuted }}>
          아직 계정이 없으신가요?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: T.primary, fontWeight: '700', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            회원가입
          </span>
        </div>

      </div>
    </div>
  );
}
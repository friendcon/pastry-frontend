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

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
    fontSize: '14px', color: COLORS.text, outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '13px', fontWeight: '600', color: COLORS.text,
    display: 'block', marginBottom: '6px',
  };

  const handleSendCode = () => {
    if (!email) { setError('이메일을 입력해주세요.'); return; }
    setCodeSent(true);
    setError('');
    alert(`${email} 으로 인증코드를 발송했습니다! (샘플)`);
  };

  const handleVerifyCode = () => {
    if (!code) { setError('인증코드를 입력해주세요.'); return; }
    setStep(2);
    setError('');
  };

  const handleSignup = () => {
    if (!password) { setError('비밀번호를 입력해주세요.'); return; }
    if (password !== passwordCheck) { setError('비밀번호가 일치하지 않아요.'); return; }
    if (!nickname) { setError('닉네임을 입력해주세요.'); return; }
    navigate('/');
  };

  const handleKakao = () => {
    const confirmed = window.confirm('카카오 회원가입 팝업 (샘플)\n\n확인을 누르면 가입됩니다.');
    if (confirmed) navigate('/');
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div style={{
        backgroundColor: COLORS.card, borderRadius: '24px',
        border: `1px solid ${COLORS.border}`, padding: '48px 40px',
        width: '100%', maxWidth: '420px',
      }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥐</div>
          <div style={{ fontWeight: '700', fontSize: '24px', color: COLORS.primary }}>회원가입</div>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '4px' }}>Pastry와 함께 달콤한 거래를 시작해보세요</div>
        </div>

        {/* 스텝 인디케이터 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              width: s === step ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: s === step ? COLORS.primary : COLORS.border,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Step 1: 이메일 인증 */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>이메일</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={handleSendCode}
                  style={{
                    padding: '12px 16px', borderRadius: '12px', border: 'none',
                    backgroundColor: COLORS.primary, color: '#fff',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {codeSent ? '재발송' : '인증발송'}
                </button>
              </div>
            </div>

            {codeSent && (
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>인증코드</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="인증코드 6자리를 입력하세요"
                  style={inputStyle}
                />
              </div>
            )}

            {error && <div style={{ fontSize: '12px', color: '#E24B4A', marginBottom: '12px' }}>{error}</div>}

            <button
              onClick={handleVerifyCode}
              disabled={!codeSent}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                backgroundColor: codeSent ? COLORS.primary : COLORS.border,
                color: codeSent ? '#fff' : COLORS.textMuted,
                fontSize: '15px', fontWeight: '600', cursor: codeSent ? 'pointer' : 'not-allowed',
                marginBottom: '12px',
              }}
            >
              다음
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
              <span style={{ fontSize: '12px', color: COLORS.textMuted }}>또는</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
            </div>

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
              카카오로 시작하기
            </button>
          </>
        )}

        {/* Step 2: 비밀번호 + 닉네임 */}
        {step === 2 && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>비밀번호 확인</label>
              <input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                style={inputStyle}
              />
            </div>

            {error && <div style={{ fontSize: '12px', color: '#E24B4A', marginBottom: '12px' }}>{error}</div>}

            <button
              onClick={handleSignup}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                backgroundColor: COLORS.primary, color: '#fff',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              가입 완료
            </button>

            <div style={{ textAlign: 'center' }}>
              <span
                onClick={() => setStep(1)}
                style={{ fontSize: '13px', color: COLORS.textMuted, cursor: 'pointer' }}
              >
                ← 이전으로
              </span>
            </div>
          </>
        )}

        {/* 로그인 링크 */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: COLORS.textMuted, marginTop: '16px' }}>
          이미 계정이 있으신가요?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: COLORS.primary, fontWeight: '600', cursor: 'pointer' }}
          >
            로그인
          </span>
        </div>

      </div>
    </div>
  );
}
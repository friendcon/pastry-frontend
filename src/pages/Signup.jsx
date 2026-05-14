import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailCode, verifyEmailCode, signup } from '../api/auth';

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
  success:      '#3A7A20',
};

/* ── 눈 아이콘 ── */
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

/* ── 체크 아이콘 ── */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── 스텝 인디케이터 ── */
function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '28px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: '6px',
          width: i + 1 === current ? '28px' : '8px',
          borderRadius: '3px',
          background: i + 1 <= current ? T.primary : T.border,
          transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
        }} />
      ))}
    </div>
  );
}

/* ── 비밀번호 강도 표시 ── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const hasLen  = password.length >= 8;
  const hasNum  = /\d/.test(password);
  const hasSpec = /[!@#$%^&*]/.test(password);
  const score   = [hasLen, hasNum, hasSpec].filter(Boolean).length;
  const labels  = ['', '약함', '보통', '강함'];
  const colors  = ['', T.error, '#F5A623', T.success];
  return (
    <div style={{ marginBottom: '14px', marginTop: '-6px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: '3px', borderRadius: '2px',
            background: i <= score ? colors[score] : T.border,
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: '11.5px', color: colors[score] }}>{labels[score]}</div>
    </div>
  );
}

/* ── 공통 인풋 컴포넌트 ── */
function Input({ label, type, value, onChange, placeholder, rightSlot, error, success }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? T.error : success ? T.success : focused ? T.primary : T.border;
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
        border: `1.5px solid ${borderColor}`,
        borderRadius: '12px', background: T.bg,
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: focused ? `0 0 0 3px ${T.primary}18` : 'none',
        overflow: 'hidden',
      }}>
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: '12px 16px', fontSize: '14px', color: T.text,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        {rightSlot && (
          <div style={{ padding: '0 12px', color: T.textMuted, display: 'flex', alignItems: 'center' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && <div style={{ fontSize: '12px', color: T.error, marginTop: '5px', paddingLeft: '2px' }}>{error}</div>}
      {success && !error && (
        <div style={{ fontSize: '12px', color: T.success, marginTop: '5px', paddingLeft: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckIcon />{success}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   회원가입 페이지 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep]               = useState(1);
  const [email, setEmail]             = useState('');
  const [code, setCode]               = useState('');
  const [password, setPassword]       = useState('');
  const [passwordCheck, setPwCheck]   = useState('');
  const [nickname, setNickname]       = useState('');
  const [errors, setErrors]           = useState({});
  const [codeSent, setCodeSent]       = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [showPw, setShowPw]           = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  const [loading, setLoading]         = useState(false);

  // 이메일 전송
  const handleSendCode = async () => {
    if (!email) { setErrors(p => ({ ...p, email: '이메일을 입력해주세요.' })); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrors(p => ({ ...p, email: '올바른 이메일 형식이 아니에요.' })); return; }
    setErrors(p => ({ ...p, email: '' }));
    setLoading(true);
    try {
      await sendEmailCode(email); // email code 요청
      setCodeSent(true); // code 발송여부 true로 변경
    } catch (err) {
      const msg = err.response?.data?.message || '인증코드 발송에 실패했어요. 다시 시도해주세요.';
      setErrors(p => ({ ...p, email: msg }));
    } finally {
      setLoading(false);
    }
  };

  // 인증코드 검증
  const handleVerifyCode = async () => {
    if (!code) { setErrors(p => ({ ...p, code: '인증코드를 입력해주세요.' })); return; }
    setLoading(true);
    try {
      await verifyEmailCode(email, code); // 이메일 코드 인증 api 호출
      setCodeVerified(true);
      setErrors(p => ({ ...p, code: '' }));
      setTimeout(() => setStep(2), 300); // api 인증 성공하면 스텝 인디케이터 2로 넘기고 3초 후 스텝 2로 넘어감
    } catch (err) {
      const msg = err.response?.data?.message || '인증코드가 올바르지 않아요.';
      setErrors(p => ({ ...p, code: msg }));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const e = {};
    if (!password) e.password = '비밀번호를 입력해주세요.';
    else if (password.length < 8) e.password = '8자 이상 입력해주세요.';
    if (password !== passwordCheck) e.passwordCheck = '비밀번호가 일치하지 않아요.';
    if (!nickname) e.nickname = '닉네임을 입력해주세요.';
    else if (nickname.length < 2) e.nickname = '2자 이상 입력해주세요.';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await signup(email, password, nickname);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || '회원가입에 실패했어요. 다시 시도해주세요.';
      setErrors(p => ({ ...p, nickname: msg }));
    } finally {
      setLoading(false);
    }
  };

  const handleKakao = () => {
    // TODO: 카카오 OAuth 처리로 교체
    const confirmed = window.confirm('카카오 회원가입 팝업 (샘플)');
    if (confirmed) navigate('/');
  };

  const pwMatch = passwordCheck && password === passwordCheck;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #FFF0F4 0%, #FFF5F7 50%, #FFE8EE 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    }}>
      <div style={{
        background: T.card, borderRadius: '24px',
        border: `1px solid ${T.border}`,
        padding: '44px 40px 40px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 48px rgba(232,84,122,0.10), 0 2px 12px rgba(0,0,0,0.04)',
      }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            onClick={() => navigate('/')}
            style={{ fontSize: '36px', marginBottom: '10px', lineHeight: 1, cursor: 'pointer' }}
          >🥐</div>
          <div style={{ fontWeight: '800', fontSize: '22px', color: T.primary, letterSpacing: '-0.8px' }}>회원가입</div>
          <div style={{ fontSize: '13px', color: T.textMuted, marginTop: '5px' }}>Pastry와 함께 달콤한 거래를 시작해보세요</div>
        </div>

        {/* 스텝 인디케이터 */}
        <StepIndicator current={step} total={2} />

        {/* ── STEP 1: 이메일 인증 ── */}
        {step === 1 && (
          <>
            {/* 이메일 + 인증발송 */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: T.textMuted, display: 'block', marginBottom: '6px', letterSpacing: '0.02em' }}>
                이메일
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  border: `1.5px solid ${errors.email ? T.error : T.border}`,
                  borderRadius: '12px', background: T.bg, overflow: 'hidden',
                }}>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                    placeholder="이메일을 입력하세요"
                    style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', fontSize: '14px', color: T.text, outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <button onClick={handleSendCode} disabled={loading} style={{
                  padding: '0 16px', borderRadius: '12px', border: 'none',
                  background: loading ? T.primaryLight : `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
                  color: loading ? T.primary : '#fff',
                  fontSize: '13px', fontWeight: '700',
                  cursor: loading ? 'default' : 'pointer',
                  whiteSpace: 'nowrap', boxShadow: loading ? 'none' : `0 4px 12px ${T.primary}40`,
                  transition: 'all 0.18s',
                }}>
                  {loading && !codeSent ? '발송 중...' : codeSent ? '재발송' : '인증발송'}
                </button>
              </div>
              {errors.email && <div style={{ fontSize: '12px', color: T.error, marginTop: '5px', paddingLeft: '2px' }}>{errors.email}</div>}
            </div>

            {/* 인증코드 */}
            {codeSent && (
              <Input
                label="인증코드"
                type="text" value={code}
                onChange={e => { setCode(e.target.value); setErrors(p => ({ ...p, code: '' })); }}
                placeholder="6자리 인증코드를 입력하세요"
                error={errors.code}
                success={codeVerified ? '인증 완료!' : ''}
              />
            )}

            {/* 다음 버튼 */}
            <button onClick={handleVerifyCode} disabled={!codeSent} style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
              background: codeSent
                ? `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`
                : T.border,
              color: codeSent ? '#fff' : T.textMuted,
              fontSize: '15px', fontWeight: '700',
              cursor: codeSent ? 'pointer' : 'not-allowed',
              marginBottom: '12px', transition: 'all 0.18s',
              boxShadow: codeSent ? `0 4px 16px ${T.primary}40` : 'none',
            }}>
              다음
            </button>

            {/* 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: T.border }} />
              <span style={{ fontSize: '12px', color: T.textMuted }}>또는</span>
              <div style={{ flex: 1, height: '1px', background: T.border }} />
            </div>

            {/* 카카오 */}
            <button onClick={handleKakao} style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
              background: '#FEE500', color: '#3C1E1E',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginBottom: '24px', transition: 'background 0.18s',
              boxShadow: '0 2px 8px rgba(254,229,0,0.4)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5D800'}
              onMouseLeave={e => e.currentTarget.style.background = '#FEE500'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.636 5.08 4.126 6.51L5.2 21l4.56-2.97c.73.1 1.48.17 2.24.17 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </button>
          </>
        )}

        {/* ── STEP 2: 비밀번호 + 닉네임 ── */}
        {step === 2 && (
          <>
            {/* 비밀번호 */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: T.textMuted, display: 'block', marginBottom: '6px', letterSpacing: '0.02em' }}>비밀번호</label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: `1.5px solid ${errors.password ? T.error : T.border}`,
                borderRadius: '12px', background: T.bg, overflow: 'hidden',
              }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  placeholder="8자 이상 입력하세요"
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', fontSize: '14px', color: T.text, outline: 'none', fontFamily: 'inherit' }}
                />
                <div onClick={() => setShowPw(s => !s)} style={{ padding: '0 12px', color: showPw ? T.primary : T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}>
                  <EyeIcon open={showPw} />
                </div>
              </div>
              {errors.password && <div style={{ fontSize: '12px', color: T.error, marginTop: '5px', paddingLeft: '2px' }}>{errors.password}</div>}
            </div>

            <PasswordStrength password={password} />

            {/* 비밀번호 확인 */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: T.textMuted, display: 'block', marginBottom: '6px', letterSpacing: '0.02em' }}>비밀번호 확인</label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: `1.5px solid ${errors.passwordCheck ? T.error : pwMatch ? T.success : T.border}`,
                borderRadius: '12px', background: T.bg, overflow: 'hidden',
              }}>
                <input
                  type={showPwCheck ? 'text' : 'password'} value={passwordCheck}
                  onChange={e => { setPwCheck(e.target.value); setErrors(p => ({ ...p, passwordCheck: '' })); }}
                  placeholder="비밀번호를 다시 입력하세요"
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', fontSize: '14px', color: T.text, outline: 'none', fontFamily: 'inherit' }}
                />
                <div onClick={() => setShowPwCheck(s => !s)} style={{ padding: '0 12px', color: showPwCheck ? T.primary : T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}>
                  <EyeIcon open={showPwCheck} />
                </div>
              </div>
              {errors.passwordCheck && <div style={{ fontSize: '12px', color: T.error, marginTop: '5px', paddingLeft: '2px' }}>{errors.passwordCheck}</div>}
              {pwMatch && !errors.passwordCheck && (
                <div style={{ fontSize: '12px', color: T.success, marginTop: '5px', paddingLeft: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckIcon />비밀번호가 일치해요!
                </div>
              )}
            </div>

            {/* 닉네임 */}
            <Input
              label="닉네임"
              type="text" value={nickname}
              onChange={e => { setNickname(e.target.value); setErrors(p => ({ ...p, nickname: '' })); }}
              placeholder="2자 이상 입력하세요"
              error={errors.nickname}
            />

            {/* 가입 완료 버튼 */}
            <button onClick={handleSignup} disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
              background: loading ? T.primaryLight : `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
              color: loading ? T.primary : '#fff',
              fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'default' : 'pointer',
              marginBottom: '16px', transition: 'all 0.18s',
              boxShadow: loading ? 'none' : `0 4px 16px ${T.primary}40`,
            }}>
              {loading ? '가입 중...' : '가입 완료'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span onClick={() => setStep(1)}
                style={{ fontSize: '13px', color: T.textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onMouseEnter={e => e.currentTarget.style.color = T.primary}
                onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
              >
                ← 이전으로
              </span>
            </div>
          </>
        )}

        {/* 로그인 링크 */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: T.textMuted, marginTop: '20px' }}>
          이미 계정이 있으신가요?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: T.primary, fontWeight: '700', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            로그인
          </span>
        </div>

      </div>
    </div>
  );
}

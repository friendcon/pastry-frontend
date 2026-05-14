import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


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
  errorBg:      '#FFF0F0',
};

const MAX_W = 680;
const wrap = { maxWidth: MAX_W, margin: '0 auto', padding: '0 20px' };

const categories = [
  { id: 1,  icon: 'fashion',   name: '패션/의류' },
  { id: 2,  icon: 'bag',       name: '가방/잡화' },
  { id: 3,  icon: 'watch',     name: '시계/쥬얼리' },
  { id: 4,  icon: 'digital',   name: '디지털/가전' },
  { id: 5,  icon: 'furniture', name: '가구/인테리어' },
  { id: 6,  icon: 'sports',    name: '스포츠/레저' },
  { id: 7,  icon: 'star',      name: '스타굿즈' },
  { id: 8,  icon: 'book',      name: '도서/티켓/음반' },
  { id: 9,  icon: 'game',      name: '게임/취미' },
  { id: 10, icon: 'gift',      name: '기프티콘/상품권' },
];

const CONDITIONS = [
  { id: 'new',      label: '새상품',      desc: '미개봉/미사용' },
  { id: 'like_new', label: '거의 새것',   desc: '사용감 거의 없음' },
  { id: 'good',     label: '사용감 있음', desc: '정상 사용 흔적' },
  { id: 'used',     label: '많이 사용함', desc: '기능은 이상 없음' },
];

const TRADE_TYPES = [
  { id: 'delivery', label: '택배 거래' },
  { id: 'direct',   label: '직거래' },
  { id: 'both',     label: '모두 가능' },
];

/* ── 카테고리 SVG 아이콘 ── */
function CatIcon({ type, color, size = 18 }) {
  const icons = {
    fashion:   <svg width={size} height={size} viewBox="0 0 32 32"><path d="M10 4l-6 6 4 2v14h16V12l4-2-6-6-3 3a3 3 0 0 1-6 0L10 4z" fill={color}/></svg>,
    bag:       <svg width={size} height={size} viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="16" rx="3" fill={color}/><path d="M11 12V10a5 5 0 0 1 10 0v2" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>,
    watch:     <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill={color}/><path d="M16 12v5l3 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>,
    digital:   <svg width={size} height={size} viewBox="0 0 32 32"><rect x="4" y="7" width="24" height="16" rx="2.5" fill={color}/><rect x="8" y="11" width="16" height="8" rx="1" fill="#fff" opacity=".4"/></svg>,
    furniture: <svg width={size} height={size} viewBox="0 0 32 32"><rect x="3" y="16" width="26" height="6" rx="2" fill={color}/><rect x="7" y="8" width="18" height="9" rx="2" fill={color} opacity=".7"/></svg>,
    sports:    <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill={color}/><path d="M8 10c2 1 4 5 8 6M24 10c-2 1-4 5-8 6" stroke="#fff" strokeWidth="2" fill="none"/></svg>,
    star:      <svg width={size} height={size} viewBox="0 0 32 32"><path d="M16 4l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" fill={color}/></svg>,
    book:      <svg width={size} height={size} viewBox="0 0 32 32"><path d="M5 6h14a2 2 0 0 1 2 2v18H7a2 2 0 0 1-2-2V6z" fill={color}/><line x1="9" y1="12" x2="15" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>,
    game:      <svg width={size} height={size} viewBox="0 0 32 32"><rect x="3" y="10" width="26" height="14" rx="5" fill={color}/><line x1="10" y1="17" x2="16" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><line x1="13" y1="14" x2="13" y2="20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="21" cy="15" r="1.5" fill="#fff"/><circle cx="24" cy="18" r="1.5" fill="#fff"/></svg>,
    gift:      <svg width={size} height={size} viewBox="0 0 32 32"><rect x="4" y="13" width="24" height="14" rx="2" fill={color}/><rect x="3" y="9" width="26" height="6" rx="2" fill={color} opacity=".7"/><path d="M16 9V27" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>,
  };
  return icons[type] || null;
}

/* ── 체크박스 ── */
function Checkbox({ checked, onChange, label }) {
  return (
    <div onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', userSelect: 'none' }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '6px',
        border: `2px solid ${checked ? T.primary : T.border}`,
        background: checked ? T.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: '13.5px', color: checked ? T.primary : T.textMuted, fontWeight: checked ? '700' : '400' }}>{label}</span>
    </div>
  );
}

/* ── 섹션 래퍼 ── */
function Section({ title, required, hint, children }) {
  return (
    <div style={{ background: T.card, borderRadius: '20px', border: `1px solid ${T.border}`, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: T.text }}>{title}</span>
        {required && <span style={{ fontSize: '12px', color: T.primary, fontWeight: '700' }}>*</span>}
        {hint && <span style={{ fontSize: '12px', color: T.textMuted, marginLeft: '4px' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── 인풋 ── */
function Input({ type = 'text', value, onChange, placeholder, maxLength, rightSlot, error, rows }) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    flex: 1, border: 'none', background: 'transparent',
    padding: '12px 16px', fontSize: '14px', color: T.text,
    outline: 'none', fontFamily: 'inherit', lineHeight: '1.6',
  };
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: rows ? 'flex-start' : 'center',
        border: `1.5px solid ${error ? T.error : focused ? T.primary : T.border}`,
        borderRadius: '12px', background: T.bg, overflow: 'hidden',
        boxShadow: focused ? `0 0 0 3px ${T.primary}18` : 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
      }}>
        {rows
          ? <textarea value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{ ...baseStyle, resize: 'none', height: `${rows * 24 + 24}px` }} />
          : <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={baseStyle} />
        }
        {rightSlot && (
          <div style={{ padding: '0 14px', color: T.textMuted, flexShrink: 0, alignSelf: 'center' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {maxLength && (
        <div style={{ textAlign: 'right', fontSize: '12px', color: T.textMuted, marginTop: '4px' }}>
          {value.length}/{maxLength}
        </div>
      )}
      {error && <div style={{ fontSize: '12px', color: T.error, marginTop: '5px' }}>{error}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   상품 등록 페이지 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function ProductRegister() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [images, setImages]         = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [condition, setCondition]   = useState(null);
  const [tradeType, setTradeType]   = useState('both');
  const [negotiable, setNegotiable] = useState(false);
  const [title, setTitle]           = useState('');
  const [price, setPrice]           = useState('');
  const [isFree, setIsFree]         = useState(false);
  const [description, setDescription] = useState('');
  const [errors, setErrors]         = useState({});

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...previews].slice(0, 5));
  };

  const handlePriceChange = e => {
    setPrice(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleSubmit = () => {
    const e = {};
    if (images.length === 0) e.images = '이미지를 1장 이상 업로드해주세요.';
    if (!selectedCat)        e.category = '카테고리를 선택해주세요.';
    if (!condition)          e.condition = '상품 상태를 선택해주세요.';
    if (!title.trim())       e.title = '상품명을 입력해주세요.';
    if (!isFree && !price)   e.price = '가격을 입력해주세요.';
    if (!description.trim()) e.description = '상품 설명을 입력해주세요.';
    if (Object.keys(e).length) { setErrors(e); return; }

    // TODO: 실제 API 호출로 교체
    // await registerProduct({ images, category: selectedCat, condition, tradeType, negotiable, title, price: isFree ? 0 : Number(price), description });
    navigate('/');
  };

  const hasError = Object.values(errors).some(Boolean);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ ...wrap, height: '60px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🥐</span>
            <span style={{ fontWeight: '800', fontSize: '19px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
          </div>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: '700', color: T.text }}>상품 등록</span>
          <button onClick={() => navigate(-1)}
            style={{ marginLeft: 'auto', padding: '7px 16px', borderRadius: '10px', border: `1.5px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: '13px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            뒤로가기
          </button>
        </div>
      </header>

      <div style={{ ...wrap, padding: '28px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ─── 이미지 업로드 ─── */}
          <Section title="상품 이미지" required hint="(최대 5장)">
            {errors.images && <div style={{ fontSize: '12px', color: T.error }}>{errors.images}</div>}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {images.length < 5 && (
                <div onClick={() => fileRef.current.click()}
                  style={{ width: '100px', height: '100px', borderRadius: '16px', border: `2px dashed ${errors.images ? T.error : T.border}`, background: T.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.background = T.primaryLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = errors.images ? T.error : T.border; e.currentTarget.style.background = T.bg; }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style={{ fontSize: '11px', color: T.textMuted, fontWeight: '600' }}>{images.length}/5</span>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              )}
              {images.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={src} alt="" style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover', border: `1.5px solid ${T.border}` }} />
                  {i === 0 && (
                    <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                      대표사진
                    </div>
                  )}
                  <button onClick={() => setImages(p => p.filter((_, j) => j !== i))}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '50%', background: T.primary, border: '2px solid #fff', color: '#fff', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: T.textMuted }}>첫 번째 사진이 대표 이미지로 사용돼요.</p>
          </Section>

          {/* ─── 카테고리 ─── */}
          <Section title="카테고리" required>
            {errors.category && <div style={{ fontSize: '12px', color: T.error, marginTop: '-4px' }}>{errors.category}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {categories.map(cat => {
                const sel = selectedCat === cat.id;
                return (
                  <div key={cat.id} onClick={() => { setSelectedCat(cat.id); setErrors(p => ({ ...p, category: '' })); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px 6px', borderRadius: '14px', cursor: 'pointer', background: sel ? T.primaryLight : T.bg, border: `1.5px solid ${sel ? T.primary : T.border}`, transition: 'all 0.18s cubic-bezier(.34,1.56,.64,1)', transform: sel ? 'translateY(-2px)' : 'translateY(0)', boxShadow: sel ? `0 4px 12px ${T.primary}25` : 'none' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: sel ? T.primary + '20' : '#FFF0F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CatIcon type={cat.icon} color={sel ? T.primary : T.primary + 'AA'} size={18} />
                    </div>
                    <span style={{ fontSize: '11px', color: sel ? T.primary : T.textMuted, fontWeight: sel ? '700' : '400', whiteSpace: 'nowrap', textAlign: 'center' }}>{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ─── 상품 상태 ─── */}
          <Section title="상품 상태" required>
            {errors.condition && <div style={{ fontSize: '12px', color: T.error, marginTop: '-4px' }}>{errors.condition}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {CONDITIONS.map(c => {
                const sel = condition === c.id;
                return (
                  <div key={c.id} onClick={() => { setCondition(c.id); setErrors(p => ({ ...p, condition: '' })); }}
                    style={{ padding: '12px 10px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', background: sel ? T.primaryLight : T.bg, border: `1.5px solid ${sel ? T.primary : T.border}`, transition: 'all 0.18s' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: sel ? T.primary : T.text, marginBottom: '3px' }}>{c.label}</div>
                    <div style={{ fontSize: '11px', color: T.textMuted }}>{c.desc}</div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ─── 상품명 ─── */}
          <Section title="상품명" required>
            <Input value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
              placeholder="상품명을 입력하세요" maxLength={40} error={errors.title} />
          </Section>

          {/* ─── 가격 ─── */}
          <Section title="가격" required>
            <Checkbox checked={isFree} onChange={() => { setIsFree(f => !f); setPrice(''); setErrors(p => ({ ...p, price: '' })); }} label="무료 나눔" />
            {!isFree && (
              <>
                <Input type="text"
                  value={price ? Number(price).toLocaleString() : ''}
                  onChange={handlePriceChange}
                  placeholder="가격을 입력하세요"
                  error={errors.price}
                  rightSlot={<span style={{ fontSize: '14px', fontWeight: '600' }}>원</span>}
                />
                <Checkbox checked={negotiable} onChange={() => setNegotiable(n => !n)} label="가격 협의 가능" />
              </>
            )}
          </Section>

          {/* ─── 거래 방식 ─── */}
          <Section title="거래 방식" required>
            <div style={{ display: 'flex', gap: '8px' }}>
              {TRADE_TYPES.map(t => {
                const sel = tradeType === t.id;
                return (
                  <button key={t.id} onClick={() => setTradeType(t.id)}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1.5px solid ${sel ? T.primary : T.border}`, background: sel ? T.primaryLight : T.bg, color: sel ? T.primary : T.textMuted, fontSize: '13.5px', fontWeight: sel ? '700' : '400', cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'inherit' }}>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ─── 상품 설명 ─── */}
          <Section title="상품 설명" required>
            <Input value={description}
              onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })); }}
              placeholder={'상품 상태, 구매 시기, 하자 여부 등을 자세히 적어주세요\n구매자가 궁금해할 정보를 미리 알려주면 빠른 거래에 도움이 돼요 🥐'}
              maxLength={500} rows={7} error={errors.description} />
          </Section>

          {/* ─── 에러 요약 ─── */}
          {hasError && (
            <div style={{ background: T.errorBg, border: `1px solid ${T.error}30`, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.error} strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '13.5px', color: T.error, fontWeight: '600' }}>입력하지 않은 항목이 있어요. 확인해주세요.</span>
            </div>
          )}

          {/* ─── 등록 버튼 ─── */}
          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`, color: '#fff', fontSize: '16px', fontWeight: '800', cursor: 'pointer', letterSpacing: '-0.3px', boxShadow: `0 6px 20px ${T.primary}40`, transition: 'all 0.18s', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            상품 등록하기
          </button>

        </div>
      </div>
    </div>
  );
}

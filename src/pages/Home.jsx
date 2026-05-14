import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
const T = {
  bg:           '#FFF5F7',
  headerBg:     '#FFFFFF',
  primary:      '#E8547A',
  primaryLight: '#FEEAEE',
  primaryDark:  '#C03060',
  text:         '#2D1520',
  textMuted:    '#9B6878',
  border:       '#F0D0DA',
  card:         '#FFFFFF',
  inputBg:      '#FFF5F7',
  bannerGrad:   'linear-gradient(130deg, #FFD6E2 0%, #FFBDD0 55%, #F5A8C0 100%)',
  bannerAccent: '#C03060',
  priceColor:   '#E8547A',
  badgeSale:    { bg: '#E8F5E0', color: '#3A7A20', border: '#C8E8A8' },
  badgeReserve: { bg: '#FFF0DC', color: '#A05E10', border: '#FCDBA0' },
  badgeAd:      { bg: '#E8EEFF', color: '#3040B0', border: '#B0C0F0' },
};

/* 콘텐츠 최대 너비 */
const MAX_W = 1200;
const wrap = { maxWidth: MAX_W, margin: '0 auto', width: '100%', padding: '0 24px' };

/* ─── 카테고리 데이터 ─── */
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

/* ─── 검색 자동완성 데이터 ─── */
const RECENT_KEYWORDS  = ['젤리캣 인형', '아이폰 15', '맥북'];
const POPULAR_KEYWORDS = ['스타굿즈', '다이슨', '레고'];
const ALL_SUGGESTIONS  = [
  '젤리캣 인형', '젤리캣 바슈', '아이폰 15', '아이폰 15 케이스',
  '나이키 에어맥스', '맥북 프로', '다이슨 드라이어', '레고 테크닉',
];

/* ══════════════════════════════════════════════
   SVG 아이콘 컴포넌트
══════════════════════════════════════════════ */
function Icon({ name, size = 18, color = 'currentColor', style: s }) {
  const p = {
    width: size, height: size,
    viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: '2.2',
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: s,
  };
  const icons = {
    search:       <svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    bell:         <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    chat:         <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    heart:        <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    heartFill:    <svg {...{ ...p, fill: color }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    clock:        <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    chevronRight: <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    chevronDown:  <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>,
    user:         <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    plus:         <svg {...{ ...p, strokeWidth: '2.5' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    sparkle:      <svg {...{ ...p, fill: color, stroke: 'none' }}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6z"/></svg>,
    arrowRight:   <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };
  return icons[name] || null;
}

/* ══════════════════════════════════════════════
   카테고리 SVG 아이콘
══════════════════════════════════════════════ */
function CatIcon({ type, color, size = 20 }) {
  const icons = {
    fashion:   <svg width={size} height={size} viewBox="0 0 32 32"><path d="M10 4l-6 6 4 2v14h16V12l4-2-6-6-3 3a3 3 0 0 1-6 0L10 4z" fill={color} opacity=".9"/></svg>,
    bag:       <svg width={size} height={size} viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="16" rx="3" fill={color} opacity=".9"/><path d="M11 12V10a5 5 0 0 1 10 0v2" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>,
    watch:     <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill={color} opacity=".9"/><path d="M13 8V5h6v3M13 24v3h6v-3" stroke={color} strokeWidth="2" fill="none"/><path d="M16 12v5l3 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>,
    digital:   <svg width={size} height={size} viewBox="0 0 32 32"><rect x="4" y="7" width="24" height="16" rx="2.5" fill={color} opacity=".9"/><path d="M11 28h10M16 23v5" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/><rect x="8" y="11" width="16" height="8" rx="1" fill="#fff" opacity=".4"/></svg>,
    furniture: <svg width={size} height={size} viewBox="0 0 32 32"><rect x="3" y="16" width="26" height="6" rx="2" fill={color} opacity=".9"/><rect x="7" y="8" width="18" height="9" rx="2" fill={color} opacity=".7"/><path d="M6 22v4M26 22v4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>,
    sports:    <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill={color} opacity=".9"/><path d="M8 10c2 1 4 5 8 6M24 10c-2 1-4 5-8 6M16 22c0-2 0-4 0-6" stroke="#fff" strokeWidth="2" fill="none"/></svg>,
    star:      <svg width={size} height={size} viewBox="0 0 32 32"><path d="M16 4l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" fill={color} opacity=".9"/></svg>,
    book:      <svg width={size} height={size} viewBox="0 0 32 32"><path d="M5 6h14a2 2 0 0 1 2 2v18H7a2 2 0 0 1-2-2V6z" fill={color} opacity=".9"/><line x1="9" y1="12" x2="15" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="16" x2="15" y2="16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    game:      <svg width={size} height={size} viewBox="0 0 32 32"><rect x="3" y="10" width="26" height="14" rx="5" fill={color} opacity=".9"/><line x1="10" y1="17" x2="16" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><line x1="13" y1="14" x2="13" y2="20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="21" cy="15" r="1.5" fill="#fff"/><circle cx="24" cy="18" r="1.5" fill="#fff"/></svg>,
    gift:      <svg width={size} height={size} viewBox="0 0 32 32"><rect x="4" y="13" width="24" height="14" rx="2" fill={color} opacity=".9"/><rect x="3" y="9" width="26" height="6" rx="2" fill={color} opacity=".7"/><path d="M16 9V27M10 9c0-3 3-4 4-2 1-2 5-1 5 2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>,
  };
  return icons[type] || null;
}

/* ══════════════════════════════════════════════
   검색바 컴포넌트
══════════════════════════════════════════════ */
function SearchBar() {
  const [val, setVal]   = useState('');
  const [open, setOpen] = useState(false);
  const filtered = ALL_SUGGESTIONS.filter(s => val && s.includes(val));

  return (
    <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: T.inputBg,
        border: `1.5px solid ${open ? T.primary : T.border}`,
        borderRadius: open ? '14px 14px 0 0' : '14px',
        padding: '0 14px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: open ? `0 0 0 3px ${T.primary}18` : 'none',
      }}>
        <Icon name="search" size={15} color={T.textMuted} />
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="어떤 물건을 찾고 계세요?"
          style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: '10px 4px', fontSize: '13.5px', color: T.text,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* 드롭다운 */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff',
          border: `1.5px solid ${T.border}`, borderTop: 'none',
          borderRadius: '0 0 14px 14px',
          boxShadow: '0 12px 32px rgba(200,80,120,0.1)', zIndex: 300,
        }}>
          {!val && (
            <>
              <div style={{ padding: '10px 14px 4px', fontSize: '11px', color: T.textMuted, fontWeight: '700', letterSpacing: '0.06em' }}>
                최근 검색어
              </div>
              {RECENT_KEYWORDS.map(k => (
                <div key={k} onMouseDown={() => setVal(k)}
                  style={{ padding: '9px 14px', fontSize: '13.5px', color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                  onMouseEnter={e => e.currentTarget.style.background = T.primaryLight}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon name="clock" size={13} color={T.textMuted} />{k}
                </div>
              ))}
              <div style={{ margin: '6px 14px', borderTop: `1px solid ${T.border}` }} />
              <div style={{ padding: '10px 14px 4px', fontSize: '11px', color: T.textMuted, fontWeight: '700', letterSpacing: '0.06em' }}>
                인기 검색어
              </div>
              {POPULAR_KEYWORDS.map((k, i) => (
                <div key={k} onMouseDown={() => setVal(k)}
                  style={{ padding: '9px 14px', fontSize: '13.5px', color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                  onMouseEnter={e => e.currentTarget.style.background = T.primaryLight}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '12px', color: T.primary, fontWeight: '700', minWidth: '14px' }}>{i + 1}</span>{k}
                </div>
              ))}
              <div style={{ height: '8px' }} />
            </>
          )}
          {val && filtered.map(item => (
            <div key={item} onMouseDown={() => setVal(item)}
              style={{ padding: '9px 14px', fontSize: '13.5px', color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              onMouseEnter={e => e.currentTarget.style.background = T.primaryLight}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="search" size={13} color={T.textMuted} />{item}
            </div>
          ))}
          {val && !filtered.length && (
            <div style={{ padding: '14px', textAlign: 'center', fontSize: '13px', color: T.textMuted }}>
              <span style={{ color: T.primary, fontWeight: '600' }}>"{val}"</span> 검색하기
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   프로필 칩 + 드롭다운 (로그인 후)
   Props: nickname, initial — 실제 사용자 데이터로 교체하세요
══════════════════════════════════════════════ */
function ProfileChip({ nickname = '홍길동', initial = '홍', onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItems = [
    { label: '내 프로필 보기', path: '/mypage' },
    { label: '판매 내역',      path: '/mypage/sales' },
    { label: '구매 내역',      path: '/mypage/purchases' },
    { label: '찜 목록',        path: '/mypage/wishlist' },
    { label: '설정',           path: '/settings' },
    null,
    { label: '로그아웃', danger: true, action: onLogout },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 12px 5px 5px', borderRadius: '24px',
          border: `1.5px solid ${open ? T.primary : T.border}`,
          background: open ? T.primaryLight : '#fff',
          cursor: 'pointer', transition: 'all 0.18s',
          boxShadow: open ? `0 0 0 3px ${T.primary}18` : 'none',
        }}
      >
        {/* 아바타 */}
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', color: '#fff', fontWeight: '800', flexShrink: 0,
        }}>
          {initial}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '600', color: T.text, whiteSpace: 'nowrap' }}>
          {nickname}
        </span>
        <Icon
          name="chevronDown" size={12} color={T.textMuted}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '-2px' }}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#fff', border: `1.5px solid ${T.border}`,
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(232,84,122,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          minWidth: '180px', overflow: 'hidden', zIndex: 500,
          animation: 'dropIn 0.18s cubic-bezier(.34,1.56,.64,1)',
        }}>
          {/* 프로필 요약 */}
          <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '17px', color: '#fff', fontWeight: '800',
              }}>
                {initial}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: T.text }}>{nickname}</div>
                <div style={{ fontSize: '11.5px', color: T.textMuted, marginTop: '1px' }}>@{nickname.toLowerCase()}</div>
              </div>
            </div>
          </div>
          {/* 메뉴 */}
          <div style={{ padding: '6px 0' }}>
            {menuItems.map((item, i) =>
              item === null
                ? <div key={i} style={{ margin: '4px 12px', borderTop: `1px solid ${T.border}` }} />
                : (
                  <button key={item.label}
                    onClick={() => { setOpen(false); item.action ? item.action() : navigate(item.path); }}
                    style={{
                      width: '100%', padding: '9px 16px',
                      display: 'flex', alignItems: 'center',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: '13.5px', color: item.danger ? '#E84040' : T.text,
                      fontFamily: 'inherit', fontWeight: '500', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#FFF0F0' : T.primaryLight}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.label}
                  </button>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   상품 카드
══════════════════════════════════════════════ */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(product.isWished ?? false);
  const [hov, setHov]       = useState(false);

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.card, borderRadius: '18px',
        border: `1px solid ${hov ? T.primary + '55' : T.border}`,
        overflow: 'hidden', cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hov ? `0 14px 36px ${T.primary}1A` : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
      }}
    >
      {/* 이미지 영역 */}
      <div style={{ position: 'relative', background: product.thumbnailBg ?? '#F5DDD6', height: '200px', overflow: 'hidden' }}>
        {product.thumbnail
          ? <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            /* 이미지 없을 때 플레이스홀더 */
            <>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.2) 22px, rgba(255,255,255,0.2) 23px)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)', fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.7 }}>
                  product<br />image
                </span>
              </div>
            </>
          )
        }

        {/* 뱃지 */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
          <span style={{
            padding: '3px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
            background: product.status === '예약중' ? T.badgeReserve.bg : T.badgeSale.bg,
            color:      product.status === '예약중' ? T.badgeReserve.color : T.badgeSale.color,
            border:    `1px solid ${product.status === '예약중' ? T.badgeReserve.border : T.badgeSale.border}`,
          }}>
            {product.status}
          </span>
          {product.isAd && (
            <span style={{ padding: '3px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: T.badgeAd.bg, color: T.badgeAd.color, border: `1px solid ${T.badgeAd.border}` }}>
              AD
            </span>
          )}
        </div>

        {/* 찜 버튼 */}
        <button
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          style={{
            position: 'absolute', bottom: '10px', right: '10px',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
            border: 'none', borderRadius: '50%',
            width: '34px', height: '34px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transform: wished ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1)',
          }}
        >
          <Icon name={wished ? 'heartFill' : 'heart'} size={15} color={wished ? T.primary : '#aaa'} />
        </button>
      </div>

      {/* 텍스트 정보 */}
      <div style={{ padding: '14px 14px 16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: T.text, marginBottom: '5px', letterSpacing: '-0.2px' }}>
          {product.title}
        </div>
        <div style={{ fontSize: '17px', fontWeight: '800', color: T.priceColor, letterSpacing: '-0.5px' }}>
          {Number(product.price).toLocaleString()}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>원</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
          <Icon name="heart" size={12} color={T.textMuted} />
          <span style={{ fontSize: '12px', color: T.textMuted, fontWeight: '500' }}>{product.wishCount}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   홈 페이지 (메인 컴포넌트)
   TODO: products, user 데이터를 API/props로 교체하세요
══════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const storedNickname = localStorage.getItem('nickname') || '사용자';
  const user = { nickname: storedNickname, initial: storedNickname[0] };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    setLoggedIn(false);
  };

  const [selectedCat, setSelectedCat] = useState(null);

  /* TODO: API 호출로 교체 */
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: 'Jellycat doll',
    price: 19000,
    status: i % 3 === 1 ? '예약중' : '판매중',
    isAd: i === 0,
    wishCount: Math.floor(Math.random() * 50) + 1,
    thumbnailBg: ['#F5DDD6','#D6E8F5','#E8F5D6','#F5EED6','#EDD6F5','#D6F5EE','#F5D6E8','#D6E0F5'][i],
  }));

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.headerBg, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ ...wrap, height: '64px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* 로고 */}
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0, marginRight: '8px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '26px' }}>🥐</span>
            <span style={{ fontWeight: '800', fontSize: '20px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
          </div>

          <SearchBar />

          {/* 우측 메뉴 */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => navigate('/notification')}
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              <Icon name="bell" size={17} color={T.textMuted} />
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', borderRadius: '50%', background: T.primary, border: '2px solid #fff' }} />
            </button>
            <button
              onClick={() => navigate('/chat')}
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              <Icon name="chat" size={17} color={T.textMuted} />
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', borderRadius: '50%', background: T.primary, border: '2px solid #fff' }} />
            </button>

            {loggedIn ? (
              <ProfileChip
                nickname={user.nickname}
                initial={user.initial}
                onLogout={handleLogout}
              />
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{ padding: '8px 18px', borderRadius: '10px', border: `1.5px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: '13px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon name="user" size={14} color={T.textMuted} /> 로그인
              </button>
            )}

            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '9px 20px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
                color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '700',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: `0 4px 16px ${T.primary}40`,
              }}
            >
              <Icon name="plus" size={14} color="#fff" /> 상품 등록
            </button>
          </div>
        </div>
      </header>

      {/* ─── BANNER ─── */}
      <div style={{ background: T.bg, padding: '20px 0 0' }}>
        <div style={{ ...wrap }}>
          <div style={{
            borderRadius: '24px',
            background: T.bannerGrad,
            height: '200px',
            display: 'flex', alignItems: 'center',
            padding: '0 48px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', right: '-30px', top: '-50px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: '100px', bottom: '-70px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.14)', pointerEvents: 'none' }} />
            {/* Emoji decoration */}
            <div style={{ position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '64px', filter: 'drop-shadow(0 4px 12px rgba(200,48,96,0.2))' }}>🍓</span>
              <span style={{ fontSize: '28px', opacity: 0.7 }}>🥐</span>
            </div>
            {/* Text content */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'left' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)',
                borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
              }}>
                <Icon name="sparkle" size={12} color={T.bannerAccent} />
                <span style={{ fontSize: '11px', fontWeight: '800', color: T.bannerAccent, letterSpacing: '0.12em' }}>SPRING DEAL</span>
              </div>
              <div style={{ fontSize: '27px', fontWeight: '800', color: '#2D1520', letterSpacing: '-1px', lineHeight: 1.25 }}>
                귀여운 것들의 거래,<br />Pastry에서 찾아봐요 🥐
              </div>
              <button style={{
                marginTop: '16px', padding: '9px 22px', borderRadius: '10px', border: 'none',
                background: T.primaryDark, color: '#fff', fontSize: '13px',
                fontWeight: '700', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                boxShadow: `0 4px 14px rgba(192,48,96,0.35)`,
              }}>
                지금 둘러보기 <Icon name="arrowRight" size={14} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 카테고리 ─── */}
      <div style={{ padding: '20px 0 4px' }}>
        <div style={{ ...wrap }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px', paddingBottom: '4px' }}>
            {categories.map(cat => {
              const sel = selectedCat === cat.id;
              return (
                <div key={cat.id}
                  onClick={() => setSelectedCat(sel ? null : cat.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '12px 8px', borderRadius: '18px', cursor: 'pointer',
                    background: sel ? T.primaryLight : T.card,
                    border: `1.5px solid ${sel ? T.primary : T.border}`,
                    gap: '8px',
                    transition: 'all 0.18s cubic-bezier(.34,1.56,.64,1)',
                    boxShadow: sel ? `0 4px 16px ${T.primary}28` : '0 1px 4px rgba(0,0,0,0.04)',
                    transform: sel ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: sel ? T.primary + '20' : '#FFF0F4', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s' }}>
                    <CatIcon type={cat.icon} color={sel ? T.primary : T.primary + 'CC'} size={20} />
                  </div>
                  <span style={{ fontSize: '11px', color: sel ? T.primary : T.textMuted, fontWeight: sel ? '700' : '400', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 상품 그리드 ─── */}
      <div style={{ padding: '20px 0 60px' }}>
        <div style={{ ...wrap }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: T.text, letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon name="sparkle" size={16} color={T.primary} />
              최근 올라온 상품
            </h2>
            <button
              onClick={() => navigate('/products')}
              style={{ fontSize: '13px', color: T.textMuted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}
            >
              더보기 <Icon name="chevronRight" size={14} color={T.textMuted} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* ─── 푸터 ─── */}
      <footer style={{ background: T.headerBg, borderTop: `1px solid ${T.border}` }}>
        <div style={{ ...wrap, padding: '36px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                <span style={{ fontSize: '22px' }}>🥐</span>
                <span style={{ fontWeight: '800', fontSize: '17px', color: T.primary }}>Pastry</span>
              </div>
              <p style={{ fontSize: '12.5px', color: T.textMuted, lineHeight: 1.9 }}>
                달콤한 중고거래 플랫폼<br />더 나은 거래 경험을 만들어갑니다
              </p>
            </div>
            <div style={{ display: 'flex', gap: '60px' }}>
              {[
                { title: '서비스',  links: ['이용약관', '개인정보처리방침', '공지사항'] },
                { title: '고객지원', links: ['자주 묻는 질문', '1:1 문의', '신고센터'] },
                { title: '회사',    links: ['회사 소개', '채용', '광고 문의'] },
              ].map(s => (
                <div key={s.title}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: T.text, marginBottom: '12px' }}>{s.title}</div>
                  {s.links.map(l => (
                    <div key={l} style={{ fontSize: '12.5px', color: T.textMuted, marginBottom: '8px', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.color = T.primary}
                      onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
                    >{l}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: T.textMuted }}>© 2026 Pastry. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '18px' }}>
              {['Instagram', 'X', 'YouTube'].map(s => (
                <span key={s} style={{ fontSize: '12px', color: T.textMuted, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = T.primary}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
                >{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

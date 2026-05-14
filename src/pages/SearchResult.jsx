import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const T = {
  bg:           '#FFF5F7',
  primary:      '#E8547A',
  primaryLight: '#FEEAEE',
  primaryDark:  '#C03060',
  text:         '#2D1520',
  textMuted:    '#9B6878',
  border:       '#F0D0DA',
  card:         '#FFFFFF',
  badgeSale:    { bg:'#E8F5E0', color:'#3A7A20', border:'#C8E8A8' },
  badgeReserve: { bg:'#FFF0DC', color:'#A05E10', border:'#FCDBA0' },
  badgeAd:      { bg:'#E8EEFF', color:'#3040B0', border:'#B0C0F0' },
};

const MAX_W = 1200;
const wrap = { maxWidth: MAX_W, margin: '0 auto', padding: '0 24px' };

const categories = [
  { id:1,  icon:'fashion',   name:'패션/의류' },
  { id:2,  icon:'bag',       name:'가방/잡화' },
  { id:3,  icon:'watch',     name:'시계/쥬얼리' },
  { id:4,  icon:'digital',   name:'디지털/가전' },
  { id:5,  icon:'furniture', name:'가구/인테리어' },
  { id:6,  icon:'sports',    name:'스포츠/레저' },
  { id:7,  icon:'star',      name:'스타굿즈' },
  { id:8,  icon:'book',      name:'도서/티켓/음반' },
  { id:9,  icon:'game',      name:'게임/취미' },
  { id:10, icon:'gift',      name:'기프티콘/상품권' },
];

/* ── 동적 가격 프리셋 계산 ── */
function calcPresets(min, max) {
  const range = max - min;
  let step;
  if (range <= 10000)       step = 2000;
  else if (range <= 50000)  step = 10000;
  else if (range <= 200000) step = 50000;
  else                       step = 100000;
  const presets = [];
  let cur = Math.ceil(min / step) * step;
  while (cur < max && presets.length < 4) {
    if (cur > min) presets.push(cur);
    cur += step;
  }
  presets.push(max);
  return [...new Set(presets)];
}
const fmt = n => n >= 10000 ? `${n / 10000}만원` : `${n.toLocaleString()}원`;

/* ── 아이콘 ── */
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const d = {
    search:    <svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    bell:      <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    chat:      <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    heart:     <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    heartFill: <svg {...{ ...p, fill: color }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    plus:      <svg {...{ ...p, strokeWidth: '2.5' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:         <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    refresh:   <svg {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  };
  return d[name] || null;
}

function CatIcon({ type, color, size = 18 }) {
  const i = {
    fashion:   <svg width={size} height={size} viewBox="0 0 32 32"><path d="M10 4l-6 6 4 2v14h16V12l4-2-6-6-3 3a3 3 0 0 1-6 0L10 4z" fill={color}/></svg>,
    bag:       <svg width={size} height={size} viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="16" rx="3" fill={color}/><path d="M11 12V10a5 5 0 0 1 10 0v2" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>,
    watch:     <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill={color}/><path d="M16 12v5l3 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>,
    digital:   <svg width={size} height={size} viewBox="0 0 32 32"><rect x="4" y="7" width="24" height="16" rx="2.5" fill={color}/><rect x="8" y="11" width="16" height="8" rx="1" fill="#fff" opacity=".4"/></svg>,
    furniture: <svg width={size} height={size} viewBox="0 0 32 32"><rect x="3" y="16" width="26" height="6" rx="2" fill={color}/><rect x="7" y="8" width="18" height="9" rx="2" fill={color} opacity=".7"/></svg>,
    sports:    <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill={color}/><path d="M8 10c2 1 4 5 8 6M24 10c-2 1-4 5-8 6" stroke="#fff" strokeWidth="2" fill="none"/></svg>,
    star:      <svg width={size} height={size} viewBox="0 0 32 32"><path d="M16 4l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" fill={color}/></svg>,
    book:      <svg width={size} height={size} viewBox="0 0 32 32"><path d="M5 6h14a2 2 0 0 1 2 2v18H7a2 2 0 0 1-2-2V6z" fill={color}/></svg>,
    game:      <svg width={size} height={size} viewBox="0 0 32 32"><rect x="3" y="10" width="26" height="14" rx="5" fill={color}/></svg>,
    gift:      <svg width={size} height={size} viewBox="0 0 32 32"><rect x="4" y="13" width="24" height="14" rx="2" fill={color}/><rect x="3" y="9" width="26" height="6" rx="2" fill={color} opacity=".7"/></svg>,
  };
  return i[type] || null;
}

/* ── 상품 카드 ── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(product.isWished ?? false);
  const [hov, setHov] = useState(false);
  const badge = product.status === '예약중' ? T.badgeReserve : T.badgeSale;
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: T.card, borderRadius: '16px', border: `1px solid ${hov ? T.primary + '55' : T.border}`, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hov ? `0 12px 28px ${T.primary}1A` : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)' }}
    >
      <div style={{ position: 'relative', background: product.thumbnailBg ?? '#F5DDD6', height: '180px', overflow: 'hidden' }}>
        {product.thumbnail
          ? <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.2) 22px, rgba(255,255,255,0.2) 23px)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)', fontFamily: 'monospace' }}>product image</span>
              </div>
            </>
          )
        }
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '4px' }}>
          <span style={{ padding: '3px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
            {product.status}
          </span>
          {product.isAd && (
            <span style={{ padding: '3px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: T.badgeAd.bg, color: T.badgeAd.color, border: `1px solid ${T.badgeAd.border}` }}>AD</span>
          )}
        </div>
        <button onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transform: wished ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1)' }}
        >
          <Icon name={wished ? 'heartFill' : 'heart'} size={14} color={wished ? T.primary : '#aaa'} />
        </button>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: '600', color: T.text, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '800', color: T.primary, letterSpacing: '-0.5px' }}>
          {Number(product.price).toLocaleString()}<span style={{ fontSize: '12px', fontWeight: '600' }}>원</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
          <Icon name="heart" size={11} color={T.textMuted} />
          <span style={{ fontSize: '11.5px', color: T.textMuted, fontWeight: '500' }}>{product.wishCount}</span>
        </div>
      </div>
    </div>
  );
}

/* ── 상단 카테고리 바 ── */
function CategoryBar({ filters, setFilters }) {
  const toggleCat = c => setFilters(f => ({ ...f, category: f.category === c ? null : c }));
  return (
    <div style={{ background: T.card, borderRadius: '18px', border: `1px solid ${T.border}`, padding: '14px 16px', marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
        {categories.map(c => {
          const sel = filters.category === c.id;
          return (
            <div key={c.id} onClick={() => toggleCat(c.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '8px 6px', borderRadius: '12px', cursor: 'pointer', background: sel ? T.primaryLight : 'transparent', border: `1.5px solid ${sel ? T.primary : 'transparent'}`, transition: 'all 0.18s cubic-bezier(.34,1.56,.64,1)', transform: sel ? 'translateY(-2px)' : 'translateY(0)' }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = '#FFF8FA'; }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: sel ? T.primary + '20' : '#FFF0F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CatIcon type={c.icon} color={sel ? T.primary : T.primary + 'AA'} size={18} />
              </div>
              <span style={{ fontSize: '11px', color: sel ? T.primary : T.textMuted, fontWeight: sel ? '700' : '400', whiteSpace: 'nowrap' }}>
                {c.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 사이드 필터 (가격 + 거래방식 + 판매중) ── */
function FilterGroup({ title, children }) {
  return (
    <div style={{ paddingBottom: '18px', borderBottom: `1px solid ${T.border}`, marginBottom: '18px' }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: T.text, marginBottom: '12px', letterSpacing: '-0.2px' }}>{title}</div>
      {children}
    </div>
  );
}

function SideFilter({ filters, setFilters, priceRange }) {
  const presets = useMemo(() => calcPresets(priceRange.min, priceRange.max), [priceRange]);
  const togglePrice = p => setFilters(f => ({ ...f, maxPrice: f.maxPrice === p ? null : p }));
  const toggleTrade = t => setFilters(f => ({ ...f, tradeType: f.tradeType === t ? null : t }));
  const reset = () => setFilters({ maxPrice: null, tradeType: null, category: null, onlyAvail: false });

  return (
    <aside style={{ width: '200px', flexShrink: 0, background: T.card, borderRadius: '18px', border: `1px solid ${T.border}`, padding: '20px', position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', fontWeight: '800', color: T.text }}>필터</div>
        <button onClick={reset}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, fontSize: '12px', fontFamily: 'inherit', padding: '4px 6px', borderRadius: '6px' }}
          onMouseEnter={e => e.currentTarget.style.color = T.primary}
          onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
          <Icon name="refresh" size={12} /> 초기화
        </button>
      </div>

      <FilterGroup title="가격대">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {presets.map(p => {
            const sel = filters.maxPrice === p;
            return (
              <button key={p} onClick={() => togglePrice(p)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${sel ? T.primary : T.border}`, background: sel ? T.primaryLight : 'transparent', color: sel ? T.primary : T.textMuted, fontSize: '12.5px', fontWeight: sel ? '700' : '400', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                {fmt(p)} 이하
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="거래 방식">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[{ id: 'delivery', label: '택배 거래' }, { id: 'direct', label: '직거래' }].map(t => {
            const sel = filters.tradeType === t.id;
            return (
              <button key={t.id} onClick={() => toggleTrade(t.id)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${sel ? T.primary : T.border}`, background: sel ? T.primaryLight : 'transparent', color: sel ? T.primary : T.textMuted, fontSize: '12.5px', fontWeight: sel ? '700' : '400', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <div onClick={() => setFilters(f => ({ ...f, onlyAvail: !f.onlyAvail }))}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 2px' }}>
        <span style={{ fontSize: '13px', color: filters.onlyAvail ? T.primary : T.text, fontWeight: '600' }}>판매중만 보기</span>
        <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: filters.onlyAvail ? T.primary : T.border, position: 'relative', transition: 'background 0.18s' }}>
          <div style={{ position: 'absolute', top: '3px', left: filters.onlyAvail ? '19px' : '3px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.18s' }} />
        </div>
      </div>
    </aside>
  );
}

/* ── 무결과 ── */
function EmptyState({ query, onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', background: T.card, borderRadius: '20px', border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: '56px', marginBottom: '16px', opacity: 0.5 }}>🥐</div>
      <div style={{ fontSize: '17px', fontWeight: '700', color: T.text, marginBottom: '8px' }}>
        <span style={{ color: T.primary }}>"{query}"</span>에 대한 검색 결과가 없어요
      </div>
      <div style={{ fontSize: '13.5px', color: T.textMuted, lineHeight: 1.7, marginBottom: '24px' }}>
        다른 키워드로 검색하거나, 필터를 변경해보세요.<br />
        원하는 상품이 나오면 알림을 받을 수도 있어요!
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={onReset}
          style={{ padding: '10px 18px', borderRadius: '10px', border: `1.5px solid ${T.border}`, background: T.card, color: T.textMuted, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          필터 초기화
        </button>
        <button style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: `0 4px 12px ${T.primary}30`, fontFamily: 'inherit' }}>
          <Icon name="bell" size={13} color="#fff" /> 알림 설정
        </button>
      </div>
    </div>
  );
}

/* ── 헤더 ── */
function Header({ searchValue, setSearchValue, onSearch }) {
  const navigate = useNavigate();
  return (
    <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ ...wrap, height: '64px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', flexShrink: 0, marginRight: '8px' }}>
          <span style={{ fontSize: '26px' }}>🥐</span>
          <span style={{ fontWeight: '800', fontSize: '20px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
        </div>
        <div style={{ flex: 1, maxWidth: '480px', display: 'flex', alignItems: 'center', gap: '8px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '14px', padding: '0 14px' }}>
          <Icon name="search" size={15} color={T.textMuted} />
          <input value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
            placeholder="어떤 물건을 찾고 계세요?"
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 4px', fontSize: '13.5px', color: T.text, outline: 'none', fontFamily: 'inherit' }}
          />
          {searchValue && (
            <span onClick={() => setSearchValue('')} style={{ cursor: 'pointer', color: T.textMuted, display: 'flex', alignItems: 'center' }}>
              <Icon name="x" size={13} color={T.textMuted} />
            </span>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <button onClick={() => navigate('/notification')}
            style={{ width: '38px', height: '38px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bell" size={17} color={T.textMuted} />
          </button>
          <button onClick={() => navigate('/chat')}
            style={{ width: '38px', height: '38px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chat" size={17} color={T.textMuted} />
          </button>
          <button onClick={() => navigate('/register')}
            style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 16px ${T.primary}40` }}>
            <Icon name="plus" size={14} color="#fff" /> 상품 등록
          </button>
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════
   검색 결과 페이지 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [searchValue, setSearchValue] = useState(initialQuery);
  const [filters, setFilters] = useState({ maxPrice: null, tradeType: null, category: null, onlyAvail: false });
  const [sort, setSort]       = useState('latest');

  /* TODO: 실제 API 응답으로 교체
     예) const { products, priceRange } = await searchProducts({
            q: searchValue,
            ...filters,
            sort,
          });
  */
  const products = [
    { id:1, title:'젤리캣 바슈풀 바니', price:19000, status:'판매중', isAd:true,  wishCount:41, thumbnailBg:'#F5DDD6' },
    { id:2, title:'젤리캣 캐릭 토끼',   price:23000, status:'예약중', isAd:false, wishCount:34, thumbnailBg:'#D6E8F5' },
    { id:3, title:'젤리캣 어미타 인형', price:15000, status:'판매중', isAd:false, wishCount:30, thumbnailBg:'#E8F5D6' },
    { id:4, title:'젤리캣 코끼리 미니', price:8500,  status:'판매중', isAd:false, wishCount:23, thumbnailBg:'#F5EED6' },
    { id:5, title:'젤리캣 양 인형',     price:12000, status:'예약중', isAd:false, wishCount:23, thumbnailBg:'#EDD6F5' },
    { id:6, title:'젤리캣 펭귄 라지',   price:35000, status:'판매중', isAd:false, wishCount:16, thumbnailBg:'#D6F5EE' },
    { id:7, title:'젤리캣 강아지',     price:18000, status:'판매중', isAd:false, wishCount:27, thumbnailBg:'#F5D6E8' },
    { id:8, title:'젤리캣 고양이',     price:22000, status:'판매중', isAd:false, wishCount:50, thumbnailBg:'#D6E0F5' },
    { id:9, title:'젤리캣 곰돌이',     price:11000, status:'판매중', isAd:false, wishCount:18, thumbnailBg:'#F5DDD6' },
  ];

  /* 가격 범위: 실제로는 API 응답에서 받아오세요 */
  const priceRange = useMemo(() => {
    const prices = products.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  /* 클라이언트 사이드 필터링 + 정렬 (실제로는 서버 사이드 권장) */
  const filtered = useMemo(() => {
    let r = [...products];
    if (filters.maxPrice)  r = r.filter(p => p.price <= filters.maxPrice);
    if (filters.onlyAvail) r = r.filter(p => p.status === '판매중');
    /* TODO: filters.category, filters.tradeType 필터링 추가 */
    if (sort === 'price_asc')  r.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') r.sort((a, b) => b.price - a.price);
    if (sort === 'wish')       r.sort((a, b) => b.wishCount - a.wishCount);
    return r;
  }, [filters, sort, products]);

  const handleSearch = () => {
    setSearchParams({ q: searchValue });
  };

  const handleResetFilters = () => {
    setFilters({ maxPrice: null, tradeType: null, category: null, onlyAvail: false });
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      <Header searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />

      <div style={{ ...wrap, padding: '24px 24px 60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: T.text, letterSpacing: '-0.8px' }}>
            <span style={{ color: T.primary }}>"{initialQuery || searchValue}"</span> 검색 결과
          </h1>
          <p style={{ fontSize: '13px', color: T.textMuted, marginTop: '4px' }}>
            총 <span style={{ color: T.primary, fontWeight: '700' }}>{filtered.length}개</span> 상품
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CategoryBar filters={filters} setFilters={setFilters} />

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <SideFilter filters={filters} setFilters={setFilters} priceRange={priceRange} />

            <main style={{ flex: 1, minWidth: 0 }}>
              {/* 정렬 바 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: T.card, borderRadius: '10px', border: `1px solid ${T.border}`, padding: '3px' }}>
                  {[
                    { id: 'latest',     label: '최신순' },
                    { id: 'price_asc',  label: '가격↓' },
                    { id: 'price_desc', label: '가격↑' },
                    { id: 'wish',       label: '좋아요' },
                  ].map(s => (
                    <button key={s.id} onClick={() => setSort(s.id)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: sort === s.id ? T.primary : 'transparent', color: sort === s.id ? '#fff' : T.textMuted, fontSize: '12.5px', fontWeight: sort === s.id ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0
                ? <EmptyState query={initialQuery || searchValue} onReset={handleResetFilters} />
                : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                )
              }
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

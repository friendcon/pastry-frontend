import React, { useState } from 'react';
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
  badgeSale:    { bg:'#E8F5E0', color:'#3A7A20', border:'#C8E8A8' },
  badgeReserve: { bg:'#FFF0DC', color:'#A05E10', border:'#FCDBA0' },
  badgeDone:    { bg:'#EEEEEE', color:'#666',    border:'#DDD'    },
};

const TABS = [
  { id: 'sale',   label: '판매 내역' },
  { id: 'buy',    label: '구매 내역' },
  { id: 'wish',   label: '찜 목록'   },
  { id: 'review', label: '후기'      },
];

/* ── 아이콘 ── */
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const d = {
    bell:         <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    heart:        <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    edit:         <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    star:         <svg {...{ ...p, fill: color, stroke: 'none' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    coin:         <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9h4a2 2 0 0 1 0 4h-4M9 9v6M9 13h6"/></svg>,
    chevronRight: <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    plus:         <svg {...{ ...p, strokeWidth: '2.5' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    logout:       <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    userX:        <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>,
  };
  return d[name] || null;
}

/* ── 별점 ── */
function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} color={i < rating ? '#F5A623' : '#E0D0D6'} />
      ))}
    </div>
  );
}

const getStatusBadge = status => {
  if (status === '예약중')   return T.badgeReserve;
  if (status === '거래완료') return T.badgeDone;
  return T.badgeSale;
};

function StatusBadge({ status }) {
  const b = getStatusBadge(status);
  return (
    <span style={{ padding: '3px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
      {status}
    </span>
  );
}

/* ── 가로형 상품 카드 ── */
function ProductCard({ product, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: T.card, borderRadius: '16px', border: `1px solid ${hov ? T.primary + '55' : T.border}`, padding: '14px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer', boxShadow: hov ? `0 8px 20px ${T.primary}10` : 'none', transform: hov ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s' }}
    >
      <div style={{ position: 'relative', width: '84px', height: '84px', borderRadius: '12px', flexShrink: 0, background: product.thumbnailBg ?? '#F5DDD6', overflow: 'hidden' }}>
        {product.thumbnail
          ? <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,0.25) 14px, rgba(255,255,255,0.25) 15px)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'rgba(0,0,0,0.25)', fontFamily: 'monospace' }}>image</div>
            </>
          )
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14.5px', fontWeight: '600', color: T.text, marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '800', color: T.primary, marginBottom: '8px', letterSpacing: '-0.4px' }}>
          {Number(product.price).toLocaleString()}<span style={{ fontSize: '12px', fontWeight: '600' }}>원</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusBadge status={product.status} />
          <span style={{ fontSize: '12px', color: T.textMuted, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Icon name="heart" size={11} color={T.textMuted} /> {product.wishCount}
          </span>
        </div>
      </div>
      <Icon name="chevronRight" size={16} color={T.textMuted} />
    </div>
  );
}

/* ── 후기 카드 ── */
function ReviewCard({ review }) {
  return (
    <div style={{ background: T.card, borderRadius: '16px', border: `1px solid ${T.border}`, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '800' }}>
            {review.reviewer[0]}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13.5px', color: T.text }}>{review.reviewer}</div>
            <div style={{ marginTop: '2px' }}><Stars rating={review.rating} size={12} /></div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: T.textMuted }}>{review.date}</div>
      </div>
      <div style={{ fontSize: '14px', color: T.text, marginBottom: '10px', lineHeight: 1.6 }}>{review.content}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', background: T.bg, fontSize: '11.5px', color: T.textMuted, fontWeight: '500' }}>
        🥐 {review.productTitle}
      </div>
    </div>
  );
}

/* ── 무내역 ── */
function EmptyTab({ label, cta, onCtaClick }) {
  return (
    <div style={{ background: T.card, borderRadius: '16px', border: `1px dashed ${T.border}`, padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.4 }}>🥐</div>
      <div style={{ fontSize: '14px', color: T.textMuted, marginBottom: cta ? '16px' : 0 }}>{label}</div>
      {cta && (
        <button onClick={onCtaClick}
          style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: `0 4px 12px ${T.primary}30`, fontFamily: 'inherit' }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   마이페이지 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sale');

  /* TODO: 실제 API 호출로 교체 */
  const user = {
    nickname: '빵순이',
    email: 'bbangsuni@pastry.com',
    level: 3,
    rating: 4.8,
    reviewCount: 32,
    points: 12500,
    stats: { sale: 12, buy: 8, wish: 24, follower: 47 },
  };

  const saleProducts = [
    { id: 1, title: 'Jellycat 바슈 페이스트리', price: 19000,  status: '판매중',  wishCount: 24, thumbnailBg: '#F5DDD6' },
    { id: 2, title: '다이슨 드라이어',         price: 250000, status: '거래완료', wishCount: 8,  thumbnailBg: '#D6E8F5' },
    { id: 3, title: '레고 테크닉',            price: 45000,  status: '예약중',  wishCount: 5,  thumbnailBg: '#E8F5D6' },
  ];

  const buyProducts = [
    { id: 4, title: '아이폰 15 Pro', price: 850000,  status: '거래완료', wishCount: 12, thumbnailBg: '#EDD6F5' },
    { id: 5, title: '맥북 프로 M3',  price: 1800000, status: '거래완료', wishCount: 30, thumbnailBg: '#D6F5EE' },
  ];

  const wishProducts = [
    { id: 1, title: 'Jellycat 바슈 페이스트리', price: 19000, status: '판매중', wishCount: 24, thumbnailBg: '#F5DDD6' },
    { id: 6, title: '나이키 에어맥스',         price: 85000, status: '판매중', wishCount: 15, thumbnailBg: '#F5D6E8' },
    { id: 7, title: '스타굿즈 포토카드',       price: 5000,  status: '판매중', wishCount: 42, thumbnailBg: '#D6E0F5' },
  ];

  const reviews = [
    { id: 1, reviewer: '빵순이',  rating: 5, content: '친절하고 빠른 거래 감사해요!', date: '3일 전',  productTitle: 'Jellycat 바슈 페이스트리' },
    { id: 2, reviewer: '크루아상', rating: 4, content: '상품 상태 좋아요 👍',         date: '1주일 전', productTitle: '다이슨 드라이어' },
  ];

  const tabCounts = {
    sale:   saleProducts.length,
    buy:    buyProducts.length,
    wish:   wishProducts.length,
    review: reviews.length,
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠어요?')) navigate('/login');
  };

  const handleWithdraw = () => {
    if (window.confirm('정말 탈퇴하시겠어요?\n탈퇴 시 모든 데이터가 삭제됩니다.')) {
      // TODO: 회원 탈퇴 API 호출
      navigate('/login');
    }
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🥐</span>
            <span style={{ fontWeight: '800', fontSize: '19px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
          </div>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: '700', color: T.text }}>마이페이지</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button onClick={() => navigate('/notification')}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="bell" size={16} color={T.textMuted} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '24px 24px 60px' }}>

        {/* ─── 프로필 카드 ─── */}
        <div style={{ background: T.card, borderRadius: '20px', border: `1px solid ${T.border}`, padding: '24px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: '800', boxShadow: `0 6px 16px ${T.primary}40` }}>
              {user.nickname[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '19px', fontWeight: '800', color: T.text, letterSpacing: '-0.5px' }}>{user.nickname}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px', background: T.primaryLight, color: T.primaryDark, letterSpacing: '0.05em' }}>LV.{user.level}</span>
              </div>
              <div style={{ fontSize: '12.5px', color: T.textMuted, marginBottom: '6px' }}>{user.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Stars rating={Math.round(user.rating)} size={12} />
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: T.text }}>{user.rating}</span>
                <span style={{ fontSize: '12px', color: T.textMuted }}>(후기 {user.reviewCount}개)</span>
              </div>
            </div>
            <button onClick={() => navigate('/mypage/edit')}
              style={{ padding: '8px 14px', borderRadius: '10px', border: `1.5px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}
            >
              <Icon name="edit" size={12} color={T.textMuted} /> 프로필 수정
            </button>
          </div>

          {/* 통계 행 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingTop: '18px', borderTop: `1px solid ${T.border}` }}>
            {[
              { label: '판매',   value: user.stats.sale,     tab: 'sale' },
              { label: '구매',   value: user.stats.buy,      tab: 'buy' },
              { label: '찜',    value: user.stats.wish,     tab: 'wish' },
              { label: '팔로워', value: user.stats.follower, tab: null },
            ].map(s => (
              <div key={s.label}
                onClick={() => s.tab && setActiveTab(s.tab)}
                style={{ textAlign: 'center', padding: '4px 0', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = T.bg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: '18px', fontWeight: '800', color: T.text, letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: '11.5px', color: T.textMuted, marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 포인트 카드 ─── */}
        <div style={{ borderRadius: '20px', padding: '18px 24px', marginBottom: '24px', background: `linear-gradient(135deg, #FFDDE6 0%, #FFCDD8 100%)`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="coin" size={22} color={T.primaryDark} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: T.primaryDark, fontWeight: '700', letterSpacing: '0.05em' }}>보유 포인트</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: T.primaryDark, letterSpacing: '-0.6px', marginTop: '2px' }}>
                {user.points.toLocaleString()}<span style={{ fontSize: '14px', marginLeft: '2px' }}>P</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/mypage/points/charge')}
            style={{ position: 'relative', padding: '10px 20px', borderRadius: '12px', border: 'none', background: T.primaryDark, color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 14px rgba(192,48,96,0.35)', fontFamily: 'inherit' }}
          >
            <Icon name="plus" size={13} color="#fff" /> 충전하기
          </button>
        </div>

        {/* ─── 탭 ─── */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '18px', borderBottom: `1.5px solid ${T.border}` }}>
          {TABS.map(tab => {
            const sel = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: '12px 18px', background: 'transparent', border: 'none', borderBottom: `2.5px solid ${sel ? T.primary : 'transparent'}`, marginBottom: '-1.5px', color: sel ? T.primary : T.textMuted, fontSize: '14px', fontWeight: sel ? '700' : '500', cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}
              >
                {tab.label}
                <span style={{ fontSize: '12px', color: sel ? T.primary : T.textMuted, opacity: sel ? 1 : 0.6 }}>
                  {tabCounts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── 탭 컨텐츠 ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeTab === 'sale' && (
            saleProducts.length
              ? saleProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />)
              : <EmptyTab label="아직 판매한 상품이 없어요" cta="상품 등록하기" onCtaClick={() => navigate('/register')} />
          )}
          {activeTab === 'buy' && (
            buyProducts.length
              ? buyProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />)
              : <EmptyTab label="아직 구매한 상품이 없어요" />
          )}
          {activeTab === 'wish' && (
            wishProducts.length
              ? wishProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />)
              : <EmptyTab label="찜한 상품이 없어요" />
          )}
          {activeTab === 'review' && (
            reviews.length
              ? reviews.map(r => <ReviewCard key={r.id} review={r} />)
              : <EmptyTab label="아직 받은 후기가 없어요" />
          )}
        </div>

        {/* ─── 계정 설정 ─── */}
        <div style={{ marginTop: '40px', background: T.card, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, fontSize: '12.5px', fontWeight: '700', color: T.textMuted, letterSpacing: '0.05em' }}>
            계정 설정
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: T.text, fontSize: '13.5px', fontWeight: '500', fontFamily: 'inherit', borderBottom: `1px solid ${T.border}` }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="logout" size={15} color={T.textMuted} />
            <span style={{ flex: 1, textAlign: 'left' }}>로그아웃</span>
            <Icon name="chevronRight" size={14} color={T.textMuted} />
          </button>
          <button onClick={handleWithdraw}
            style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#E84040', fontSize: '13.5px', fontWeight: '500', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF0F0'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="userX" size={15} color="#E84040" />
            <span style={{ flex: 1, textAlign: 'left' }}>회원 탈퇴</span>
            <Icon name="chevronRight" size={14} color="#E84040" />
          </button>
        </div>
      </div>
    </div>
  );
}

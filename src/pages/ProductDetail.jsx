import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

/* ── 아이콘 ── */
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    heart:        <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    heartFill:    <svg {...{ ...p, fill: color }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    chat:         <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    bell:         <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    star:         <svg {...{ ...p, fill: color, stroke: 'none' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    flag:         <svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    arrowLeft:    <svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    share:        <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    plus:         <svg {...{ ...p, strokeWidth: '2.5' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  };
  return icons[name] || null;
}

/* ── 별점 ── */
function Stars({ rating, size = 11 }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} color={i < rating ? '#F5A623' : '#E0D0D6'} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   상품 상세 페이지 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentImage, setCurrentImage] = useState(0);
  const [wished, setWished] = useState(false);

  /* TODO: 실제 API 호출로 교체
     예) const { data: product } = useQuery(['product', id], () => fetchProduct(id)); */
  const product = {
    id,
    title: 'Jellycat 바슈 페이스트리 인형',
    price: 19000,
    status: '판매중',
    condition: '거의 새것',
    tradeType: '택배 거래',
    description: '젤리캣 바슈 페이스트리 인형입니다 🥐\n구매 후 한 번도 사용하지 않은 새 상품이에요.\n박스 포함 판매합니다.\n택배 거래 가능합니다!',
    wishCount: 24,
    viewCount: 142,
    chatCount: 7,
    daysAgo: 3,
    seller: { id: 1, nickname: '빵순이', rating: 4.8, reviewCount: 32, level: 3 },
    images: [
      { id: 1, bg: '#F5DDD6' }, // 실제로는 { url: '...' }
      { id: 2, bg: '#D6E8F5' },
      { id: 3, bg: '#E8F5D6' },
    ],
  };

  const handleReport = () => {
    if (window.confirm('이 상품을 신고하시겠어요?')) {
      // TODO: 신고 API 호출
      alert('신고가 접수되었습니다.');
    }
  };

  const handleChat = () => {
    // TODO: 채팅방 생성/이동 로직
    navigate(`/chat/new?productId=${product.id}&sellerId=${product.seller.id}`);
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🥐</span>
            <span style={{ fontWeight: '800', fontSize: '19px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
          </div>
          <button onClick={() => navigate(-1)}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: '10px', border: `1.5px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: '13px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}
          >
            <Icon name="arrowLeft" size={14} color={T.textMuted} /> 뒤로
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 24px 0' }}>

        {/* ─── 갤러리 (왼쪽 세로 썸네일 + 메인 이미지) ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* 썸네일 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {product.images.map((img, i) => (
              <div key={img.id} onClick={() => setCurrentImage(i)}
                style={{ width: '140px', height: '140px', borderRadius: '12px', background: img.bg, cursor: 'pointer', border: `2.5px solid ${currentImage === i ? T.primary : 'transparent'}`, transition: 'border 0.15s', overflow: 'hidden' }}
              >
                {img.url && <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
          {/* 메인 이미지 */}
          <div style={{ position: 'relative', background: product.images[currentImage].bg, height: '460px', borderRadius: '20px', overflow: 'hidden' }}>
            {product.images[currentImage].url
              ? <img src={product.images[currentImage].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (
                <>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(255,255,255,0.2) 28px, rgba(255,255,255,0.2) 29px)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgba(0,0,0,0.25)', fontFamily: 'monospace' }}>
                    product image
                  </div>
                </>
              )
            }
          </div>
        </div>

        {/* ─── 상품 정보 영역 (카드들) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '100px' }}>

          {/* 메타 정보 카드 (뱃지/제목/가격) */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: T.badgeSale.bg, color: T.badgeSale.color, border: `1px solid ${T.badgeSale.border}` }}>
                  {product.status}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: T.primaryLight, color: T.primary, border: `1px solid ${T.primary}30` }}>
                  {product.condition}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: T.bg, color: T.textMuted, border: `1px solid ${T.border}` }}>
                  {product.tradeType}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: T.textMuted }}>
                {product.daysAgo}일 전 · 조회 {product.viewCount}
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: T.text, letterSpacing: '-0.7px', lineHeight: 1.3 }}>
              {product.title}
            </div>
            <div style={{ fontSize: '34px', fontWeight: '800', color: T.primary, letterSpacing: '-1.2px' }}>
              {product.price.toLocaleString()}<span style={{ fontSize: '20px' }}>원</span>
            </div>
          </div>

          {/* 판매자 카드 */}
          <div onClick={() => navigate(`/users/${product.seller.id}`)}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = T.card}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' }}>
              {product.seller.nickname[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700' }}>{product.seller.nickname}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px', background: T.primaryLight, color: T.primaryDark }}>
                  LV.{product.seller.level}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                <Stars rating={Math.round(product.seller.rating)} size={11} />
                <span style={{ fontSize: '12px', color: T.textMuted }}>
                  {product.seller.rating} · 후기 {product.seller.reviewCount}개
                </span>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); navigate(`/users/${product.seller.id}`); }}
              style={{ padding: '7px 14px', borderRadius: '8px', border: `1.5px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              판매자 상점
            </button>
          </div>

          {/* 상품 설명 카드 */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: T.textMuted, letterSpacing: '0.05em', marginBottom: '12px' }}>
              상품 설명
            </div>
            <div style={{ fontSize: '14px', color: T.text, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {product.description}
            </div>
            <div onClick={handleReport}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px', paddingTop: '14px', borderTop: `1px solid ${T.border}`, fontSize: '12px', color: T.textMuted, cursor: 'pointer', width: 'fit-content' }}
              onMouseEnter={e => e.currentTarget.style.color = T.primary}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
            >
              <Icon name="flag" size={12} /> 이 상품 신고하기
            </div>
          </div>
        </div>
      </div>

      {/* ─── 하단 고정 CTA 바 ─── */}
      <div style={{ position: 'sticky', bottom: 0, background: T.card, borderTop: `1px solid ${T.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 -4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setWished(w => !w)}
            style={{ width: '52px', height: '52px', borderRadius: '12px', border: `1.5px solid ${wished ? T.primary : T.border}`, background: wished ? T.primaryLight : T.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', transform: wished ? 'scale(1.05)' : 'scale(1)' }}
          >
            <Icon name={wished ? 'heartFill' : 'heart'} size={20} color={wished ? T.primary : T.textMuted} />
          </button>
          <div style={{ flex: 1, paddingLeft: '6px' }}>
            <div style={{ fontSize: '11px', color: T.textMuted, fontWeight: '600' }}>판매가</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: T.primary, letterSpacing: '-0.5px' }}>
              {product.price.toLocaleString()}원
            </div>
          </div>
          <button onClick={handleChat}
            style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: `0 4px 14px ${T.primary}40`, fontFamily: 'inherit' }}
          >
            <Icon name="chat" size={16} color="#fff" /> 채팅으로 거래하기
          </button>
        </div>
      </div>
    </div>
  );
}

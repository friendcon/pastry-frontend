import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = {
  bg: '#FFF8F2',
  primary: '#C8854A',
  primaryLight: '#F5E6D8',
  primaryHover: '#A8673A',
  text: '#3D2B1F',
  textMuted: '#8C6E5A',
  border: '#EDD9C8',
  card: '#FFFFFF',
  badge: {
    판매중: { bg: '#D4EDD4', color: '#2E6E2E' },
    예약중: { bg: '#FFF3CD', color: '#856404' },
    AD: { bg: '#E8D5F5', color: '#5B2D8E' },
  }
};

const product = {
  id: 1,
  title: 'Jellycat 바슈 페이스트리 인형',
  price: 19000,
  status: '판매중',
  description: '젤리캣 바슈 페이스트리 인형입니다 🥐\n구매 후 한 번도 사용하지 않은 새 상품이에요.\n박스 포함 판매합니다.\n택배 거래 가능합니다!',
  wishCount: 24,
  daysAgo: 3,
  seller: { nickname: '빵순이', rating: 4.8, reviewCount: 32 },
  images: ['#F5E6D8', '#EDD9C8', '#FAF0E6'],
};

const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
  id: i + 10,
  title: 'Jellycat 인형',
  price: `${(i + 1) * 10000 + 9000}`,
  wishCount: Math.floor(Math.random() * 30) + 1,
  isAd: true,
}));

export default function ProductDetail() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [wished, setWished] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    if (window.confirm('이 상품을 신고하시겠어요?')) {
      setReported(true);
      alert('신고가 접수되었습니다.');
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: COLORS.text }}>

      {/* 헤더 */}
      <nav style={{
        backgroundColor: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
        padding: '12px 40px', display: 'flex', alignItems: 'center', gap: '16px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontSize: '28px' }}>🥐</span>
          <span style={{ fontWeight: '700', fontSize: '22px', color: COLORS.primary }}>Pastry</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginLeft: 'auto', padding: '8px 18px', borderRadius: '20px',
            border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent',
            color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer',
          }}
        >← 뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px' }}>

          {/* 이미지 슬라이더 */}
          <div>
            <div style={{
              backgroundColor: product.images[currentImage],
              borderRadius: '20px', height: '400px',
              border: `1px solid ${COLORS.border}`,
              marginBottom: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '80px' }}>🥐</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((color, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  style={{
                    width: '72px', height: '72px', borderRadius: '12px',
                    backgroundColor: color, cursor: 'pointer',
                    border: `2px solid ${currentImage === i ? COLORS.primary : COLORS.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🥐</span>
                </div>
              ))}
            </div>
          </div>

          {/* 상품 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* 상태 뱃지 + 날짜 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                backgroundColor: COLORS.badge[product.status].bg,
                color: COLORS.badge[product.status].color,
              }}>{product.status}</span>
              <span style={{ fontSize: '13px', color: COLORS.textMuted }}>{product.daysAgo}일 전</span>
            </div>

            {/* 제목 */}
            <div style={{ fontSize: '22px', fontWeight: '700', color: COLORS.text, lineHeight: '1.4' }}>
              {product.title}
            </div>

            {/* 가격 */}
            <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>
              {Number(product.price).toLocaleString()}원
            </div>

            {/* 찜 수 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px' }}>🧡</span>
              <span style={{ fontSize: '14px', color: COLORS.textMuted }}>관심 {product.wishCount}명</span>
            </div>

            {/* 구분선 */}
            <div style={{ height: '1px', backgroundColor: COLORS.border }} />

            {/* 판매자 정보 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px', borderRadius: '16px',
              backgroundColor: COLORS.primaryLight,
              border: `1px solid ${COLORS.border}`,
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: COLORS.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '20px', fontWeight: '700', flexShrink: 0,
              }}>
                {product.seller.nickname[0]}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{product.seller.nickname}</div>
                <div style={{ fontSize: '13px', color: COLORS.textMuted }}>
                  ⭐ {product.seller.rating} · 후기 {product.seller.reviewCount}개
                </div>
              </div>
            </div>

            {/* 상품 설명 */}
            <div style={{
              padding: '16px', borderRadius: '16px',
              backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`,
              fontSize: '14px', lineHeight: '1.8', color: COLORS.text,
              whiteSpace: 'pre-line',
            }}>
              {product.description}
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setWished(!wished)}
                style={{
                  padding: '14px', borderRadius: '14px',
                  border: `1.5px solid ${wished ? COLORS.primary : COLORS.border}`,
                  backgroundColor: wished ? COLORS.primaryLight : COLORS.card,
                  fontSize: '20px', cursor: 'pointer', flexShrink: 0,
                }}
              >
                {wished ? '🧡' : '🤍'}
              </button>
              <button style={{
                flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
                backgroundColor: COLORS.primary, color: '#fff',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              }}>
                💬 채팅하기
              </button>
            </div>

            {/* 신고하기 */}
            {!reported ? (
              <div
                onClick={handleReport}
                style={{ fontSize: '12px', color: COLORS.textMuted, cursor: 'pointer', textAlign: 'right', textDecoration: 'underline' }}
              >
                🚨 신고하기
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: COLORS.textMuted, textAlign: 'right' }}>신고 접수 완료</div>
            )}
          </div>
        </div>

        {/* 연관 상품 (광고) */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: COLORS.text, marginBottom: '16px' }}>
            🥐 연관 상품
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {relatedProducts.map((p) => (
              <div key={p.id} style={{
                backgroundColor: COLORS.card, borderRadius: '16px',
                border: `1px solid ${COLORS.border}`, overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ backgroundColor: COLORS.primaryLight, height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '40px' }}>🥐</span>
                  <span style={{
                    position: 'absolute', top: '8px', left: '8px',
                    padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                    backgroundColor: COLORS.badge.AD.bg, color: COLORS.badge.AD.color,
                  }}>AD</span>
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: COLORS.primary }}>{Number(p.price).toLocaleString()}원</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '4px' }}>🤍 {p.wishCount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
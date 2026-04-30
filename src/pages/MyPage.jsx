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
    거래완료: { bg: '#E8E8E8', color: '#666' },
  }
};

const TABS = ['판매 내역', '구매 내역', '찜 목록', '후기'];

const saleProducts = [
  { id: 1, title: 'Jellycat 바슈 페이스트리', price: 19000, status: '판매중', wishCount: 24 },
  { id: 2, title: '다이슨 드라이어', price: 250000, status: '거래완료', wishCount: 8 },
  { id: 3, title: '레고 테크닉', price: 45000, status: '예약중', wishCount: 5 },
];

const buyProducts = [
  { id: 4, title: '아이폰 15 Pro', price: 850000, status: '거래완료', wishCount: 12 },
  { id: 5, title: '맥북 프로 M3', price: 1800000, status: '거래완료', wishCount: 30 },
];

const wishProducts = [
  { id: 1, title: 'Jellycat 바슈 페이스트리', price: 19000, status: '판매중', wishCount: 24 },
  { id: 6, title: '나이키 에어맥스', price: 85000, status: '판매중', wishCount: 15 },
  { id: 7, title: '스타굿즈 포토카드', price: 5000, status: '판매중', wishCount: 42 },
];

const reviews = [
  { id: 1, reviewer: '빵순이', rating: 5, content: '친절하고 빠른 거래 감사해요!', date: '3일 전', productTitle: 'Jellycat 바슈 페이스트리' },
  { id: 2, reviewer: '크루아상', rating: 4, content: '상품 상태 좋아요 👍', date: '1주일 전', productTitle: '다이슨 드라이어' },
];

export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('판매 내역');

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠어요?')) navigate('/login');
  };

  const handleWithdraw = () => {
    if (window.confirm('정말 탈퇴하시겠어요?\n탈퇴 시 모든 데이터가 삭제됩니다.')) {
      alert('탈퇴가 완료되었습니다.');
      navigate('/login');
    }
  };

  const ProductCard = ({ product }) => (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        backgroundColor: COLORS.card, borderRadius: '16px',
        border: `1px solid ${COLORS.border}`, overflow: 'hidden',
        cursor: 'pointer', transition: 'transform 0.2s',
        display: 'flex', gap: '14px', padding: '14px', alignItems: 'center',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = COLORS.card}
    >
      <div style={{
        width: '72px', height: '72px', borderRadius: '12px', flexShrink: 0,
        backgroundColor: COLORS.primaryLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
      }}>🥐</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{product.title}</div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: COLORS.primary, marginBottom: '6px' }}>{product.price.toLocaleString()}원</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
            backgroundColor: COLORS.badge[product.status].bg, color: COLORS.badge[product.status].color,
          }}>{product.status}</span>
          <span style={{ fontSize: '12px', color: COLORS.textMuted }}>🤍 {product.wishCount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: COLORS.text }}>

      {/* 헤더 */}
      <nav style={{
        backgroundColor: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
        padding: '12px 40px', display: 'flex', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontSize: '28px' }}>🥐</span>
          <span style={{ fontWeight: '700', fontSize: '22px', color: COLORS.primary }}>Pastry</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '700' }}>마이페이지</div>
        <div style={{ marginLeft: 'auto' }} />
      </nav>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>

        {/* 프로필 카드 */}
        <div style={{
          backgroundColor: COLORS.card, borderRadius: '20px',
          border: `1px solid ${COLORS.border}`, padding: '28px',
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            backgroundColor: COLORS.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '28px', fontWeight: '700',
          }}>빵</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>빵순이</div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted, marginBottom: '8px' }}>bbangsuni@pastry.com</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {'⭐'.repeat(5).split('').map((s, i) => (
                <span key={i} style={{ fontSize: '14px' }}>⭐</span>
              ))}
              <span style={{ fontSize: '14px', fontWeight: '600', marginLeft: '4px' }}>4.8</span>
              <span style={{ fontSize: '13px', color: COLORS.textMuted }}>(후기 32개)</span>
            </div>
          </div>

          <button style={{
            padding: '8px 18px', borderRadius: '20px',
            border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent',
            color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer',
          }}>프로필 수정</button>
        </div>

        {/* 포인트 카드 */}
        <div style={{
          backgroundColor: COLORS.primaryLight, borderRadius: '20px',
          border: `1px solid ${COLORS.border}`, padding: '20px 28px',
          marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '4px' }}>보유 포인트</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>12,500P</div>
          </div>
          <button style={{
            padding: '10px 20px', borderRadius: '20px', border: 'none',
            backgroundColor: COLORS.primary, color: '#fff',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}>충전하기</button>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '9px 20px', borderRadius: '20px', cursor: 'pointer',
                fontSize: '14px', fontWeight: activeTab === tab ? '600' : '400',
                backgroundColor: activeTab === tab ? COLORS.primary : COLORS.card,
                border: `1.5px solid ${activeTab === tab ? COLORS.primary : COLORS.border}`,
                color: activeTab === tab ? '#fff' : COLORS.textMuted,
                transition: 'all 0.2s',
              }}
            >{tab}</button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* 판매 내역 */}
          {activeTab === '판매 내역' && (
            saleProducts.length > 0
              ? saleProducts.map(p => <ProductCard key={p.id} product={p} />)
              : <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.textMuted }}>판매 내역이 없어요</div>
          )}

          {/* 구매 내역 */}
          {activeTab === '구매 내역' && (
            buyProducts.length > 0
              ? buyProducts.map(p => <ProductCard key={p.id} product={p} />)
              : <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.textMuted }}>구매 내역이 없어요</div>
          )}

          {/* 찜 목록 */}
          {activeTab === '찜 목록' && (
            wishProducts.length > 0
              ? wishProducts.map(p => <ProductCard key={p.id} product={p} />)
              : <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.textMuted }}>찜한 상품이 없어요</div>
          )}

          {/* 후기 */}
          {activeTab === '후기' && (
            reviews.length > 0
              ? reviews.map(review => (
                <div key={review.id} style={{
                  backgroundColor: COLORS.card, borderRadius: '16px',
                  border: `1px solid ${COLORS.border}`, padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: COLORS.primary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '13px', fontWeight: '700',
                      }}>{review.reviewer[0]}</div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{review.reviewer}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{review.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ fontSize: '13px', color: i < review.rating ? '#FFC107' : '#E0E0E0' }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '14px', color: COLORS.text, marginBottom: '6px' }}>{review.content}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>🥐 {review.productTitle}</div>
                </div>
              ))
              : <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.textMuted }}>후기가 없어요</div>
          )}
        </div>

        {/* 로그아웃 / 탈퇴 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '40px', justifyContent: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 24px', borderRadius: '20px',
              border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent',
              color: COLORS.textMuted, fontSize: '14px', cursor: 'pointer',
            }}
          >로그아웃</button>
          <button
            onClick={handleWithdraw}
            style={{
              padding: '10px 24px', borderRadius: '20px',
              border: '1.5px solid #F0999B', backgroundColor: 'transparent',
              color: '#E24B4A', fontSize: '14px', cursor: 'pointer',
            }}
          >회원 탈퇴</button>
        </div>

      </div>
    </div>
  );
}
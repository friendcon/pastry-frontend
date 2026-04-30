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

const categories = [
  { id: 0, name: '전체' },
  { id: 1, icon: '👗', name: '패션/의류' },
  { id: 2, icon: '👜', name: '가방/신발/잡화' },
  { id: 3, icon: '⌚', name: '시계/쥬얼리' },
  { id: 4, icon: '📱', name: '디지털/가전' },
  { id: 5, icon: '🏠', name: '가구/인테리어' },
  { id: 6, icon: '⚽', name: '스포츠/레저' },
  { id: 7, icon: '⭐', name: '스타굿즈' },
  { id: 8, icon: '📚', name: '도서/티켓/음반' },
  { id: 9, icon: '🎮', name: '게임/취미' },
  { id: 10, icon: '🎁', name: '기프티콘/상품권' },
];

const SORT_OPTIONS = [
  { id: 'latest', label: '최신순' },
  { id: 'price_asc', label: '가격 낮은순' },
  { id: 'price_desc', label: '가격 높은순' },
  { id: 'wish', label: '좋아요순' },
];

const sampleProducts = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `젤리캣 인형 ${i + 1}호`,
  price: (i + 1) * 5000 + 9000,
  status: i % 4 === 1 ? '예약중' : '판매중',
  wishCount: Math.floor(Math.random() * 50) + 1,
  categoryId: (i % 10) + 1,
  isAd: i === 0,
}));

export default function SearchResult() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('젤리캣');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [wished, setWished] = useState({});

  const toggleWish = (id) => setWished(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredProducts = sampleProducts
    .filter(p => selectedCategory === 0 || p.categoryId === selectedCategory)
    .filter(p => !onlyAvailable || p.status === '판매중')
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'wish') return b.wishCount - a.wishCount;
      return b.id - a.id;
    });

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

        {/* 검색창 */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="어떤 물건을 찾고 계세요?"
            style={{
              width: '100%', padding: '10px 42px 10px 16px', borderRadius: '24px',
              border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
              fontSize: '14px', color: COLORS.text, outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted }}>🔍</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {['마이페이지', '로그아웃'].map(label => (
            <button key={label} style={{
              padding: '8px 18px', borderRadius: '20px', border: `1.5px solid ${COLORS.border}`,
              backgroundColor: 'transparent', color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer',
            }}>{label}</button>
          ))}
          <button style={{
            padding: '8px 20px', borderRadius: '20px', border: 'none',
            backgroundColor: COLORS.primary, color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '600',
          }}>상품 등록</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

        {/* 검색어 + 결과 수 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: COLORS.text }}>
            "<span style={{ color: COLORS.primary }}>{searchValue}</span>" 검색 결과
          </div>
          <div style={{ fontSize: '14px', color: COLORS.textMuted, marginTop: '6px' }}>
            총 {filteredProducts.length}개의 상품
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '16px', paddingBottom: '4px', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap',
                fontSize: '13px', fontWeight: selectedCategory === cat.id ? '600' : '400',
                backgroundColor: selectedCategory === cat.id ? COLORS.primaryLight : COLORS.card,
                border: `1.5px solid ${selectedCategory === cat.id ? COLORS.primary : COLORS.border}`,
                color: selectedCategory === cat.id ? COLORS.primary : COLORS.textMuted,
                transition: 'all 0.2s',
              }}
            >
              {cat.icon && <span style={{ marginRight: '4px' }}>{cat.icon}</span>}
              {cat.name}
            </div>
          ))}
        </div>

        {/* 정렬 + 판매중 토글 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                style={{
                  padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: sortBy === opt.id ? '600' : '400',
                  backgroundColor: sortBy === opt.id ? COLORS.primary : COLORS.card,
                  border: `1.5px solid ${sortBy === opt.id ? COLORS.primary : COLORS.border}`,
                  color: sortBy === opt.id ? '#fff' : COLORS.textMuted,
                  transition: 'all 0.2s',
                }}
              >{opt.label}</button>
            ))}
          </div>

          {/* 판매중만 보기 토글 */}
          <div
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{
              width: '44px', height: '24px', borderRadius: '12px',
              backgroundColor: onlyAvailable ? COLORS.primary : COLORS.border,
              position: 'relative', transition: 'all 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: '3px',
                left: onlyAvailable ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: '#fff', transition: 'all 0.2s',
              }} />
            </div>
            <span style={{ fontSize: '13px', color: COLORS.textMuted, fontWeight: onlyAvailable ? '600' : '400' }}>판매중만 보기</span>
          </div>
        </div>

        {/* 상품 그리드 */}
        {filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  backgroundColor: COLORS.card, borderRadius: '16px',
                  border: `1px solid ${COLORS.border}`, overflow: 'hidden',
                  cursor: 'pointer', transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'relative', backgroundColor: COLORS.primaryLight, height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px' }}>🥐</span>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '4px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                      backgroundColor: COLORS.badge[product.status].bg, color: COLORS.badge[product.status].color,
                    }}>{product.status}</span>
                    {product.isAd && (
                      <span style={{
                        padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        backgroundColor: COLORS.badge.AD.bg, color: COLORS.badge.AD.color,
                      }}>AD</span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleWish(product.id); }}
                    style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                      width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >{wished[product.id] ? '🧡' : '🤍'}</button>
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{product.title}</div>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: COLORS.primary }}>{product.price.toLocaleString()}원</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <span style={{ fontSize: '13px' }}>🤍</span>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted }}>{product.wishCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 무결과 */
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥐</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>
              검색 결과가 없어요
            </div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted }}>
              다른 검색어나 카테고리로 찾아보세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
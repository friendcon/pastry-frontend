import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const categories = [
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

const products = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: 'Jellycat doll',
  price: '19,000',
  status: i % 3 === 1 ? '예약중' : '판매중',
  isAd: i === 0,
  wishCount: Math.floor(Math.random() * 50) + 1,
}));

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
  badge: {
    판매중: { bg: '#D4EDD4', color: '#2E6E2E' },
    예약중: { bg: '#FFF3CD', color: '#856404' },
    AD: { bg: '#E8D5F5', color: '#5B2D8E' },
  }
};

const RECENT_KEYWORDS = ['젤리캣 인형', '아이폰 15', '맥북'];
const POPULAR_KEYWORDS = ['스타굿즈', '다이슨', '레고'];
const ALL_SUGGESTIONS = [
  '젤리캣 인형', '젤리캣 바슈', '아이폰 15', '아이폰 15 케이스',
  '나이키 에어맥스', '맥북 프로', '다이슨 드라이어', '레고 테크닉',
];

export default function Home() {
  const navigate = useNavigate();
  const [wished, setWished] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleWish = (id) => setWished((prev) => ({ ...prev, [id]: !prev[id] }));
  const filtered = ALL_SUGGESTIONS.filter(s => searchValue && s.includes(searchValue));

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: COLORS.text, display: 'flex', flexDirection: 'column' }}>

      {/* 헤더 */}
      <nav style={{
        backgroundColor: COLORS.header,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '12px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <span style={{ fontSize: '28px' }}>🥐</span>
          <span style={{ fontWeight: '700', fontSize: '22px', color: COLORS.primary, letterSpacing: '-0.5px' }}>Pastry</span>
        </div>

        {/* 검색창 */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="어떤 물건을 찾고 계세요?"
            style={{
              width: '100%',
              padding: '10px 42px 10px 16px',
              borderRadius: showSuggestions ? '16px 16px 0 0' : '24px',
              border: `1.5px solid ${COLORS.border}`,
              backgroundColor: COLORS.bg,
              fontSize: '14px',
              color: COLORS.text,
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted, fontSize: '16px' }}>🔍</span>

          {/* 드롭다운 */}
          {showSuggestions && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              backgroundColor: COLORS.card,
              border: `1.5px solid ${COLORS.border}`,
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              zIndex: 200,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(200,133,74,0.1)',
            }}>
              {!searchValue && (
                <>
                  <div style={{ padding: '12px 16px 4px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '600' }}>최근 검색어</div>
                  {RECENT_KEYWORDS.map((keyword) => (
                    <div key={keyword}
                      onMouseDown={() => setSearchValue(keyword)}
                      style={{ padding: '10px 16px', fontSize: '14px', color: COLORS.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '13px' }}>🕐</span>{keyword}
                    </div>
                  ))}
                  <div style={{ margin: '4px 16px', borderTop: `1px solid ${COLORS.border}` }} />
                  <div style={{ padding: '12px 16px 4px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '600' }}>인기 검색어</div>
                  {POPULAR_KEYWORDS.map((keyword, i) => (
                    <div key={keyword}
                      onMouseDown={() => setSearchValue(keyword)}
                      style={{ padding: '10px 16px', fontSize: '14px', color: COLORS.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '13px', color: COLORS.primary, fontWeight: '700', minWidth: '16px' }}>{i + 1}</span>
                      {keyword}
                    </div>
                  ))}
                </>
              )}
              {searchValue && filtered.length > 0 && filtered.map((item) => (
                <div key={item}
                  onMouseDown={() => setSearchValue(item)}
                  style={{ padding: '10px 16px', fontSize: '14px', color: COLORS.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '13px' }}>🔍</span>{item}
                </div>
              ))}
              {searchValue && filtered.length === 0 && (
                <div style={{ padding: '16px', fontSize: '13px', color: COLORS.textMuted, textAlign: 'center' }}>
                  <span style={{ fontWeight: '600', color: COLORS.primary }}>"{searchValue}"</span> 검색하기
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* 알림 버튼 */}
          <button
            onClick={() => navigate('/notification')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: `1.5px solid ${COLORS.border}`,
              backgroundColor: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', position: 'relative',
            }}
          >
            🔔
            <span style={{
              position: 'absolute', top: '4px', right: '4px',
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: COLORS.primary,
            }} />
          </button>

          <button
            onClick={() => navigate('/chat')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: `1.5px solid ${COLORS.border}`,
              backgroundColor: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', position: 'relative',
            }}
          >
            💬
            <span style={{
              position: 'absolute', top: '4px', right: '4px',
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: COLORS.primary,
            }} />
          </button>

          {['마이페이지', '로그아웃'].map((label) => (
            <button key={label} style={{
              padding: '8px 18px', borderRadius: '20px',
              border: `1.5px solid ${COLORS.border}`,
              backgroundColor: 'transparent', color: COLORS.textMuted,
              fontSize: '13px', cursor: 'pointer', fontWeight: '500',
            }}>{label}</button>
          ))}
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '8px 20px', borderRadius: '20px', border: 'none',
              backgroundColor: COLORS.primary, color: '#fff',
              fontSize: '13px', cursor: 'pointer', fontWeight: '600',
            }}>
            상품 등록
          </button>
        </div>
      </nav>

      {/* 배너 */}
      <div style={{
        margin: '24px 40px', borderRadius: '16px',
        background: `linear-gradient(135deg, #F5E6D8 0%, #EDD9C8 100%)`,
        height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🥐</div>
          <div style={{ color: COLORS.primaryHover, fontWeight: '600', fontSize: '18px' }}>Pastry 광고 배너</div>
          <div style={{ color: COLORS.textMuted, fontSize: '13px', marginTop: '4px' }}>달콤한 중고거래를 시작해보세요</div>
        </div>
      </div>

      {/* 카테고리 가로스크롤 */}
      <div style={{ padding: '0 40px 24px' }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '14px 20px', borderRadius: '14px', cursor: 'pointer',
                  backgroundColor: isSelected ? COLORS.primaryLight : COLORS.card,
                  border: `1.5px solid ${isSelected ? COLORS.primary : COLORS.border}`,
                  transition: 'all 0.2s', gap: '8px', minWidth: '90px', flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '22px' }}>{cat.icon}</span>
                <span style={{ fontSize: '11px', color: isSelected ? COLORS.primary : COLORS.textMuted, fontWeight: isSelected ? '600' : '400', textAlign: 'center', lineHeight: '1.3', whiteSpace: 'nowrap' }}>{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div style={{ padding: '0 40px 60px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {products.map((product) => (
            <div key={product.id}
              style={{
                backgroundColor: COLORS.card, borderRadius: '16px',
                border: `1px solid ${COLORS.border}`, overflow: 'hidden',
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', backgroundColor: COLORS.primaryLight, height: '200px' }}>
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
                  onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
                  style={{
                    position: 'absolute', bottom: '10px', right: '10px',
                    background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                    width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >{wished[product.id] ? '🧡' : '🤍'}</button>
              </div>

              <div style={{ padding: '14px 14px 16px' }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text, marginBottom: '6px' }}>{product.title}</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: COLORS.primary }}>{product.price}원</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <span style={{ fontSize: '13px' }}>🤍</span>
                  <span style={{ fontSize: '13px', color: COLORS.textMuted }}>{product.wishCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <footer style={{ backgroundColor: COLORS.header, borderTop: `1px solid ${COLORS.border}`, padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '22px' }}>🥐</span>
              <span style={{ fontWeight: '700', fontSize: '18px', color: COLORS.primary }}>Pastry</span>
            </div>
            <div style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: '1.8' }}>
              달콤한 중고거래 플랫폼<br />더 나은 거래 경험을 만들어갑니다
            </div>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            {[
              { title: '서비스', links: ['이용약관', '개인정보처리방침', '공지사항'] },
              { title: '고객지원', links: ['자주 묻는 질문', '1:1 문의', '신고센터'] },
              { title: '회사', links: ['회사 소개', '채용', '광고 문의'] },
            ].map((section) => (
              <div key={section.title}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: COLORS.text, marginBottom: '12px' }}>{section.title}</div>
                {section.links.map((link) => (
                  <div key={link} style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '8px', cursor: 'pointer' }}>{link}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: COLORS.textMuted }}>© 2026 Pastry. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['인스타그램', '트위터', '유튜브'].map((sns) => (
              <span key={sns} style={{ fontSize: '12px', color: COLORS.textMuted, cursor: 'pointer' }}>{sns}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
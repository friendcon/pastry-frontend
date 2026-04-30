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
};

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

export default function ProductRegister() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
    fontSize: '14px', color: COLORS.text, outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '14px', fontWeight: '600', color: COLORS.text,
    display: 'block', marginBottom: '8px',
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...previews].slice(0, 5));
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPrice(value);
  };

  const handleSubmit = () => {
    if (images.length === 0) { setError('이미지를 1장 이상 업로드해주세요.'); return; }
    if (!selectedCategory) { setError('카테고리를 선택해주세요.'); return; }
    if (!title) { setError('상품명을 입력해주세요.'); return; }
    if (!price) { setError('가격을 입력해주세요.'); return; }
    if (!description) { setError('상품 설명을 입력해주세요.'); return; }
    navigate('/');
  };

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
        <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '700', color: COLORS.text }}>상품 등록</div>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginLeft: 'auto', padding: '8px 18px', borderRadius: '20px',
            border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent',
            color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer',
          }}
        >← 뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* 이미지 업로드 */}
          <div>
            <label style={labelStyle}>상품 이미지 <span style={{ color: COLORS.textMuted, fontWeight: '400' }}>(최대 5장)</span></label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

              {/* 업로드 버튼 */}
              {images.length < 5 && (
                <label style={{
                  width: '100px', height: '100px', borderRadius: '14px',
                  border: `2px dashed ${COLORS.border}`, backgroundColor: COLORS.card,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', gap: '4px',
                }}>
                  <span style={{ fontSize: '24px' }}>📷</span>
                  <span style={{ fontSize: '11px', color: COLORS.textMuted }}>{images.length}/5</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              )}

              {/* 이미지 미리보기 */}
              {images.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={src} alt="" style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover', border: `1px solid ${COLORS.border}` }} />
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
                      fontSize: '10px', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap',
                    }}>대표사진</div>
                  )}
                  <button
                    onClick={() => handleRemoveImage(i)}
                    style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      width: '22px', height: '22px', borderRadius: '50%',
                      backgroundColor: COLORS.primaryHover, border: 'none',
                      color: '#fff', fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label style={labelStyle}>카테고리</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 14px', borderRadius: '20px', cursor: 'pointer',
                    fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px',
                    backgroundColor: selectedCategory === cat.id ? COLORS.primaryLight : COLORS.card,
                    border: `1.5px solid ${selectedCategory === cat.id ? COLORS.primary : COLORS.border}`,
                    color: selectedCategory === cat.id ? COLORS.primary : COLORS.textMuted,
                    fontWeight: selectedCategory === cat.id ? '600' : '400',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{cat.icon}</span>
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          {/* 상품명 */}
          <div>
            <label style={labelStyle}>상품명</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="상품명을 입력하세요"
              style={inputStyle}
              maxLength={40}
            />
            <div style={{ textAlign: 'right', fontSize: '12px', color: COLORS.textMuted, marginTop: '4px' }}>{title.length}/40</div>
          </div>

          {/* 가격 */}
          <div>
            <label style={labelStyle}>가격</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={price ? Number(price).toLocaleString() : ''}
                onChange={handlePriceChange}
                placeholder="가격을 입력하세요"
                style={{ ...inputStyle, paddingRight: '32px' }}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: COLORS.textMuted }}>원</span>
            </div>
          </div>

          {/* 상품 설명 */}
          <div>
            <label style={labelStyle}>상품 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품 상태, 구매 시기, 하자 여부 등을 자세히 적어주세요"
              style={{ ...inputStyle, height: '160px', resize: 'none', lineHeight: '1.6' }}
              maxLength={500}
            />
            <div style={{ textAlign: 'right', fontSize: '12px', color: COLORS.textMuted, marginTop: '4px' }}>{description.length}/500</div>
          </div>

          {/* 에러 */}
          {error && (
            <div style={{ fontSize: '13px', color: '#E24B4A', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FCEBEB' }}>
              {error}
            </div>
          )}

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
              backgroundColor: COLORS.primary, color: '#fff',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            }}
          >
            상품 등록하기
          </button>

        </div>
      </div>
    </div>
  );
}
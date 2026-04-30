import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const initialMessages = [
  { id: 1, sender: 'other', message: '안녕하세요! 상품 아직 있나요?', time: '오후 2:30' },
  { id: 2, sender: 'me', message: '네 아직 있어요!', time: '오후 2:31' },
  { id: 3, sender: 'other', message: '가격 네고 가능한가요?', time: '오후 2:31' },
  { id: 4, sender: 'me', message: '조금은 가능해요 😊 얼마 생각하세요?', time: '오후 2:32' },
  { id: 5, sender: 'other', message: '17,000원에 가능할까요?', time: '오후 2:33' },
  { id: 6, sender: 'me', message: '18,000원이면 가능해요!', time: '오후 2:34' },
  { id: 7, sender: 'other', message: '네 좋아요! 직거래 가능하신가요?', time: '오후 2:35' },
];

const product = {
  title: 'Jellycat 바슈 페이스트리 인형',
  price: 19000,
  status: '판매중',
};

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [status, setStatus] = useState(product.status);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'me',
      message: input,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeaveChat = () => {
    if (window.confirm('채팅방을 나가시겠어요?')) navigate('/chat');
  };

  const STATUS_OPTIONS = ['판매중', '예약중', '거래완료'];
  const STATUS_COLORS = {
    판매중: { bg: '#D4EDD4', color: '#2E6E2E' },
    예약중: { bg: '#FFF3CD', color: '#856404' },
    거래완료: { bg: '#E8E8E8', color: '#666' },
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Noto Sans KR', sans-serif", color: COLORS.text }}>

      {/* 헤더 */}
      <nav style={{
        backgroundColor: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/chat')}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: COLORS.text }}
        >←</button>

        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          backgroundColor: COLORS.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '16px', fontWeight: '700', flexShrink: 0,
        }}>빵</div>

        <div style={{ fontWeight: '600', fontSize: '16px' }}>빵순이</div>

        {/* 더보기 메뉴 */}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: COLORS.textMuted }}
          >⋯</button>
          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '100%',
              backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: '12px', overflow: 'hidden', zIndex: 100,
              minWidth: '140px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div
                onClick={handleLeaveChat}
                style={{ padding: '12px 16px', fontSize: '14px', cursor: 'pointer', color: '#E24B4A' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FCEBEB'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >채팅방 나가기</div>
            </div>
          )}
        </div>
      </nav>

      {/* 상품 정보 바 */}
      <div style={{
        backgroundColor: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px',
          backgroundColor: COLORS.primaryLight, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
        }}>🥐</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{product.title}</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: COLORS.primary }}>{product.price.toLocaleString()}원</div>
        </div>

        {/* 거래상태 변경 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                padding: '5px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                border: `1.5px solid ${status === s ? STATUS_COLORS[s].color : COLORS.border}`,
                backgroundColor: status === s ? STATUS_COLORS[s].bg : 'transparent',
                color: status === s ? STATUS_COLORS[s].color : COLORS.textMuted,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '6px',
            }}
          >
            {/* 상대방 아바타 */}
            {msg.sender === 'other' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: COLORS.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '13px', fontWeight: '700',
              }}>빵</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start', gap: '3px' }}>
              <div style={{
                maxWidth: '280px', padding: '10px 14px', borderRadius: msg.sender === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: msg.sender === 'me' ? COLORS.primary : COLORS.card,
                color: msg.sender === 'me' ? '#fff' : COLORS.text,
                fontSize: '14px', lineHeight: '1.5',
                border: msg.sender === 'me' ? 'none' : `1px solid ${COLORS.border}`,
              }}>
                {msg.message}
              </div>
              <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
    <div style={{
    backgroundColor: COLORS.card, borderTop: `1px solid ${COLORS.border}`,
    padding: '12px 20px', display: 'flex', gap: '10px', alignItems: 'flex-end',
    flexShrink: 0,
    }}>
    {/* 이미지 업로드 버튼 */}
    <label style={{
        width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
        backgroundColor: COLORS.primaryLight, border: `1.5px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', cursor: 'pointer',
    }}>
        📷
        <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setMessages(prev => [...prev, {
            id: prev.length + 1,
            sender: 'me',
            message: null,
            image: url,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            }]);
        }}
        />
    </label>

    <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        rows={1}
        style={{
        flex: 1, padding: '10px 16px', borderRadius: '20px',
        border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
        fontSize: '14px', color: COLORS.text, outline: 'none',
        resize: 'none', lineHeight: '1.5', maxHeight: '100px', overflowY: 'auto',
        }}
    />
    <button
        onClick={handleSend}
        style={{
        width: '42px', height: '42px', borderRadius: '50%', border: 'none',
        backgroundColor: input.trim() ? COLORS.primary : COLORS.border,
        color: '#fff', fontSize: '18px', cursor: input.trim() ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', flexShrink: 0,
        }}
    >↑</button>
    </div>
    </div>
  );
}
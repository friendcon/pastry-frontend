import React, { useState, useRef, useEffect } from 'react';
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
  badgeDone:    { bg:'#EEEEEE', color:'#666',    border:'#DDD'    },
};

/* ── 아이콘 ── */
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    arrowLeft:   <svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    more:        <svg {...p}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
    image:       <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    send:        <svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    chevronDown: <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>,
    check:       <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    plus:        <svg {...{ ...p, strokeWidth: '2.5' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  };
  return icons[name] || null;
}

const getStatusBadge = s =>
  s === '예약중' ? T.badgeReserve :
  s === '거래완료' ? T.badgeDone :
  T.badgeSale;

/* ══════════════════════════════════════════════
   채팅방 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* TODO: 실제 API 호출로 교체 */
  const peer = { nickname: '빵순이', isOnline: true };
  const product = {
    id: 1,
    title: 'Jellycat 바슈 페이스트리 인형',
    price: 19000,
    status: '판매중',
    thumbnailBg: '#F5DDD6',
  };
  const initialMessages = [
    { id: 1, sender: 'other', message: '안녕하세요! 상품 아직 있나요?',         time: '오후 2:30', read: true },
    { id: 2, sender: 'me',    message: '네 아직 있어요!',                       time: '오후 2:31', read: true },
    { id: 3, sender: 'other', message: '가격 네고 가능한가요?',                  time: '오후 2:31', read: true },
    { id: 4, sender: 'me',    message: '조금은 가능해요 😊 얼마 생각하세요?',   time: '오후 2:32', read: true },
    { id: 5, sender: 'other', message: '17,000원에 가능할까요?',                 time: '오후 2:33', read: true },
    { id: 6, sender: 'me',    message: '18,000원이면 가능해요!',                 time: '오후 2:34', read: true },
    { id: 7, sender: 'other', message: '네 좋아요! 직거래 가능하신가요?',        time: '오후 2:35', read: false },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput]       = useState('');
  const [status, setStatus]     = useState(product.status);
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showActions, setShowActions]       = useState(false);

  const scrollRef = useRef(null);
  const menuRef   = useRef(null);
  const statusRef = useRef(null);

  /* 새 메시지 시 스크롤 하단으로 */
  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: 99999, behavior: 'smooth' });
  }, [messages]);

  /* 외부 클릭 시 메뉴 닫기 */
  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target))   setShowMenu(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    // TODO: 실제 채팅 전송 API 호출 (소켓 / REST)
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'me',
        message: input,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: 실제 이미지 업로드 API 호출
    const url = URL.createObjectURL(file);
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'me',
        message: null,
        image: url,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
    ]);
  };

  const handleLeaveChat = () => {
    if (window.confirm('채팅방을 나가시겠어요?')) navigate('/chat');
  };

  const STATUSES = ['판매중', '예약중', '거래완료'];

  /* 메시지 그룹화: 같은 sender 연속이면 아바타/시간 묶음 처리 */
  const groupedMessages = messages.map((msg, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const isFirst = !prev || prev.sender !== msg.sender;
    const isLast  = !next || next.sender !== msg.sender || next.time !== msg.time;
    return { ...msg, isFirst, isLast };
  });

  return (
    <div style={{ background: T.bg, height: '100vh', display: 'flex', flexDirection: 'column', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, position: 'relative', zIndex: 50 }}>
        <button onClick={() => navigate('/chat')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.background = T.bg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon name="arrowLeft" size={20} color={T.text} />
        </button>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: '800', flexShrink: 0, boxShadow: `0 4px 10px ${T.primary}30` }}>
          {peer.nickname[0]}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: T.text }}>{peer.nickname}</div>
          <div style={{ fontSize: '11px', color: T.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: peer.isOnline ? '#3A7A20' : T.textMuted }} />
            {peer.isOnline ? '접속 중' : '오프라인'}
          </div>
        </div>

        {/* 더보기 */}
        <div ref={menuRef} style={{ marginLeft: 'auto', position: 'relative' }}>
          <button onClick={() => setShowMenu(m => !m)}
            style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="more" size={18} color={T.textMuted} />
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', minWidth: '160px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200 }}>
              <button onClick={() => setShowMenu(false)}
                style={{ width: '100%', padding: '11px 16px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', background: 'transparent', border: 'none', color: T.text, fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = T.primaryLight}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                알림 끄기
              </button>
              <button onClick={() => setShowMenu(false)}
                style={{ width: '100%', padding: '11px 16px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', background: 'transparent', border: 'none', color: T.text, fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = T.primaryLight}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                신고하기
              </button>
              <div style={{ borderTop: `1px solid ${T.border}` }} />
              <button onClick={handleLeaveChat}
                style={{ width: '100%', padding: '11px 16px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', background: 'transparent', border: 'none', color: '#E84040', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FFF0F0'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                채팅방 나가기
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ─── 상품 정보 바 ─── */}
      <div onClick={() => navigate(`/products/${product.id}`)}
        style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, cursor: 'pointer' }}
      >
        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '10px', background: product.thumbnailBg, flexShrink: 0, overflow: 'hidden' }}>
          {product.thumbnail
            ? <img src={product.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.25) 8px, rgba(255,255,255,0.25) 9px)' }} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13.5px', fontWeight: '600', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.title}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: T.primary, letterSpacing: '-0.3px' }}>
            {product.price.toLocaleString()}<span style={{ fontSize: '12px' }}>원</span>
          </div>
        </div>

        {/* 상태 드롭다운 */}
        <div ref={statusRef} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
          {(() => {
            const b = getStatusBadge(status);
            return (
              <button onClick={() => setShowStatusMenu(s => !s)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${b.border}`, background: b.bg, color: b.color, fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {status} <Icon name="chevronDown" size={12} color={b.color} />
              </button>
            );
          })()}
          {showStatusMenu && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', minWidth: '130px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50 }}>
              {STATUSES.map(s => {
                const sel = status === s;
                return (
                  <button key={s} onClick={() => { setStatus(s); setShowStatusMenu(false); /* TODO: 상태 변경 API 호출 */ }}
                    style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: sel ? T.primaryLight : 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', color: sel ? T.primary : T.text, fontWeight: sel ? '700' : '500', fontFamily: 'inherit' }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = T.bg; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {s}
                    {sel && <Icon name="check" size={13} color={T.primary} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── 메시지 목록 ─── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {/* 날짜 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0 12px' }}>
          <div style={{ flex: 1, height: '1px', background: T.border }} />
          <span style={{ fontSize: '11px', color: T.textMuted, padding: '4px 12px', borderRadius: '12px', background: T.card, border: `1px solid ${T.border}`, fontWeight: '600' }}>
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <div style={{ flex: 1, height: '1px', background: T.border }} />
        </div>

        {groupedMessages.map(msg => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px', marginTop: msg.isFirst ? '10px' : '2px' }}>
              {!isMe && (
                <div style={{ width: '32px', flexShrink: 0 }}>
                  {msg.isFirst && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '800' }}>
                      {peer.nickname[0]}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '6px', maxWidth: '70%' }}>
                {msg.image ? (
                  <img src={msg.image} alt="" style={{ maxWidth: '220px', borderRadius: '14px', border: isMe ? 'none' : `1px solid ${T.border}` }} />
                ) : (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isMe
                      ? `18px ${msg.isFirst ? '18px' : '6px'} ${msg.isLast ? '6px' : '18px'} 18px`
                      : `${msg.isFirst ? '18px' : '6px'} 18px 18px ${msg.isLast ? '6px' : '18px'}`,
                    background: isMe ? `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})` : T.card,
                    color: isMe ? '#fff' : T.text,
                    fontSize: '14px', lineHeight: 1.55,
                    border: isMe ? 'none' : `1px solid ${T.border}`,
                    boxShadow: isMe ? `0 2px 8px ${T.primary}25` : '0 1px 4px rgba(0,0,0,0.03)',
                    wordBreak: 'break-word',
                  }}>
                    {msg.message}
                  </div>
                )}
                {/* 시간 + 안 읽음 (그룹의 마지막 메시지에만) */}
                {msg.isLast && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: '2px', paddingBottom: '2px' }}>
                    {isMe && !msg.read && (
                      <div style={{ fontSize: '10px', color: T.primary, fontWeight: '700' }}>1</div>
                    )}
                    <div style={{ fontSize: '10.5px', color: T.textMuted, whiteSpace: 'nowrap' }}>{msg.time}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 입력창 ─── */}
      <div style={{ background: T.card, borderTop: `1px solid ${T.border}`, padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          {/* + 액션 버튼 (확장용) */}
          <button onClick={() => setShowActions(s => !s)}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: showActions ? T.primaryLight : T.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', fontFamily: 'inherit' }}
          >
            <div style={{ transform: showActions ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <Icon name="plus" size={18} color={showActions ? T.primary : T.textMuted} />
            </div>
          </button>

          {/* 입력 필드 + 이미지 버튼 통합 */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', background: T.bg, border: `1.5px solid ${input ? T.primary : T.border}`, borderRadius: '22px', padding: '2px 4px 2px 14px', transition: 'border-color 0.18s' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요" rows={1}
              style={{ flex: 1, padding: '9px 4px', border: 'none', background: 'transparent', fontSize: '14px', color: T.text, outline: 'none', resize: 'none', lineHeight: 1.5, maxHeight: '100px', overflowY: 'auto', fontFamily: 'inherit' }}
            />
            <label style={{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = T.primaryLight}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="image" size={17} color={T.textMuted} />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>

          {/* 전송 */}
          <button onClick={handleSend} disabled={!input.trim()}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: input.trim() ? `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})` : T.border, color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: input.trim() ? `0 4px 12px ${T.primary}40` : 'none', transition: 'all 0.15s', fontFamily: 'inherit' }}
          >
            <Icon name="send" size={16} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

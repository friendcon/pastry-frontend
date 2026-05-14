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
  badgeSale:    { bg: '#E8F5E0', color: '#3A7A20', border: '#C8E8A8' },
  badgeReserve: { bg: '#FFF0DC', color: '#A05E10', border: '#FCDBA0' },
  badgeDone:    { bg: '#EEEEEE', color: '#666',    border: '#DDD'    },
};

/* ── 아이콘 ── */
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    search: <svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    bell:   <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    x:      <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };
  return icons[name] || null;
}

const getStatusBadge = status => {
  if (status === '예약중')   return T.badgeReserve;
  if (status === '거래완료') return T.badgeDone;
  return T.badgeSale;
};

/* ── 채팅 카드 ── */
function ChatItem({ chat, onClick }) {
  const [hov, setHov] = useState(false);
  const b = getStatusBadge(chat.status);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: T.card, borderRadius: '16px', border: `1px solid ${hov ? T.primary + '55' : T.border}`, padding: '14px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: hov ? `0 6px 18px ${T.primary}12` : 'none', transform: hov ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s' }}
    >
      {/* 아바타 + 상품 썸네일 미니 */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '19px', fontWeight: '800', boxShadow: `0 4px 12px ${T.primary}30` }}>
          {chat.nickname[0]}
        </div>
        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '22px', height: '22px', borderRadius: '8px', background: chat.thumbnailBg ?? '#F5DDD6', border: '2.5px solid #fff', overflow: 'hidden' }}>
          {chat.thumbnail && <img src={chat.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      </div>

      {/* 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ fontSize: '14.5px', fontWeight: '700', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {chat.nickname}
            </span>
            <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', background: b.bg, color: b.color, border: `1px solid ${b.border}`, flexShrink: 0 }}>
              {chat.status}
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: chat.unread ? T.primary : T.textMuted, fontWeight: chat.unread ? '700' : '500', flexShrink: 0 }}>
            {chat.time}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: chat.unread ? T.text : T.textMuted, fontWeight: chat.unread ? '600' : '400', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
          {chat.lastMessage}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '7px', background: T.bg, fontSize: '11px', color: T.textMuted, width: '100%', marginLeft: '-8px' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
            {chat.productTitle}
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: T.primary, fontWeight: '700', flexShrink: 0 }}>
            {chat.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 안 읽음 뱃지 */}
      {chat.unread > 0 && (
        <div style={{ minWidth: '22px', height: '22px', padding: '0 7px', borderRadius: '11px', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '800', flexShrink: 0, boxShadow: `0 2px 8px ${T.primary}50` }}>
          {chat.unread}
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'all',    label: '전체' },
  { id: 'unread', label: '안 읽음' },
  { id: 'done',   label: '거래완료' },
];

/* ══════════════════════════════════════════════
   채팅 목록 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function ChatList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [q, setQ]     = useState('');

  /* TODO: 실제 API 호출로 교체 */
  const chatList = [
    { id: 1, nickname: '빵순이',   lastMessage: '네 직거래 가능해요!',           time: '방금 전',  unread: 2, productTitle: 'Jellycat 바슈 페이스트리', price: 19000,   status: '판매중',   thumbnailBg: '#F5DDD6' },
    { id: 2, nickname: '크루아상', lastMessage: '가격 네고 가능한가요?',          time: '5분 전',   unread: 0, productTitle: '아이폰 15 Pro',         price: 850000,  status: '예약중',   thumbnailBg: '#D6E8F5' },
    { id: 3, nickname: '마카롱123', lastMessage: '감사합니다 좋은 거래였어요 😊', time: '1시간 전', unread: 0, productTitle: '다이슨 드라이어',       price: 250000,  status: '거래완료', thumbnailBg: '#E8F5D6' },
    { id: 4, nickname: '슈크림',   lastMessage: '언제 거래 가능하세요?',          time: '어제',     unread: 1, productTitle: '레고 테크닉',         price: 45000,   status: '판매중',   thumbnailBg: '#EDD6F5' },
    { id: 5, nickname: '에클레어', lastMessage: '확인했습니다!',                  time: '2일 전',   unread: 0, productTitle: '맥북 프로 M3',        price: 1800000, status: '판매중',   thumbnailBg: '#D6F5EE' },
  ];

  let filtered = chatList;
  if (tab === 'unread') filtered = filtered.filter(c => c.unread > 0);
  if (tab === 'done')   filtered = filtered.filter(c => c.status === '거래완료');
  if (q) {
    filtered = filtered.filter(c =>
      c.nickname.includes(q) || c.productTitle.includes(q) || c.lastMessage.includes(q)
    );
  }

  const totalUnread = chatList.reduce((s, c) => s + c.unread, 0);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🥐</span>
            <span style={{ fontWeight: '800', fontSize: '19px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
          </div>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: '700', color: T.text }}>채팅</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <button onClick={() => navigate('/notification')}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="bell" size={16} color={T.textMuted} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 24px 60px' }}>
        {/* 타이틀 */}
        <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: T.text, letterSpacing: '-0.7px' }}>채팅</h1>
          {totalUnread > 0 && (
            <span style={{ fontSize: '13px', color: T.textMuted }}>
              안 읽은 메시지 <span style={{ color: T.primary, fontWeight: '700' }}>{totalUnread}개</span>
            </span>
          )}
        </div>

        {/* 검색 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: T.card, border: `1.5px solid ${T.border}`, borderRadius: '12px', padding: '0 14px', marginBottom: '14px' }}>
          <Icon name="search" size={15} color={T.textMuted} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="닉네임, 상품명, 메시지 검색"
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '11px 4px', fontSize: '13.5px', color: T.text, outline: 'none', fontFamily: 'inherit' }}
          />
          {q && (
            <span onClick={() => setQ('')} style={{ cursor: 'pointer' }}>
              <Icon name="x" size={13} color={T.textMuted} />
            </span>
          )}
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {TABS.map(t => {
            const sel = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${sel ? T.primary : T.border}`, background: sel ? T.primaryLight : T.card, color: sel ? T.primary : T.textMuted, fontSize: '12.5px', fontWeight: sel ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 채팅 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ background: T.card, borderRadius: '16px', border: `1px dashed ${T.border}`, padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.4 }}>💬</div>
              <div style={{ fontSize: '14px', color: T.textMuted }}>
                {q ? `"${q}"에 대한 검색 결과가 없어요` : '아직 채팅이 없어요'}
              </div>
            </div>
          ) : (
            filtered.map(chat => (
              <ChatItem key={chat.id} chat={chat} onClick={() => navigate(`/chat/${chat.id}`)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

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
};

/* ── 아이콘 ── */
function Icon({ name, size = 18, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    bag:       <svg {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    chat:      <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    megaphone: <svg {...p}><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
    heart:     <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    star:      <svg {...{ ...p, fill: color, stroke: 'none' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    check:     <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    arrowLeft: <svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    settings:  <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return icons[name] || null;
}

/* 알림 타입별 스타일 */
const TYPE_STYLE = {
  거래: { icon: 'bag',       bg: '#E8F5E0', color: '#3A7A20', label: '거래' },
  채팅: { icon: 'chat',      bg: '#FEEAEE', color: '#E8547A', label: '채팅' },
  찜:   { icon: 'heart',     bg: '#FFE5EC', color: '#C03060', label: '찜' },
  후기: { icon: 'star',      bg: '#FFF0DC', color: '#A05E10', label: '후기' },
  공지: { icon: 'megaphone', bg: '#EDE0F8', color: '#6B30A0', label: '공지' },
};

const TABS = [
  { id: 'all',  label: '전체' },
  { id: '거래', label: '거래' },
  { id: '채팅', label: '채팅' },
  { id: '찜',  label: '찜'   },
  { id: '후기', label: '후기' },
  { id: '공지', label: '공지' },
];

/* ── 알림 카드 ── */
function NotiCard({ noti, onClick }) {
  const [hov, setHov] = useState(false);
  const s = TYPE_STYLE[noti.type] ?? TYPE_STYLE.공지;
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: !noti.isRead ? T.primaryLight + '70' : T.card,
        border: `1px solid ${!noti.isRead ? T.primary + '55' : (hov ? T.primary + '40' : T.border)}`,
        borderRadius: '16px',
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: hov ? `0 6px 18px ${T.primary}12` : 'none',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      {/* 안 읽음 점 */}
      {!noti.isRead && (
        <div style={{ position: 'absolute', top: '18px', left: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: T.primary, boxShadow: `0 0 0 3px ${T.primary}33` }} />
      )}

      {/* 아이콘 */}
      <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={s.icon} size={20} color={s.color} />
      </div>

      {/* 내용 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: '700', color: s.color, padding: '2px 7px', borderRadius: '6px', background: s.bg, letterSpacing: '0.03em' }}>
            {s.label}
          </span>
          <span style={{ fontSize: '11.5px', color: T.textMuted, fontWeight: '500', flexShrink: 0 }}>{noti.time}</span>
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: !noti.isRead ? '700' : '600', color: T.text, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {noti.content}
        </div>
        <div style={{ fontSize: '12px', color: T.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {noti.subContent}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   알림 페이지 (메인 컴포넌트)
══════════════════════════════════════════════ */
export default function Notification() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  /* TODO: 실제 API 호출로 교체 */
  const [notiList, setNotiList] = useState([
    { id: 1, type: '거래', content: '빵순이님이 거래를 예약했어요',         subContent: 'Jellycat 바슈 페이스트리',                  time: '방금 전',   isRead: false, link: '/products/1' },
    { id: 2, type: '채팅', content: '크루아상님이 새 메시지를 보냈어요',     subContent: '"가격 네고 가능한가요?"',                   time: '10분 전',  isRead: false, link: '/chat/2' },
    { id: 3, type: '찜',   content: '관심상품 가격이 내려갔어요',             subContent: '아이폰 15 Pro · 850,000원 → 780,000원',     time: '1시간 전',  isRead: false, link: '/products/3' },
    { id: 4, type: '거래', content: '마카롱123님과의 거래가 완료됐어요',     subContent: '다이슨 드라이어',                            time: '3시간 전',  isRead: true,  link: '/products/4' },
    { id: 5, type: '후기', content: '에클레어님이 후기를 남겼어요 ⭐ 5점',   subContent: '"친절하고 빠른 거래 감사해요!"',            time: '어제',     isRead: true,  link: '/mypage' },
    { id: 6, type: '공지', content: 'Pastry 서비스 점검 안내',                subContent: '5월 30일 오전 2시 ~ 4시',                    time: '2일 전',   isRead: true,  link: null },
    { id: 7, type: '공지', content: '🎉 Pastry 오픈 기념 이벤트',             subContent: '지금 가입하면 포인트 1,000P 지급!',         time: '3일 전',   isRead: true,  link: null },
  ]);

  const filtered = tab === 'all' ? notiList : notiList.filter(n => n.type === tab);
  const unread = notiList.filter(n => !n.isRead).length;

  const handleReadAll = () => {
    // TODO: 모두 읽음 처리 API 호출
    setNotiList(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotiClick = noti => {
    // TODO: 개별 읽음 처리 API 호출
    setNotiList(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
    if (noti.link) navigate(noti.link);
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ─── 헤더 ─── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="arrowLeft" size={20} color={T.text} />
          </button>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{ fontSize: '22px' }}>🥐</span>
            <span style={{ fontWeight: '800', fontSize: '18px', color: T.primary, letterSpacing: '-0.8px' }}>Pastry</span>
          </div>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: '700', color: T.text }}>알림</span>
          <button onClick={() => navigate('/settings/notifications')}
            style={{ marginLeft: 'auto', width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="settings" size={17} color={T.textMuted} />
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 24px 60px' }}>
        {/* 타이틀 + 모두 읽음 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: T.text, letterSpacing: '-0.7px' }}>알림</h1>
            {unread > 0 && (
              <span style={{ fontSize: '13px', color: T.textMuted }}>
                안 읽은 알림 <span style={{ color: T.primary, fontWeight: '700' }}>{unread}개</span>
              </span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={handleReadAll}
              style={{ padding: '7px 14px', borderRadius: '10px', border: `1.5px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
            >
              <Icon name="check" size={13} /> 모두 읽음
            </button>
          )}
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '2px' }}>
          {TABS.map(t => {
            const sel = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${sel ? T.primary : T.border}`, background: sel ? T.primaryLight : T.card, color: sel ? T.primary : T.textMuted, fontSize: '12.5px', fontWeight: sel ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ background: T.card, borderRadius: '16px', border: `1px dashed ${T.border}`, padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.4 }}>🔔</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: T.text, marginBottom: '6px' }}>알림이 없어요</div>
              <div style={{ fontSize: '13px', color: T.textMuted }}>새로운 알림이 오면 알려드릴게요</div>
            </div>
          ) : (
            filtered.map(noti => <NotiCard key={noti.id} noti={noti} onClick={() => handleNotiClick(noti)} />)
          )}
        </div>
      </div>
    </div>
  );
}

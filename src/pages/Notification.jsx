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

const notifications = [
  { id: 1, type: '거래', content: '빵순이님이 거래를 예약했어요', subContent: 'Jellycat 바슈 페이스트리', time: '방금 전', isRead: false },
  { id: 2, type: '거래', content: '크루아상님과의 거래가 완료됐어요', subContent: '아이폰 15 Pro', time: '1시간 전', isRead: false },
  { id: 3, type: '공지', content: 'Pastry 서비스 점검 안내', subContent: '4월 30일 오전 2시 ~ 4시', time: '3시간 전', isRead: true },
  { id: 4, type: '거래', content: '슈크림님이 거래를 예약했어요', subContent: '레고 테크닉', time: '어제', isRead: true },
  { id: 5, type: '공지', content: '🎉 Pastry 오픈 기념 이벤트', subContent: '지금 가입하면 포인트 1,000P 지급!', time: '2일 전', isRead: true },
];

const TYPE_STYLE = {
  거래: { icon: '🛍️', bg: '#D4EDD4', color: '#2E6E2E' },
  공지: { icon: '📢', bg: '#E8D5F5', color: '#5B2D8E' },
};


export default function Notification() {
  const navigate = useNavigate();
  const [notiList, setNotiList] = useState(notifications);

  const unreadCount = notiList.filter(n => !n.isRead).length;

  const handleReadAll = () => {
    setNotiList(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleRead = (id) => {
    setNotiList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
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
        <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '700' }}>알림</div>
        <div style={{ marginLeft: 'auto' }} />
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px' }}>

        {/* 상단 타이틀 + 전체 읽음 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700' }}>알림</span>
            {unreadCount > 0 && (
              <span style={{
                padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                backgroundColor: COLORS.primary, color: '#fff',
              }}>{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleReadAll}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
                border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent',
                color: COLORS.textMuted, cursor: 'pointer',
              }}
            >전체 읽음</button>
          )}
        </div>

        {/* 알림 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notiList.map((noti) => (
            <div
              key={noti.id}
              onClick={() => handleRead(noti.id)}
              style={{
                backgroundColor: noti.isRead ? COLORS.card : COLORS.primaryLight,
                borderRadius: '16px',
                border: `1px solid ${noti.isRead ? COLORS.border : COLORS.primary}`,
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = noti.isRead ? COLORS.card : COLORS.primaryLight}
            >
              {/* 아이콘 */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: TYPE_STYLE[noti.type].bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
              }}>
                {TYPE_STYLE[noti.type].icon}
              </div>

              {/* 내용 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                      backgroundColor: TYPE_STYLE[noti.type].bg, color: TYPE_STYLE[noti.type].color,
                    }}>{noti.type}</span>
                    {!noti.isRead && (
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: COLORS.primary, display: 'inline-block',
                      }} />
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{noti.time}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: noti.isRead ? '400' : '600', marginBottom: '2px' }}>{noti.content}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>🥐 {noti.subContent}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 알림 없을 때 */}
        {notiList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>알림이 없어요</div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted }}>새로운 알림이 오면 알려드릴게요</div>
          </div>
        )}
      </div>
    </div>
  );
}
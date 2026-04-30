import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = {
  bg: '#FFF8F2',
  primary: '#C8854A',
  primaryLight: '#F5E6D8',
  text: '#3D2B1F',
  textMuted: '#8C6E5A',
  border: '#EDD9C8',
  card: '#FFFFFF',
};

const chatList = [
  { id: 1, nickname: '빵순이', lastMessage: '네 직거래 가능해요!', time: '방금 전', unread: 2, productTitle: 'Jellycat 바슈 페이스트리', price: 19000, status: '판매중' },
  { id: 2, nickname: '크루아상', lastMessage: '가격 네고 가능한가요?', time: '5분 전', unread: 0, productTitle: '아이폰 15 Pro', price: 850000, status: '예약중' },
  { id: 3, nickname: '마카롱123', lastMessage: '감사합니다 좋은 거래였어요 😊', time: '1시간 전', unread: 0, productTitle: '다이슨 드라이어', price: 250000, status: '판매중' },
  { id: 4, nickname: '슈크림', lastMessage: '언제 거래 가능하세요?', time: '어제', unread: 1, productTitle: '레고 테크닉', price: 45000, status: '판매중' },
  { id: 5, nickname: '에클레어', lastMessage: '확인했습니다!', time: '2일 전', unread: 0, productTitle: '맥북 프로 M3', price: 1800000, status: '판매중' },
];

export default function ChatList() {
  const navigate = useNavigate();

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
        <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '700' }}>채팅</div>
        <div style={{ marginLeft: 'auto' }} />
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px' }}>

        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
          채팅 목록
          <span style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: '400', marginLeft: '8px' }}>{chatList.length}개</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              style={{
                backgroundColor: COLORS.card, borderRadius: '16px',
                border: `1px solid ${COLORS.border}`, padding: '16px',
                cursor: 'pointer', display: 'flex', gap: '14px', alignItems: 'center',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = COLORS.card}
            >
              {/* 아바타 */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: COLORS.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '20px', fontWeight: '700',
              }}>
                {chat.nickname[0]}
              </div>

              {/* 채팅 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{chat.nickname}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{chat.time}</div>
                </div>
                <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {chat.lastMessage}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🥐</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.productTitle}</span>
                  <span>·</span>
                  <span style={{ color: COLORS.primary, fontWeight: '600' }}>{chat.price.toLocaleString()}원</span>
                </div>
              </div>

              {/* 안읽은 메시지 */}
              {chat.unread > 0 && (
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: COLORS.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '11px', fontWeight: '700',
                }}>
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
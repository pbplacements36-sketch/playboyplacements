'use client';

import React from 'react';

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  right: 20,
  bottom: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  zIndex: 9999,
};

const baseButton: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  transition: 'transform 120ms ease, box-shadow 120ms ease',
};

const waStyle: React.CSSProperties = {
  ...baseButton,
  background: '#25D366',
};

const tgStyle: React.CSSProperties = {
  ...baseButton,
  background: '#2AABEE',
};

export default function FloatingCTAs() {

  const supportText = encodeURIComponent('Hi, I need help with a booking from Playboy Placements.');

  const openWhatsApp = () => {
    const url = `https://wa.me/918266907660?text=${supportText}`
    window.open(url, '_blank', 'noopener');
  };

  const openTelegram = () => {
      window.open(`https://t.me/play_job_boy_gigolo`, '_blank', 'noopener');
      return;
  };

  return (
    <div style={containerStyle} aria-hidden={false}>
      <button
        aria-label="Contact us on WhatsApp"
        title="WhatsApp"
        onClick={openWhatsApp}
        style={waStyle}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {/* WhatsApp SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path fill="#ffffff" d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.373 0 .003 5.373 0 12c0 2.116.556 4.184 1.61 6.012L0 24l6.212-1.605A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.204-1.253-6.213-3.48-8.52zM12 21.5c-1.73 0-3.43-.444-4.94-1.283l-.35-.196-3.69.954.99-3.6-.227-.369A9.5 9.5 0 1 1 21.5 12 9.49 9.49 0 0 1 12 21.5z"/>
          <path fill="#ffffff" d="M17.63 14.11c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.19.27-.73.88-.9 1.06-.17.17-.33.19-.61.07-.28-.11-1.17-.43-2.23-1.38-.82-.73-1.37-1.63-1.53-1.91-.16-.27-.02-.42.12-.56.12-.12.27-.32.4-.48.14-.16.18-.27.28-.45.09-.18.04-.34-.02-.48-.06-.13-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48-.16-.01-.35-.01-.54-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26 0 1.33.97 2.61 1.1 2.79.13.18 1.9 2.92 4.61 4 .64.28 1.14.45 1.53.57.64.19 1.22.16 1.68.1.51-.07 1.6-.65 1.83-1.28.23-.62.23-1.15.16-1.26-.06-.11-.23-.18-.5-.31z"/>
        </svg>
      </button>

      <button
        aria-label="Contact us on Telegram"
        title="Telegram"
        onClick={openTelegram}
        style={tgStyle}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {/* Telegram SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path fill="#ffffff" d="M12 .5C5.648.5.5 5.648.5 12S5.648 23.5 12 23.5 23.5 18.352 23.5 12 18.352.5 12 .5zm4.58 8.47l-1.21 5.73c-.09.34-.32.43-.65.27l-1.8-1.33-0.86.83c-.09.09-.17.17-.35.17l.13-1.87 3.4-3.08c.15-.13-.03-.21-.23-.09l-4.2 2.65-1.8-.56c-.39-.12-.4-.39.08-.58l8.76-3.36c.4-.15.75.09.62.65z"/>
        </svg>
      </button>
    </div>
  );
}
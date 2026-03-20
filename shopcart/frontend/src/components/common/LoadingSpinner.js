import React from 'react';

const LoadingSpinner = ({ fullPage, size = 'md', text }) => {
  const sizeClass = size === 'sm' ? 'spinner-sm' : '';
  if (fullPage) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className={`spinner ${sizeClass}`} />
      {text && <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>{text}</p>}
    </div>
  );
  return (
    <div className="loading-screen" style={{ flexDirection: 'column', gap: 12 }}>
      <div className={`spinner ${sizeClass}`} />
      {text && <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

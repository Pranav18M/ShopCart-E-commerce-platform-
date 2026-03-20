import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '40px 16px', textAlign: 'center' }}>
    <span style={{ fontSize: 100, lineHeight: 1 }}>🔍</span>
    <h1 style={{ fontSize: 64, fontWeight: 900, color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>404</h1>
    <h2 style={{ fontSize: 24, fontWeight: 700 }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-secondary)', maxWidth: 360, fontSize: 15, lineHeight: 1.6 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" className="btn btn-primary btn-lg">🏠 Go Home</Link>
      <Link to="/products" className="btn btn-outline btn-lg">🛍️ Browse Products</Link>
    </div>
  </div>
);

export default NotFoundPage;

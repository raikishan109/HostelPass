import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ color = 'var(--text-dark)' }) => (
  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
    <img 
      src="/pwa-192x192.png" 
      alt="HostelPass" 
      className="logo-img"
      style={{ width: '32px', height: '32px', objectFit: 'contain', background: 'transparent' }}
    />
    <span className="logo-text" style={{ color }}>
      Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>
    </span>
  </Link>
);

export default Logo;

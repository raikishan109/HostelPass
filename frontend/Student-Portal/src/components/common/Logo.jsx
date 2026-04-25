import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ color = 'var(--text-dark)' }) => (
  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
    <img 
      src="/pwa-192x192.png" 
      alt="HostelPass" 
      className="logo-img"
      style={{ width: '36px', height: '36px', objectFit: 'contain', background: 'transparent' }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span className="logo-text" style={{ color, fontSize: '20px', fontWeight: 800 }}>
        Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>
      </span>
      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '2px' }}>
        For Students
      </span>
    </div>
  </Link>
);

export default Logo;

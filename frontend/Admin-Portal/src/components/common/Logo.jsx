import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ color = 'var(--text-dark)' }) => (
  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
    <img 
      src="/admin-logo.png" 
      alt="HostelPass Admin" 
      style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
    />
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span className="logo-text" style={{ color, fontSize: '20px', fontWeight: 800 }}>
        Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>
      </span>
      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '2px' }}>
        Admin Portal
      </span>
    </div>
  </Link>
);

export default Logo;

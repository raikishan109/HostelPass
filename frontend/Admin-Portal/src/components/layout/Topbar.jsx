import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdMenu, MdNotifications, MdLocationOn, MdRestaurant } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const Topbar = ({ title, onMenuClick, subtitle }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="topbar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="nav-left">
        <button 
          className="btn btn-ghost btn-icon mobile-only" 
          onClick={onMenuClick}
          style={{ 
            padding: 0, 
            minWidth: '40px', 
            height: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <MdMenu size={24} />
        </button>
        <Logo />
      </div>
      <div className="topbar-right" style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
        <button
          className="btn-icon"
          style={{ 
            position: 'relative', background: 'transparent', color: '#333', border: 'none', 
            cursor: 'pointer', width: '40px', height: '40px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 
          }}
          title="Notifications"
        >
          <MdNotifications size={24} style={{ color: '#333' }} />
          <span style={{ 
            position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', 
            background: '#EE2E24', borderRadius: '50%', border: '2px solid white', zIndex: 10 
          }}></span>
        </button>
        <div
          className="avatar avatar-sm"
          style={{ 
            cursor: 'pointer', flexShrink: 0, width: '36px', height: '36px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            borderRadius: '50%', background: 'var(--primary)', color: 'white', 
            fontWeight: 700, fontSize: '14px' 
          }}
          title={userData?.name}
          onClick={() => navigate('/admin/profile')}
        >
          {(userData?.name || 'A').charAt(0).toUpperCase()}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;

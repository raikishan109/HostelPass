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
      <div className="topbar-right">
        <button
          className="btn btn-ghost btn-icon"
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <MdNotifications size={20} />
          <span className="notif-dot"></span>
        </button>
        <div
          className="avatar avatar-sm"
          style={{ cursor: 'pointer' }}
          title={userData?.name}
        >
          {(userData?.name || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdMenu, MdNotifications, MdLocationOn, MdRestaurant } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title, onMenuClick, subtitle }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--primary)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '18px', color: 'white',
          }}>HP</div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--text-dark)', letterSpacing: '-0.5px' }}>
            Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>
          </span>
        </Link>
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
    </div>
  );
};

export default Topbar;

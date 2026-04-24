import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdMenu, MdNotifications, MdLocationOn, MdRestaurant } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title, onMenuClick, subtitle }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, text: 'Your review for Sunrise PG was approved! ⭐', time: '2h ago' },
    { id: 2, text: 'New PG added in Koramangala matching your search.', time: '5h ago' },
  ];

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          className="btn btn-ghost btn-icon pc-only-hidden" 
          onClick={onMenuClick}
        >
          <MdMenu size={24} />
        </button>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, background: 'var(--primary)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '18px', color: 'white',
          }}>HP</div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--text-dark)', letterSpacing: '-0.5px' }}>
            Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>
          </span>
        </Link>
      </div>

      <div className="topbar-right" style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            style={{ position: 'relative' }}
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <MdNotifications size={20} />
            <span className="notif-dot"></span>
          </button>

          {showNotifications && (
            <div className="notif-dropdown shadow-lg animate-fadeIn" style={{
              position: 'absolute', top: '100%', right: 0, width: '280px', background: 'white',
              borderRadius: '12px', marginTop: '12px', border: '1px solid #eee', zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 700, fontSize: '14px' }}>Notifications</div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }} className="notif-item-hover">
                    <div style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>{n.text}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{n.time}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px', textAlign: 'center', background: '#f8f9fa', fontSize: '12px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                Clear All
              </div>
            </div>
          )}
        </div>

        <div
          className="avatar avatar-sm"
          style={{ cursor: 'pointer' }}
          title={userData?.name}
          onClick={() => navigate('/student/profile')}
        >
          {(userData?.name || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

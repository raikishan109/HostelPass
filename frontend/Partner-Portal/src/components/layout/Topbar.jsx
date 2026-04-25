import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdMenu, MdNotifications } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title, onMenuClick, subtitle }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifs, setNotifs] = useState([
    { id: 1, text: 'New booking request from a student! 📋', time: '1h ago' },
    { id: 2, text: 'Your listing "Sunrise PG" got 5 new views.', time: '3h ago' },
  ]);

  const initials = (userData?.name || 'P').charAt(0).toUpperCase();

  const handleClearAll = () => {
    setNotifs([]);
  };

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
        <Link to="/partner" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img 
            src="/partner-logo.png" 
            alt="HostelPass" 
            className="logo-img"
            style={{ width: '36px', height: '36px', objectFit: 'contain', background: 'transparent' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="logo-text" style={{ color: 'var(--text-dark)', fontSize: '20px', fontWeight: 800 }}>
              Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '2px' }}>
              Partner Portal
            </span>
          </div>
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
            {notifs.length > 0 && <span className="notif-dot"></span>}
          </button>

          {showNotifications && (
            <div className="notif-dropdown shadow-lg animate-fadeIn" style={{
              position: 'absolute', top: '100%', right: 0, width: '280px', background: 'white',
              borderRadius: '12px', marginTop: '12px', border: '1px solid #eee', zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 700, fontSize: '14px', color: '#333', display: 'flex', justifyContent: 'space-between' }}>
                Notifications
                {notifs.length > 0 && <span style={{ fontSize: '11px', color: '#999', fontWeight: 400 }}>{notifs.length} new</span>}
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifs.length > 0 ? (
                  notifs.map(n => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>{n.text}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>{n.time}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                    No new notifications
                  </div>
                )}
              </div>
              {notifs.length > 0 && (
                <div 
                  onClick={handleClearAll}
                  style={{ padding: '10px', textAlign: 'center', background: '#f8f9fa', fontSize: '12px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear All
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="avatar avatar-sm"
          style={{ cursor: 'pointer' }}
          title={userData?.name}
          onClick={() => navigate('/partner/profile')}
        >
          {initials}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;

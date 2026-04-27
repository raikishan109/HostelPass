import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const UserActions = () => {
  const { user, userRole, userData } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, text: 'Your review for Sunrise PG was approved! ⭐', time: '2h ago' },
    { id: 2, text: 'New PG added in Koramangala matching your search.', time: '5h ago' },
  ]);

  if (!user) return null;

  const initials = (userData?.name || user?.displayName || 'U').charAt(0).toUpperCase();

  const handleClearAll = () => {
    setNotifs([]);
  };

  return (
    <div className="topbar-right" style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
      <div style={{ position: 'relative' }}>
        <button
          className="btn-icon"
          style={{ 
            position: 'relative', background: 'transparent', color: '#333', border: 'none', 
            cursor: 'pointer', width: '40px', height: '40px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 
          }}
          title="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <MdNotifications size={24} style={{ color: '#333' }} />
          {notifs.length > 0 && (
            <span style={{ 
              position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', 
              background: '#EE2E24', borderRadius: '50%', border: '2px solid white', zIndex: 10 
            }}></span>
          )}
        </button>

        {showNotifications && (
          <div className="notif-dropdown shadow-lg animate-fadeIn" style={{
            position: 'absolute', top: '100%', right: 0, width: '320px', background: 'white',
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
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer', textAlign: 'left' }} className="notif-item-hover">
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
        style={{ 
          cursor: 'pointer', flexShrink: 0, width: '36px', height: '36px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          borderRadius: '50%', background: 'var(--primary)', color: 'white', 
          fontWeight: 700, fontSize: '14px' 
        }}
        title={userData?.name}
        onClick={() => navigate(`/${userRole}/profile`)}
      >
        {initials}
      </div>
    </div>
  );
};

export default UserActions;

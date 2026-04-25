import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MdDashboard, MdAddBusiness, MdListAlt, MdBarChart,
  MdPerson, MdLogout, MdVerified, MdGetApp
} from 'react-icons/md';

const PartnerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = (userData?.name || 'P').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Management</div>
        <Link to="/partner" className={`sidebar-link ${isActive('/partner') ? 'active' : ''}`} onClick={handleLinkClick}><MdDashboard /> Dashboard</Link>
        <Link to="/partner/bookings" className={`sidebar-link ${isActive('/partner/bookings') ? 'active' : ''}`} onClick={handleLinkClick}><MdListAlt /> Manage Bookings</Link>
        <Link to="/partner/listings" className={`sidebar-link ${isActive('/partner/listings') ? 'active' : ''}`} onClick={handleLinkClick}><MdListAlt /> My Listings</Link>
        <Link to="/partner/add-listing" className={`sidebar-link ${isActive('/partner/add-listing') ? 'active' : ''}`} onClick={handleLinkClick}><MdAddBusiness /> Add New PG</Link>
        <div className="sidebar-section-title">Insights</div>
        <Link to="/partner/analytics" className={`sidebar-link ${isActive('/partner/analytics') ? 'active' : ''}`} onClick={handleLinkClick}><MdBarChart /> Analytics</Link>
        <div className="sidebar-section-title">Account</div>
        <Link to="/partner/profile" className={`sidebar-link ${isActive('/partner/profile') ? 'active' : ''}`} onClick={handleLinkClick}><MdPerson /> Profile</Link>
        {deferredPrompt && (
          <button className="sidebar-link w-full mobile-only" onClick={handleInstall} style={{ background: 'var(--primary-bg)', color: 'var(--primary)', marginTop: '8px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <MdGetApp /> Install App
          </button>
        )}
      </nav>
      <div className="sidebar-footer" style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div className="avatar avatar-sm" style={{ flexShrink: 0 }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData?.name || 'Partner'}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>PG Partner</div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Sign Out"
            style={{ 
              background: 'rgba(238,46,36,0.05)', 
              color: 'var(--primary)', 
              padding: '8px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              minWidth: '36px',
              height: '36px'
            }}
          >
            <MdLogout size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PartnerSidebar;

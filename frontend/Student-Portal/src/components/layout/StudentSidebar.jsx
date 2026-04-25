import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MdDashboard, MdSearch, MdFavorite, MdRateReview, MdReport,
  MdPerson, MdLogout, MdNotifications
} from 'react-icons/md';

const StudentSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (userData?.name || user?.displayName || 'S')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {user && (
          <>
            <div className="sidebar-section-title">Main</div>
            <Link to="/student" className={`sidebar-link ${isActive('/student') ? 'active' : ''}`} onClick={handleLinkClick}>
              <MdDashboard /> Dashboard
            </Link>
            <Link to="/student/search-results" className={`sidebar-link ${isActive('/student/search-results') ? 'active' : ''}`} onClick={handleLinkClick}>
              <MdSearch /> Find PGs
            </Link>
            <Link to="/student/favorites" className={`sidebar-link ${isActive('/student/favorites') ? 'active' : ''}`} onClick={handleLinkClick}>
              <MdFavorite /> Saved PGs
            </Link>

            <div className="sidebar-section-title">Activity</div>
            <Link to="/student/reviews" className={`sidebar-link ${isActive('/student/reviews') ? 'active' : ''}`} onClick={handleLinkClick}>
              <MdRateReview /> My Reviews
            </Link>
            <Link to="/student/complaints" className={`sidebar-link ${isActive('/student/complaints') ? 'active' : ''}`} onClick={handleLinkClick}>
              <MdReport /> Complaints
            </Link>

            <div className="sidebar-section-title">Account</div>
            <Link to="/student/profile" className={`sidebar-link ${isActive('/student/profile') ? 'active' : ''}`} onClick={handleLinkClick}>
              <MdPerson /> Profile
            </Link>
          </>
        )}
      </nav>

      {!user ? (
        <div className="sidebar-footer" style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="sidebar-section-title" style={{ padding: '0 4px 4px', margin: 0 }}>Welcome to HostelPass</div>
            <Link to="/login" className="sidebar-link" onClick={handleLinkClick} style={{ background: '#f8f9fa', borderRadius: '12px', fontWeight: 700 }}>
              <MdPerson /> Login
            </Link>
            <Link to="/register" className="sidebar-link" onClick={handleLinkClick} style={{ background: 'var(--primary-gradient)', color: 'white', borderRadius: '12px', fontWeight: 800, boxShadow: '0 4px 12px rgba(238,46,36,0.2)' }}>
              <MdLogout style={{ transform: 'rotate(180deg)' }} /> Join Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="sidebar-footer" style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div className="avatar avatar-sm" style={{ flexShrink: 0 }}>{initials}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-dark)' }}>
                  {userData?.name || 'Student'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: 500 }}>Student</div>
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
                transition: 'all 0.2s ease',
                border: 'none',
                minWidth: '36px',
                height: '36px'
              }}
            >
              <MdLogout size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default StudentSidebar;

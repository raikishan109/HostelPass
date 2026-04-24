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
        <div className="sidebar-section-title">Main</div>
        <Link to="/student" className={`sidebar-link ${isActive('/student') ? 'active' : ''}`} onClick={handleLinkClick}>
          <MdDashboard /> Dashboard
        </Link>
        <Link to="/student/search" className={`sidebar-link ${isActive('/student/search') ? 'active' : ''}`} onClick={handleLinkClick}>
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
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div className="avatar avatar-sm">{initials}</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{userData?.name || 'Student'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Student</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm w-full" onClick={handleLogout}>
          <MdLogout /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;

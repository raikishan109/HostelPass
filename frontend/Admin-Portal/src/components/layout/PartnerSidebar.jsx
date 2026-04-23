import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MdDashboard, MdAddBusiness, MdListAlt, MdBarChart,
  MdPerson, MdLogout, MdVerified
} from 'react-icons/md';

const PartnerSidebar = ({ sidebarOpen }) => {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = (userData?.name || 'P').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">HP</div>
        <div className="sidebar-logo-text">Hostel<span>Pass</span></div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Management</div>
        <Link to="/partner" className={`sidebar-link ${isActive('/partner') ? 'active' : ''}`}><MdDashboard /> Dashboard</Link>
        <Link to="/partner/listings" className={`sidebar-link ${isActive('/partner/listings') ? 'active' : ''}`}><MdListAlt /> My Listings</Link>
        <Link to="/partner/add-listing" className={`sidebar-link ${isActive('/partner/add-listing') ? 'active' : ''}`}><MdAddBusiness /> Add New PG</Link>
        <div className="sidebar-section-title">Insights</div>
        <Link to="/partner/analytics" className={`sidebar-link ${isActive('/partner/analytics') ? 'active' : ''}`}><MdBarChart /> Analytics</Link>
        <div className="sidebar-section-title">Account</div>
        <Link to="/partner/profile" className={`sidebar-link ${isActive('/partner/profile') ? 'active' : ''}`}><MdPerson /> Profile</Link>
      </nav>
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div className="avatar avatar-sm">{initials}</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{userData?.name || 'Partner'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>PG Partner</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm w-full" onClick={handleLogout}><MdLogout /> Sign Out</button>
      </div>
    </aside>
  );
};

export default PartnerSidebar;

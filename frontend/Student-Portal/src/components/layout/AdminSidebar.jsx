import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MdDashboard, MdPeople, MdApartment, MdRateReview,
  MdReport, MdBarChart, MdLogout, MdShield
} from 'react-icons/md';

const AdminSidebar = ({ sidebarOpen }) => {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Overview</div>
        <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}><MdDashboard /> Dashboard</Link>
        <Link to="/admin/analytics" className={`sidebar-link ${isActive('/admin/analytics') ? 'active' : ''}`}><MdBarChart /> Analytics</Link>
        <div className="sidebar-section-title">Manage</div>
        <Link to="/admin/users" className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`}><MdPeople /> Users</Link>
        <Link to="/admin/listings" className={`sidebar-link ${isActive('/admin/listings') ? 'active' : ''}`}><MdApartment /> PG Listings</Link>
        <Link to="/admin/reviews" className={`sidebar-link ${isActive('/admin/reviews') ? 'active' : ''}`}><MdRateReview /> Reviews</Link>
        <Link to="/admin/complaints" className={`sidebar-link ${isActive('/admin/complaints') ? 'active' : ''}`}><MdReport /> Complaints</Link>
      </nav>
      <div className="sidebar-footer" style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div className="avatar avatar-sm" style={{ background: '#1F1F1F', color: 'white', flexShrink: 0 }}>
              <MdShield />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData?.name || 'Admin'}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>Super Admin</div>
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

export default AdminSidebar;

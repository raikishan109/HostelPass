import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import {
  MdDashboard, MdPeople, MdApartment, MdRateReview,
  MdReport, MdBarChart, MdLogout, MdShield
} from 'react-icons/md';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-logo mobile-only">
        <Logo />
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Overview</div>
        <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`} onClick={handleLinkClick}><MdDashboard /> Dashboard</Link>
        <Link to="/admin/analytics" className={`sidebar-link ${isActive('/admin/analytics') ? 'active' : ''}`} onClick={handleLinkClick}><MdBarChart /> Analytics</Link>
        <div className="sidebar-section-title">Manage</div>
        <Link to="/admin/users" className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`} onClick={handleLinkClick}><MdPeople /> Users</Link>
        <Link to="/admin/listings" className={`sidebar-link ${isActive('/admin/listings') ? 'active' : ''}`} onClick={handleLinkClick}><MdApartment /> PG Listings</Link>
        <Link to="/admin/reviews" className={`sidebar-link ${isActive('/admin/reviews') ? 'active' : ''}`} onClick={handleLinkClick}><MdRateReview /> Reviews</Link>
        <Link to="/admin/complaints" className={`sidebar-link ${isActive('/admin/complaints') ? 'active' : ''}`} onClick={handleLinkClick}><MdReport /> Complaints</Link>
      </nav>
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div className="avatar avatar-sm" style={{ background: '#1F1F1F', color: 'white' }}>
            <MdShield />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{userData?.name || 'Admin'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Super Admin</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm w-full" onClick={handleLogout}><MdLogout /> Sign Out</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

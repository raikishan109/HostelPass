import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StudentSidebar from '../../components/layout/StudentSidebar';
import Topbar from '../../components/layout/Topbar';
import PGCard from '../../components/common/PGCard';
import { MOCK_PGS } from '../../data/mockData';
import { MdSearch, MdStar, MdRestaurant, MdFavorite, MdRateReview, MdTrendingUp, MdLocationOn } from 'react-icons/md';

const StudentDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState(userData?.favorites || []);
  const [searchQuery, setSearchQuery] = useState('');

  const topPGs = [...MOCK_PGS].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const topMess = [...MOCK_PGS].sort((a, b) => b.messRating - a.messRating).slice(0, 3);

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const stats = [
    { icon: <MdSearch />, label: 'PGs Explored', value: '12', color: 'red' },
    { icon: <MdFavorite />, label: 'Saved PGs', value: favorites.length, color: 'red' },
    { icon: <MdRateReview />, label: 'Reviews Written', value: '3', color: 'green' },
    { icon: <MdStar />, label: 'Avg Rating Given', value: '4.2', color: 'amber' },
  ];

  return (
    <div className="dashboard-layout">
      <StudentSidebar sidebarOpen={sidebarOpen} />
      <div className="main-content">
        <Topbar title="Dashboard" subtitle={`Welcome back, ${userData?.name?.split(' ')[0] || 'Student'}! 👋`} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-content animate-fadeIn">

          {/* Search Hero */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(238,46,36,0.05), transparent 70%)', pointerEvents: 'none' }} />
            <h2 style={{ color: '#1A1A1A', fontWeight: 800, fontSize: '22px', marginBottom: '8px' }}>Find Your Ideal PG 🏠</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Search by location, budget or college name</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', borderRadius: '12px', padding: '10px 16px', border: '1px solid #eee' }}>
                <MdLocationOn color="#999" />
                <input
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#333', fontSize: '14px' }}
                  placeholder="Koramangala, Bangalore..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/student/search?q=${searchQuery}`)}
                />
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/student/search?q=${searchQuery}`)}>
                <MdSearch /> Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: '28px' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Rated PGs */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '18px' }}>⭐ Top Rated PGs</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Based on overall student ratings</p>
              </div>
              <Link to="/student/search" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className="grid-3">
              {topPGs.map(pg => (
                <PGCard key={pg.id} pg={pg} isFavorite={favorites.includes(pg.id)} onToggleFavorite={toggleFav} />
              ))}
            </div>
          </div>

          {/* Top Mess */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '18px' }}>🍽️ Best Mess Quality</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Highest mess/food ratings from students</p>
              </div>
              <Link to="/student/search?sort=mess" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className="grid-3">
              {topMess.map(pg => (
                <PGCard key={pg.id} pg={pg} isFavorite={favorites.includes(pg.id)} onToggleFavorite={toggleFav} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

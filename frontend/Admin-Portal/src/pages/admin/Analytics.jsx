import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { MOCK_PGS } from '../../data/mockData';
import { MdPeople, MdApartment, MdRateReview, MdReport, MdStar, MdRestaurant, MdVerified, MdTrendingUp } from 'react-icons/md';

const AdminAnalytics = () => {
  const totalReviews = MOCK_PGS.reduce((s, p) => s + p.reviewCount, 0);
  const avgRating = (MOCK_PGS.reduce((s, p) => s + p.rating, 0) / MOCK_PGS.length).toFixed(2);
  const avgMess = (MOCK_PGS.reduce((s, p) => s + p.messRating, 0) / MOCK_PGS.length).toFixed(2);
  const verifiedCount = MOCK_PGS.filter(p => p.verified).length;

  const topPGs = [...MOCK_PGS].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const topMess = [...MOCK_PGS].sort((a, b) => b.messRating - a.messRating).slice(0, 5);

  return (
    <AdminLayout title="Platform Analytics" subtitle="Overview of the entire Hostel-Pass platform">
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { icon: <MdApartment />, label: 'Total Listings', value: MOCK_PGS.length, color: 'red' },
          { icon: <MdVerified />, label: 'Verified PGs', value: verifiedCount, color: 'green' },
          { icon: <MdStar />, label: 'Avg Rating', value: avgRating, color: 'amber' },
          { icon: <MdRestaurant />, label: 'Avg Mess', value: avgMess, color: 'red' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Top Rated */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 700 }}>⭐ Top Rated PGs</h3>
          </div>
          <div style={{ padding: '0 8px' }}>
            {topPGs.map((pg, i) => (
              <div key={pg.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: i < topPGs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#f59e0b' : 'var(--bg)', color: i === 0 ? 'white' : 'var(--text-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{pg.name}</div>
                  <div className="pc-only" style={{ fontSize: '12px', color: 'var(--text-light)' }}>{pg.location}</div>
                </div>
                <span className="badge badge-primary"><MdStar size={10} /> {pg.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Mess */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 700 }}>🍽️ Best Mess Quality</h3>
          </div>
          <div style={{ padding: '0 8px' }}>
            {topMess.map((pg, i) => (
              <div key={pg.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: i < topMess.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--bg)', color: i === 0 ? 'white' : 'var(--text-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{pg.name}</div>
                  <div className="pc-only" style={{ fontSize: '12px', color: 'var(--text-light)' }}>{pg.location}</div>
                </div>
                <span className="badge" style={{ background: '#fff7ed', color: '#c2410c' }}><MdRestaurant size={10} /> {pg.messRating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;

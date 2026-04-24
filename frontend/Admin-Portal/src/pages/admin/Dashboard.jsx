import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { MOCK_PGS, MOCK_REVIEWS } from '../../data/mockData';
import { MdPeople, MdApartment, MdRateReview, MdReport, MdVerified, MdTrendingUp, MdWarning } from 'react-icons/md';

const AdminDashboard = () => {
  const totalPGs = MOCK_PGS.length;
  const verifiedPGs = MOCK_PGS.filter(p => p.verified).length;
  const totalComplaints = MOCK_PGS.reduce((s, p) => s + p.complaintCount, 0);
  const totalReviews = MOCK_PGS.reduce((s, p) => s + p.reviewCount, 0);

  const stats = [
    { icon: <MdPeople />, label: 'Total Users', value: '15,842', color: 'blue', change: '+12%' },
    { icon: <MdApartment />, label: 'PG Listings', value: totalPGs, color: 'red', change: '+3' },
    { icon: <MdRateReview />, label: 'Total Reviews', value: totalReviews, color: 'green', change: '+48' },
    { icon: <MdReport />, label: 'Open Complaints', value: totalComplaints, color: 'amber', change: '-5' },
  ];

  const recentComplaints = MOCK_PGS.filter(p => p.complaintCount > 0).slice(0, 5);

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Platform overview and controls">
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.change.startsWith('+') ? 'up' : 'down'}`}>{s.change} <span className="pc-only">this week</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Pending Verifications */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>Pending Verifications</h3>
            <span className="badge badge-warning">3 pending</span>
          </div>
          <div style={{ padding: '16px 24px' }}>
            {MOCK_PGS.filter(p => !p.verified).slice(0, 3).map(pg => (
              <div key={pg.id} className="flex-mobile-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{pg.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{pg.location}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-sm" style={{ background: 'var(--verified-color)', color: 'white', padding: '6px 12px', flex: 1 }}>
                    <MdVerified size={12} /> Approve
                  </button>
                  <button className="btn btn-danger btn-sm" style={{ padding: '6px 12px', flex: 1 }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-complaint PGs */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdWarning color="var(--warning)" />
            <h3 style={{ fontWeight: 700 }}>High-Complaint PGs</h3>
          </div>
          <div style={{ padding: '16px 24px' }}>
            {recentComplaints.map(pg => (
              <div key={pg.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{pg.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{pg.location}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${pg.complaintCount > 5 ? 'badge-danger' : 'badge-warning'}`}>
                    {pg.complaintCount} <span className="pc-only">complaints</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

import React from 'react';
import PartnerSidebar from '../../components/layout/PartnerSidebar';
import Topbar from '../../components/layout/Topbar';
import { MOCK_PGS } from '../../data/mockData';
import { MdStar, MdRestaurant, MdRateReview, MdTrendingUp, MdReport } from 'react-icons/md';

const PartnerAnalytics = () => {
  const pgs = MOCK_PGS.slice(0, 2);
  const totalReviews = pgs.reduce((s, p) => s + p.reviewCount, 0);
  const avgRating = (pgs.reduce((s, p) => s + p.rating, 0) / pgs.length).toFixed(1);
  const avgMess = (pgs.reduce((s, p) => s + p.messRating, 0) / pgs.length).toFixed(1);

  return (
    <div className="dashboard-layout">
      <PartnerSidebar />
      <div className="main-content">
        <Topbar title="Analytics" subtitle="Performance overview for your listings" />
        <div className="page-content animate-fadeIn">
          <div className="grid-4" style={{ marginBottom: '28px' }}>
            {[
              { icon: <MdStar />, label: 'Avg Overall Rating', value: avgRating, color: 'amber', sub: 'Across all listings' },
              { icon: <MdRestaurant />, label: 'Avg Mess Rating', value: avgMess, color: 'red', sub: 'Food quality score' },
              { icon: <MdRateReview />, label: 'Total Reviews', value: totalReviews, color: 'blue', sub: 'All time' },
              { icon: <MdReport />, label: 'Open Complaints', value: pgs.reduce((s, p) => s + p.complaintCount, 0), color: 'red', sub: 'Needs attention' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Per-listing breakdown */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 700 }}>Per-Listing Breakdown</h3>
            </div>
            <table className="table">
              <thead>
                <tr><th>PG Name</th><th>Overall Rating</th><th>Mess Rating</th><th>Reviews</th><th>Complaints</th><th>Trend</th></tr>
              </thead>
              <tbody>
                {pgs.map(pg => (
                  <tr key={pg.id}>
                    <td style={{ fontWeight: 600 }}>{pg.name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MdStar color="#f59e0b" />
                        <span style={{ fontWeight: 600 }}>{pg.rating}</span>
                        <div className="progress-bar" style={{ width: '60px', marginLeft: '8px' }}>
                          <div className="progress-fill amber" style={{ width: `${(pg.rating / 5) * 100}%`, background: '#f59e0b' }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MdRestaurant color="#ea580c" size={14} />
                        <span style={{ fontWeight: 600 }}>{pg.messRating}</span>
                      </div>
                    </td>
                    <td>{pg.reviewCount}</td>
                    <td style={{ color: pg.complaintCount > 3 ? 'var(--danger)' : 'var(--text-dark)', fontWeight: pg.complaintCount > 3 ? 700 : 400 }}>
                      {pg.complaintCount}
                    </td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--verified-color)', fontWeight: 600, fontSize: '13px' }}><MdTrendingUp /> +2.3%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerAnalytics;

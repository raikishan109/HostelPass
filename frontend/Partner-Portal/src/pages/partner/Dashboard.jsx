import React from 'react';
import { Link } from 'react-router-dom';
import PartnerSidebar from '../../components/layout/PartnerSidebar';
import Topbar from '../../components/layout/Topbar';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PGS, MOCK_REVIEWS } from '../../data/mockData';
import { MdAdd, MdStar, MdRestaurant, MdReport, MdVerified, MdRateReview, MdApartment, MdTrendingUp } from 'react-icons/md';

const PartnerDashboard = () => {
  const { userData } = useAuth();
  const myPGs = MOCK_PGS.slice(0, 2);
  const totalReviews = myPGs.reduce((s, p) => s + p.reviewCount, 0);
  const avgRating = (myPGs.reduce((s, p) => s + p.rating, 0) / myPGs.length).toFixed(1);
  const totalComplaints = myPGs.reduce((s, p) => s + p.complaintCount, 0);

  const stats = [
    { icon: <MdApartment />, label: 'Active Listings', value: myPGs.length, color: 'red' },
    { icon: <MdStar />, label: 'Average Rating', value: avgRating, color: 'amber' },
    { icon: <MdRateReview />, label: 'Total Reviews', value: totalReviews, color: 'blue' },
    { icon: <MdReport />, label: 'Open Complaints', value: totalComplaints, color: 'red' },
  ];

  return (
    <div className="dashboard-layout">
      <PartnerSidebar />
      <div className="main-content">
        <Topbar title="Partner Dashboard" subtitle={`Welcome, ${userData?.name?.split(' ')[0] || 'Partner'}!`} />
        <div className="page-content animate-fadeIn">

          {/* Welcome Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1F1F1F, #2d0e0a)', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '20px', marginBottom: '6px' }}>Manage Your Listings 🏠</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>Add new PGs, view ratings and respond to student feedback.</p>
            </div>
            <Link to="/partner/add-listing" className="btn btn-primary"><MdAdd /> Add New PG</Link>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: '28px' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
              </div>
            ))}
          </div>

          {/* Listings */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700 }}>My PG Listings</h3>
              <Link to="/partner/listings" className="btn btn-outline btn-sm">Manage All</Link>
            </div>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>PG Name</th><th>Location</th><th>Rent</th><th>Rating</th><th>Mess</th><th>Reviews</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myPGs.map(pg => (
                    <tr key={pg.id}>
                      <td><div style={{ fontWeight: 600 }}>{pg.name}</div></td>
                      <td style={{ color: 'var(--text-light)', fontSize: '13px' }}>{pg.location}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{pg.rent.toLocaleString()}</td>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdStar color="#f59e0b" />{pg.rating}</span></td>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdRestaurant color="#ea580c" size={14} />{pg.messRating}</span></td>
                      <td>{pg.reviewCount}</td>
                      <td>{pg.verified ? <span className="badge badge-verified"><MdVerified size={10} /> Verified</span> : <span className="badge badge-grey">Unverified</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Apply for Verified badge */}
          <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: '16px', padding: '24px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MdVerified color="var(--verified-color)" size={20} />
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-dark)' }}>Apply for Verified PG Badge</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-medium)' }}>
                Get the Verified badge to build trust with students and increase bookings.
              </p>
            </div>
            <button className="btn" style={{ background: 'var(--verified-color)', color: 'white' }}>Apply Now</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;

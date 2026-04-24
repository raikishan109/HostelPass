import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { MdPeople, MdApartment, MdRateReview, MdReport, MdVerified, MdWarning } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ users: 0, pgs: 0, reviews: 0, complaints: 0 });
  const [pendingPGs, setPendingPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener for Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setCounts(prev => ({ ...prev, users: snap.size }));
    });

    // Listener for PGs
    const unsubPGs = onSnapshot(collection(db, 'hostels'), (snap) => {
      const pgsData = snap.docs.map(d => d.data());
      setCounts(prev => ({ 
        ...prev, 
        pgs: snap.size,
        reviews: pgsData.reduce((s, p) => s + (p.reviewCount || 0), 0),
        complaints: pgsData.reduce((s, p) => s + (p.complaintCount || 0), 0)
      }));
      setPendingPGs(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => !p.verified)
        .slice(0, 5)
      );
      setLoading(false);
    });

    return () => { unsubUsers(); unsubPGs(); };
  }, []);

  const handleVerify = async (id) => {
    try {
      await updateDoc(doc(db, 'hostels', id), { verified: true });
      toast.success('PG Verified successfully!');
    } catch (e) { toast.error('Verification failed'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject and delete this listing?')) return;
    try {
      await deleteDoc(doc(db, 'hostels', id));
      toast.success('Listing rejected and removed');
    } catch (e) { toast.error('Action failed'); }
  };

  const stats = [
    { icon: <MdPeople />, label: 'Total Users', value: counts.users.toLocaleString(), color: 'blue', change: '+12%' },
    { icon: <MdApartment />, label: 'PG Listings', value: counts.pgs, color: 'red', change: '+3' },
    { icon: <MdRateReview />, label: 'Total Reviews', value: counts.reviews, color: 'green', change: '+48' },
    { icon: <MdReport />, label: 'Open Complaints', value: counts.complaints, color: 'amber', change: '-5' },
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
            <span className={`badge ${pendingPGs.length > 0 ? 'badge-warning' : 'badge-verified'}`}>
              {pendingPGs.length} pending
            </span>
          </div>
          <div style={{ padding: '16px 24px' }}>
            {pendingPGs.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No pending verifications</p>
            ) : (
              pendingPGs.map(pg => (
                <div key={pg.id} className="flex-mobile-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{pg.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{pg.location}, {pg.city}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleVerify(pg.id)} className="btn btn-sm" style={{ background: 'var(--verified-color)', color: 'white', padding: '6px 12px', flex: 1 }}>
                      <MdVerified size={12} /> Approve
                    </button>
                    <button onClick={() => handleReject(pg.id)} className="btn btn-danger btn-sm" style={{ padding: '6px 12px', flex: 1 }}>Reject</button>
                  </div>
                </div>
              ))
            )}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PartnerLayout from '../../components/layout/PartnerLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { MOCK_PGS } from '../../data/mockData';
import { 
  MdAdd, MdStar, MdRestaurant, MdReport, MdVerified, 
  MdRateReview, MdApartment, MdBookOnline, MdAssignmentLate 
} from 'react-icons/md';

const PartnerDashboard = () => {
  const { user, userData } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [myPGs, setMyPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;

    // Real-time listener for pending bookings
    const qPending = query(collection(db, 'bookings'), where('status', '==', 'pending'));
    const unsubPending = onSnapshot(qPending, (snap) => {
      setPendingCount(snap.size);
    });

    // Real-time listener for recent bookings
    const qRecent = query(collection(db, 'bookings'), limit(3));
    const unsubRecent = onSnapshot(qRecent, (snap) => {
      setRecentBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Real-time listener for My PGs
    const qMyPGs = query(collection(db, 'hostels'), where('partnerId', '==', user.uid));
    const unsubMyPGs = onSnapshot(qMyPGs, (snap) => {
      setMyPGs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubPending();
      unsubRecent();
      unsubMyPGs();
    };
  }, [user]);

  const totalReviews = myPGs.reduce((s, p) => s + (p.reviewCount || 0), 0);
  const avgRating = myPGs.length > 0 
    ? (myPGs.reduce((s, p) => s + (p.rating || 0), 0) / myPGs.length).toFixed(1) 
    : '0.0';

  const stats = [
    { icon: <MdAssignmentLate />, label: 'Pending Bookings', value: pendingCount, color: 'red' },
    { icon: <MdApartment />, label: 'Active Listings', value: myPGs.length, color: 'blue' },
    { icon: <MdStar />, label: 'Average Rating', value: avgRating, color: 'amber' },
    { icon: <MdRateReview />, label: 'Total Reviews', value: totalReviews, color: 'green' },
  ];

  return (
    <PartnerLayout title="Partner Dashboard" subtitle={`Welcome, ${userData?.name?.split(' ')[0] || 'Partner'}!`}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1F1F1F, #2d0e0a)', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="flex-mobile-col">
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

          {/* Pending Bookings Alert */}
          {pendingCount > 0 && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '20px 24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="flex-mobile-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#EF4444', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <MdBookOnline size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#991B1B' }}>You have {pendingCount} new booking request{pendingCount > 1 ? 's' : ''}!</h4>
                  <p style={{ fontSize: '13px', color: '#B91C1C' }}>Action required: Review and approve student bookings.</p>
                </div>
              </div>
              <Link to="/partner/bookings" className="btn w-mobile-full" style={{ background: '#EF4444', color: 'white' }}>Review Now</Link>
            </div>
          )}

          <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>
            {/* Recent Bookings List */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700 }}>Recent Bookings</h3>
                <Link to="/partner/bookings" className="btn btn-outline btn-sm">View All</Link>
              </div>
              <div style={{ padding: '12px' }}>
                {recentBookings.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No recent bookings</p>
                ) : (
                  recentBookings.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f8f9fa', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.hostelName}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>ID: {b.id?.substring(0, 8)}...</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          background: b.status === 'pending' ? '#FFFBEB' : '#E7F7EF',
                          color: b.status === 'pending' ? '#B45309' : '#0D9488',
                          whiteSpace: 'nowrap'
                        }}>
                          {b.status}
                        </span>
                        {b.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-sm" style={{ background: '#E7F7EF', color: '#0D9488', padding: '4px 8px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleUpdateStatus(b.id, 'confirmed')}>
                              <MdCheck size={14} /> Confirm
                            </button>
                            <button className="btn btn-sm" style={{ background: '#FEF2F2', color: '#DC2626', padding: '4px 8px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleUpdateStatus(b.id, 'cancelled')}>
                              <MdClose size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Listings Summary */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700 }}>My PG Listings</h3>
                <Link to="/partner/listings" className="btn btn-outline btn-sm">Manage All</Link>
              </div>
              <div style={{ padding: '12px' }}>
                {myPGs.map(pg => (
                  <div key={pg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f8f9fa', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pg.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{pg.location}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '14px', whiteSpace: 'nowrap' }}>₹{pg.rent.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Apply for Verified badge */}
          <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: '16px', padding: '24px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="flex-mobile-col">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MdVerified color="var(--verified-color)" size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-dark)' }}>Apply for Verified PG Badge</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-medium)' }}>
                Increase student trust and bookings with a verified badge.
              </p>
            </div>
            <button className="btn w-mobile-full" style={{ background: 'var(--verified-color)', color: 'white' }}>Apply Now</button>
          </div>

    </PartnerLayout>
  );
};

export default PartnerDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StudentLayout from '../../components/layout/StudentLayout';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { 
  MdHome, 
  MdLocationOn, 
  MdPayments, 
  MdInfo, 
  MdCancel, 
  MdCalendarToday,
  MdHotel,
  MdRestaurant,
  MdArrowForward,
  MdExitToApp,
  MdSearch,
  MdMessage,
  MdReportProblem,
  MdHelpOutline
} from 'react-icons/md';
import { LuSearch, LuBookMarked, LuCreditCard, LuTriangleAlert, LuLifeBuoy } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null); // Keep this for the top rent card
  const [latestPayment, setLatestPayment] = useState(null);
  const [showAllActions, setShowAllActions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch booking using: userId == currentUserId AND status IN [pending, confirmed, checked-in] LIMIT 1
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Manually filter by status to avoid composite index requirement
      const activeBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => ['pending', 'confirmed', 'checked-in'].includes(b.status));
        
      activeBookings.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setBookings(activeBookings);
      
      if (activeBookings.length > 0) {
        // Find the 'checked-in' or the most recent confirmed one for the Rent Card
        const current = activeBookings.find(b => b.status === 'checked-in') || activeBookings[0];
        setActiveBooking(current);
      } else {
        setActiveBooking(null);
      }
      // If we don't have payments to fetch, we can stop loading here
    }, (error) => {
      console.error("Error fetching booking:", error);
      setLoading(false);
    });

    // Fetch latest payment
    const pq = query(
      collection(db, 'payments'),
      where('userId', '==', user.uid),
      limit(1)
    );
    const unsubscribePay = onSnapshot(pq, (snap) => {
      if (!snap.empty) {
        // Manually sort latest
        const docs = snap.docs.map(d => d.data());
        docs.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setLatestPayment(docs[0]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching payments:", error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribePay();
    };
  }, [user]);

  const handlePayRent = () => {
    navigate('/student/pay');
  };

  const handleCancelBooking = async () => {
    if (!activeBooking) return;
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const bookingRef = doc(db, 'bookings', activeBooking.id);
        await updateDoc(bookingRef, { status: 'cancelled' });
        toast.success('Booking Cancelled');
      } catch (error) {
        console.error("Cancellation error:", error);
        toast.error("Failed to cancel booking");
      }
    }
  };

  const handleLeaveHostel = async () => {
    if (!activeBooking) return;
    if (window.confirm('Are you sure you want to leave this hostel? Your current stay will be marked as completed.')) {
      try {
        const bookingRef = doc(db, 'bookings', activeBooking.id);
        await updateDoc(bookingRef, { status: 'checked-out' });
        toast.success('Successfully Checked Out. Hope you had a great stay!');
      } catch (error) {
        console.error("Leave error:", error);
        toast.error("Failed to process request");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid': return { bg: '#10B981', text: 'white' };
      case 'pending': return { bg: '#F59E0B', text: 'white' };
      case 'checked-in': return { bg: '#3B82F6', text: 'white' };
      case 'cancelled': return { bg: '#EF4444', text: 'white' };
      default: return { bg: '#6B7280', text: 'white' };
    }
  };

  const Badge = ({ status }) => {
    const colors = getStatusColor(status);
    return (
      <span style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'capitalize',
        display: 'inline-block',
        border: `1px solid ${colors.text}20`
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <StudentLayout title="Dashboard">
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', height: '75vh', gap: '20px', textAlign: 'center'
        }}>
          {/* Spinning Ring */}
          <div style={{ position: 'relative', width: '72px', height: '72px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              border: '4px solid #f3f3f3', borderTop: '4px solid #E60000',
              animation: 'spin 0.9s linear infinite'
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '22px'
            }}>🏠</div>
          </div>
          {/* Brand */}
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Hostel<span style={{ color: '#E60000' }}>Pass</span>
            </div>
            <p style={{ fontSize: '13px', color: '#999', marginTop: '6px', animation: 'pulse 1.5s ease-in-out infinite' }}>
              Loading your dashboard...
            </p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Student Dashboard">
      <div className="animate-fadeIn app-page-container">
        
        {/* Header Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Hello, {userData?.name?.split(' ')[0] || 'User'} 👋</h2>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Student Dashboard</p>
          </div>

        </div>

        {/* Current Rent Card */}
        {activeBooking ? (
          <div className="app-gradient-card rent-card-app" style={{ marginBottom: '24px', boxShadow: '0 10px 25px rgba(230,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>Current Rent</div>
              {activeBooking.paymentStatus === 'paid' && (
                <span style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 900, boxShadow: '0 2px 4px rgba(16,185,129,0.3)' }}>PAID</span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 900 }}>₹{activeBooking.rent.toLocaleString()}</span>
                <span style={{ fontSize: '14px', opacity: 0.8, fontWeight: 500 }}> / month</span>
              </div>
              <Link to={`/student/pg/${activeBooking.hostelId}`} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>View Details</Link>
            </div>
            
            <div className="rent-card-stats" style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Active Booking</div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{activeBooking.hostelName}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Move-in: {activeBooking.moveInDate || 'TBD'}</div>
                <div style={{ fontSize: '10px', opacity: 0.6 }}>Booked: {activeBooking.createdAt?.toDate ? activeBooking.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Due Date</div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{activeBooking.nextDueDate || '01 ' + new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</div>
                {activeBooking.paymentStatus !== 'paid' && (
                  <div style={{ fontSize: '11px', color: '#ffcfcf', fontWeight: 700 }}>5 days left</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="rent-card-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {activeBooking.status === 'pending' ? (
                <div style={{ flex: 2, background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.3)' }}>
                  Awaiting Approval...
                </div>
              ) : (
                <button 
                  onClick={handlePayRent}
                  disabled={activeBooking.paymentStatus === 'paid'}
                  style={{ flex: 2, background: 'white', color: 'var(--primary)', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', opacity: activeBooking.paymentStatus === 'paid' ? 0.8 : 1 }}
                >
                  {activeBooking.paymentStatus === 'paid' ? 'Monthly Rent Paid' : 'Pay Monthly Rent'}
                </button>
              )}
              {activeBooking.status === 'checked-in' ? (
                <button 
                  onClick={handleLeaveHostel}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <MdExitToApp size={18} /> Leave
                </button>
              ) : (
                <button 
                  onClick={handleCancelBooking}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <MdCancel size={18} /> Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="app-card" style={{ marginBottom: '24px', textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--primary-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
              <MdHotel size={32} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>No Active Booking</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: '8px 0 20px' }}>Find your perfect PG/Hostel near your college.</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/student/search-results')}>Explore Now</button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3 className="section-title-app">Quick Actions</h3>
          {/* View All only on mobile */}
          <span className="view-all-link view-all-mobile" onClick={() => setShowAllActions(!showAllActions)} style={{ cursor: 'pointer' }}>
            {showAllActions ? 'Show Less' : 'View All'}
          </span>
        </div>
        <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div className="action-item" onClick={() => navigate('/student/search-results')}>
            <div className="action-icon" style={{ background: '#ffffff', color: '#1a1a1a', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><LuSearch size={22} strokeWidth={2.5} /></div>
            <span className="action-label" style={{ fontWeight: 600, color: '#333' }}>Find PG</span>
          </div>
          <div className="action-item" onClick={() => navigate('/student/bookings')}>
            <div className="action-icon" style={{ background: '#ffffff', color: '#1a1a1a', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><LuBookMarked size={22} strokeWidth={2.5} /></div>
            <span className="action-label" style={{ fontWeight: 600, color: '#333' }}>Bookings</span>
          </div>
          <div className="action-item" onClick={() => navigate('/student/payments')}>
            <div className="action-icon" style={{ background: '#ffffff', color: '#1a1a1a', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><LuCreditCard size={22} strokeWidth={2.5} /></div>
            <span className="action-label" style={{ fontWeight: 600, color: '#333' }}>Payments</span>
          </div>
          <div className="action-item" onClick={() => navigate('/student/complaints')}>
            <div className="action-icon" style={{ background: '#ffffff', color: '#1a1a1a', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><LuTriangleAlert size={22} strokeWidth={2.5} /></div>
            <span className="action-label" style={{ fontWeight: 600, color: '#333' }}>Complaints</span>
          </div>
          {/* Support: always visible on desktop, toggleable on mobile */}
          <div className={`action-item action-support-desktop ${showAllActions ? '' : 'action-support-mobile-hidden'}`} onClick={() => navigate('/student/support')}>
            <div className="action-icon" style={{ background: '#ffffff', color: '#1a1a1a', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><LuLifeBuoy size={22} strokeWidth={2.5} /></div>
            <span className="action-label" style={{ fontWeight: 600, color: '#333' }}>Support</span>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3 className="section-title-app">My Bookings</h3>
          <Link to="/student/bookings" className="view-all-link">View All</Link>
        </div>
        
        <div className="bookings-grid-app">
          {bookings.length > 0 ? (
            bookings.map(b => (
              <div key={b.id} className="app-card booking-card-compact" onClick={() => navigate(`/student/pg/${b.hostelId}`)}>
                <div className="booking-card-img">
                  <img src={b.hostelImage || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400'} alt={b.hostelName} />
                </div>
                <div className="booking-card-info">
                  <div className="booking-card-header">
                    <h4 className="booking-card-title">{b.hostelName}</h4>
                    <span className={`status-badge status-${b.status?.toLowerCase() || 'confirmed'}`}>{b.status || 'Confirmed'}</span>
                  </div>
                  <p className="booking-card-loc">{b.location}</p>
                  <div className="booking-card-footer">
                    <div className="booking-card-price">₹{b.rent.toLocaleString()}<span> / mo</span></div>
                    <div className="booking-card-date">In: <span>{b.moveInDate || '01 May 2025'}</span></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="app-card" style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '24px', width: '100%' }}>No bookings yet</div>
          )}
        </div>

        {/* Rent Payments Section */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3 className="section-title-app">Rent Payments</h3>
          <Link to="/student/payments" className="view-all-link">View All</Link>
        </div>
        {latestPayment ? (
          <div className="app-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '12px' }}>{latestPayment.month || 'Current Month'}</div>
              <span className="status-badge status-confirmed" style={{ fontSize: '9px' }}>Paid</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>₹{latestPayment.amount?.toLocaleString()}</div>
              <div style={{ fontSize: '10px', color: '#999' }}>{latestPayment.createdAt?.toDate ? latestPayment.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}</div>
            </div>
          </div>
        ) : (
          <div className="app-card" style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
            No payment records yet
          </div>
        )}

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;

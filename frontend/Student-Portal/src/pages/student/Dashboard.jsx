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
  MdMessage
} from 'react-icons/md';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch booking using: userId == currentUserId AND status IN [pending, confirmed, checked-in] LIMIT 1
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      where('status', 'in', ['pending', 'confirmed', 'checked-in']),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveBooking({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveBooking(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePayRent = async () => {
    if (!activeBooking) return;

    try {
      // Simulate payment
      const bookingRef = doc(db, 'bookings', activeBooking.id);
      await updateDoc(bookingRef, {
        paymentStatus: 'paid'
      });

      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        bookingId: activeBooking.id,
        amount: activeBooking.rent,
        month: new Date().toLocaleString('default', { month: 'long' }),
        status: 'paid',
        createdAt: serverTimestamp()
      });

      toast.success('Rent Paid Successfully!');
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed");
    }
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
      case 'paid': return { bg: '#E7F7EF', text: '#0D9488' };
      case 'pending': return { bg: '#FFFBEB', text: '#B45309' };
      case 'checked-in': return { bg: '#EFF6FF', text: '#1D4ED8' };
      case 'cancelled': return { bg: '#FEF2F2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#374151' };
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
      <StudentLayout title="My Hostel">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: '16px' }}>
          <div className="loader-spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #EE2E24', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#666' }}>Fetching details...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
          <div className="app-gradient-card" style={{ marginBottom: '24px', boxShadow: '0 10px 25px rgba(230,0,0,0.15)' }}>
            <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>Current Rent</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 900 }}>₹{activeBooking.rent.toLocaleString()}</span>
                <span style={{ fontSize: '14px', opacity: 0.8, fontWeight: 500 }}> / month</span>
              </div>
              <Link to={`/student/pg/${activeBooking.hostelId}`} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>View Details</Link>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Active Booking</div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{activeBooking.hostelName}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Move-in: {activeBooking.moveInDate || 'TBD'}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Due Date</div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>01 May 2025</div>
                <div style={{ fontSize: '11px', color: '#ffcfcf', fontWeight: 700 }}>5 days left</div>
              </div>
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
        <div className="section-header">
          <h3 className="section-title-app">Quick Actions</h3>
        </div>
        <div className="quick-action-grid">
          <div className="action-item" onClick={() => navigate('/student/search-results')}>
            <div className="action-icon"><MdSearch /></div>
            <span className="action-label">Find PG</span>
          </div>
          <div className="action-item" onClick={() => navigate('/student/bookings')}>
            <div className="action-icon"><MdCalendarToday /></div>
            <span className="action-label">Bookings</span>
          </div>
          <div className="action-item" onClick={() => navigate('/student/payments')}>
            <div className="action-icon"><MdPayments /></div>
            <span className="action-label">Payments</span>
          </div>
          <div className="action-item" onClick={() => navigate('/student/complaints')}>
            <div className="action-icon"><MdMessage /></div>
            <span className="action-label">Support</span>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="section-header">
          <h3 className="section-title-app">My Bookings</h3>
          <Link to="/student/bookings" className="view-all-link">View All</Link>
        </div>
        
        {activeBooking ? (
          <div className="app-card" style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '12px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={activeBooking.hostelImage || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>{activeBooking.hostelName}</h4>
                <span className={`status-badge status-${activeBooking.status?.toLowerCase() || 'confirmed'}`}>{activeBooking.status || 'Confirmed'}</span>
              </div>
              <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 8px' }}>{activeBooking.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>₹{activeBooking.rent.toLocaleString()}<span style={{ fontSize: '10px', color: '#999', fontWeight: 400 }}> / month</span></div>
                <div style={{ fontSize: '10px', color: '#999' }}>Move-in: <span style={{ fontWeight: 700, color: '#444' }}>{activeBooking.moveInDate || '01 May 2025'}</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="app-card" style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '24px' }}>No bookings yet</div>
        )}

        {/* Rent Payments Section */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3 className="section-title-app">Rent Payments</h3>
          <Link to="/student/payments" className="view-all-link">View All</Link>
        </div>
        <div className="app-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '12px' }}>May 2025</div>
            <span className="status-badge status-confirmed" style={{ fontSize: '9px' }}>Paid</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>₹{activeBooking?.rent || '6,500'}</div>
            <div style={{ fontSize: '10px', color: '#999' }}>Paid on 28 Apr 2025</div>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;

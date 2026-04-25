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
  MdExitToApp
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
    <StudentLayout title="My Hostel" subtitle={activeBooking ? "Residence Control Center" : "Find your perfect stay"}>
      {!activeBooking ? (
        <div style={{ background: 'white', borderRadius: '24px', padding: '80px 24px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(238,46,36,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
            <MdHotel size={48} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>No Active Booking</h2>
          <p style={{ color: '#666', marginBottom: '32px' }}>Browse through our premium selections to get started.</p>
          <button className="btn btn-primary" onClick={() => navigate('/student/search')}>Explore PGs <MdArrowForward /></button>
        </div>
      ) : (
        <div className="my-hostel-container" style={{ width: '100%' }}>
          
          <div className="hostel-card" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
            <div className="mobile-stack">
              
              <div className="pg-hero-img-container">
                <img 
                  src={activeBooking.hostelImage} 
                  alt={activeBooking.hostelName}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
                  <Badge status={activeBooking.status} />
                </div>
              </div>

              <div className="mobile-width-100" style={{ flex: '1', padding: '24px 40px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>{activeBooking.hostelName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '14px' }}>
                    <MdLocationOn color="#EE2E24" size={18} /> {activeBooking.location}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f9fa', padding: '12px', borderRadius: '16px' }}>
                    <div style={{ background: '#EE2E24', color: 'white', padding: '8px', borderRadius: '10px', display: 'flex' }}><MdHotel size={18} /></div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Room Type</div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{activeBooking.roomType}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f9fa', padding: '12px', borderRadius: '16px' }}>
                    <div style={{ background: '#EE2E24', color: 'white', padding: '8px', borderRadius: '10px', display: 'flex' }}><MdRestaurant size={18} /></div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Food</div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{activeBooking.foodAvailable ? 'Available' : 'Not Available'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fcfcfc', borderRadius: '20px', padding: '20px', border: '1px solid #f0f0f0', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Rent</div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#EE2E24' }}>₹{activeBooking.rent}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Payment</div>
                      <Badge status={activeBooking.paymentStatus} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Due Date</div>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>{activeBooking.nextDueDate || 'Pending'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handlePayRent} 
                    disabled={activeBooking.paymentStatus === 'paid'}
                    style={{ flex: '1.5 1 160px', background: activeBooking.paymentStatus === 'paid' ? '#f0f0f0' : '#EE2E24', color: activeBooking.paymentStatus === 'paid' ? '#999' : 'white' }}
                  >
                    <MdPayments size={18} /> {activeBooking.paymentStatus === 'paid' ? 'Paid' : 'Pay Rent'}
                  </button>
                  <button className="btn btn-outline" onClick={() => navigate(`/student/pg/${activeBooking.hostelId}`)} style={{ flex: '1 1 120px' }}>
                    <MdInfo size={18} /> Details
                  </button>
                  
                  {/* Cancel Option for Pending/Confirmed */}
                  {(activeBooking.status === 'pending' || activeBooking.status === 'confirmed') && (
                    <button className="btn" onClick={handleCancelBooking} style={{ flex: '1 1 100px', color: '#EE2E24', background: '#FFF1F0', border: '1px solid #FFA39E' }}>
                      <MdCancel size={18} /> Cancel
                    </button>
                  )}

                  {/* Leave Option for Checked-in */}
                  {activeBooking.status === 'checked-in' && (
                    <button className="btn" onClick={handleLeaveHostel} style={{ flex: '1 1 120px', color: '#4338CA', background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                      <MdExitToApp size={18} /> Leave Hostel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
              <h4 style={{ fontWeight: 800, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(238,46,36,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EE2E24' }}>
                  <MdHotel size={20} />
                </div>
                Stay Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f9f9f9' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Booking Date</span>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{activeBooking.createdAt?.toDate ? activeBooking.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Move-in Date</span>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{activeBooking.moveInDate || 'Not set'}</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #EE2E24, #FF5C54)', padding: '24px', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <MdPayments size={120} style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.1 }} />
              <h4 style={{ fontWeight: 800, fontSize: '16px', marginBottom: '8px' }}>Rent Details</h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '13px', opacity: 0.8 }}>Total:</span>
                <span style={{ fontSize: '24px', fontWeight: 900 }}>₹{activeBooking.rent}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </StudentLayout>
  );
};

export default StudentDashboard;

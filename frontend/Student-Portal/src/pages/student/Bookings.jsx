import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { MdHotel, MdLocationOn, MdCalendarToday, MdPayments, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      // Sort manually to avoid index requirement
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setBookings(data);
      setLoading(false);
    }, (error) => {
      console.error("Bookings Fetch Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <StudentLayout title="My Bookings">
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '40px' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading your bookings...</div>
        ) : bookings.length > 0 ? (
          <div className="bookings-grid">
            {bookings.map(b => (
              <div key={b.id} className="app-card booking-card-responsive" style={{ display: 'flex', gap: '12px', padding: '12px', alignItems: 'center' }}>
                <div className="booking-img-container" style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <img src={b.hostelImage || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '6px', left: '6px' }}>
                    <span className={`status-badge status-${b.status?.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1a1a1a' }}>{b.hostelName}</h3>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', color: '#888', fontSize: '11px', marginTop: '2px' }}>
                    <MdLocationOn size={12} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} /> 
                    <span style={{ lineHeight: 1.4 }}>{b.location}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--primary)' }}>₹{b.rent?.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: '#999', fontWeight: 600 }}>{b.moveInDate || 'TBD'}</div>
                  </div>

                  <div className="booking-card-actions" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <Link to={`/student/pg/${b.hostelId}`} style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '12px', background: '#f8f9fa', borderRadius: '10px', fontWeight: 700, color: '#444', border: '1px solid #eee' }}>Details</Link>
                    {b.status?.toLowerCase() === 'confirmed' && (
                      <Link to="/student/payments" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '12px', background: 'var(--primary)', color: 'white', borderRadius: '10px', fontWeight: 700, boxShadow: '0 4px 12px rgba(238,46,36,0.15)' }}>Pay Now</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="app-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <MdHotel size={64} color="#eee" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No bookings found</h3>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>You haven't made any bookings yet.</p>
            <Link to="/student/search-results" className="btn btn-primary" style={{ marginTop: '24px' }}>Explore PGs</Link>
          </div>
        )}

      </div>
    </StudentLayout>
  );
};

export default Bookings;

import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { MdHotel, MdLocationOn, MdCalendarToday, MdPayments, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Bookings = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userData.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userData]);

  return (
    <StudentLayout title="My Bookings">
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '40px' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading your bookings...</div>
        ) : bookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(b => (
              <div key={b.id} className="app-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '140px' }}>
                  <img src={b.hostelImage || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{b.hostelName}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px', marginTop: '4px' }}>
                    <MdLocationOn color="var(--primary)" /> {b.location}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>Move-in Date</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MdCalendarToday size={14} color="#666" /> {b.moveInDate || 'TBD'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>Monthly Rent</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MdPayments size={14} color="#666" /> ₹{b.rent?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <Link to={`/student/pg/${b.hostelId}`} className="btn btn-outline" style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '10px' }}>Property Details</Link>
                    {b.status === 'confirmed' && (
                      <Link to="/student/payments" className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '10px' }}>Pay Rent</Link>
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

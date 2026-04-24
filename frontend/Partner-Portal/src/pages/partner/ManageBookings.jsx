import React, { useState, useEffect } from 'react';
import PartnerSidebar from '../../components/layout/PartnerSidebar';
import Topbar from '../../components/layout/Topbar';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { MdCheck, MdClose, MdAccessTime, MdPerson, MdPhone, MdHome } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const ManageBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch all bookings for now to ensure they show up as requested
    // In production, we would filter by hostelId if we had a mapping of partner to hostels
    const q = query(collection(db, 'bookings'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Filter by status to show relevant ones first or sort them
      setBookings(bookingsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      toast.success(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="badge badge-verified">Confirmed</span>;
      case 'pending': return <span className="badge badge-amber">Pending Approval</span>;
      case 'checked-in': return <span className="badge badge-blue">Checked In</span>;
      case 'cancelled': return <span className="badge badge-red">Cancelled</span>;
      default: return <span className="badge badge-grey">{status}</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <PartnerSidebar />
      <div className="main-content">
        <Topbar title="Manage Bookings" subtitle="Review and manage student booking requests" />
        <div className="page-content animate-fadeIn">
          
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 700 }}>Recent Booking Requests</h3>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No bookings found.</div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student Details</th>
                      <th>Hostel / Room</th>
                      <th>Stay Period</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar avatar-sm" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                              <MdPerson />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>Student ID: {b.userId?.substring(0, 8)}...</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>Booked on: {b.createdAt?.toDate()?.toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.hostelName}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{b.roomType} | ₹{b.rent}/mo</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                            <MdAccessTime size={14} color="#666" />
                            <span>Move-in: {b.moveInDate}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '11px', 
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: b.paymentStatus === 'paid' ? '#E7F7EF' : '#FEF2F2',
                            color: b.paymentStatus === 'paid' ? '#0D9488' : '#DC2626'
                          }}>
                            {b.paymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td>{getStatusBadge(b.status)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {b.status === 'pending' && (
                              <>
                                <button 
                                  className="btn btn-sm" 
                                  style={{ background: '#E7F7EF', color: '#0D9488', padding: '6px 12px' }}
                                  onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                >
                                  <MdCheck /> Confirm
                                </button>
                                <button 
                                  className="btn btn-sm" 
                                  style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 12px' }}
                                  onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                >
                                  <MdClose /> Reject
                                </button>
                              </>
                            )}
                            {b.status === 'confirmed' && (
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleUpdateStatus(b.id, 'checked-in')}
                              >
                                Check-in
                              </button>
                            )}
                            {b.status === 'checked-in' && (
                              <span style={{ color: '#0D9488', fontSize: '13px', fontWeight: 600 }}>Stay Active</span>
                            )}
                            {b.status === 'cancelled' && (
                              <span style={{ color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>Rejected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageBookings;

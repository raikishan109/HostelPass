import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PartnerLayout from '../../components/layout/PartnerLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { MdEdit, MdDelete, MdAdd, MdStar, MdRestaurant, MdVerified } from 'react-icons/md';
import toast from 'react-hot-toast';

const ManageListings = () => {
  const { user } = useAuth();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'hostels'), where('partnerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pgsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPgs(pgsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteDoc(doc(db, 'hostels', id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <PartnerLayout title="My Listings" subtitle={`${pgs.length} active listings`}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link to="/partner/add-listing" className="btn btn-primary btn-sm"><MdAdd /> Add New PG</Link>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading your listings...</div>
      ) : pgs.length === 0 ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
          <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No Listings Found</h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>You haven't added any PG listings yet. Start by adding your first property!</p>
          <Link to="/partner/add-listing" className="btn btn-primary"><MdAdd /> Add New PG</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pgs.map(pg => (
            <div key={pg.id} className="mobile-stack" style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="pg-hero-img-container" style={{ width: 120, height: 100, borderRadius: '16px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', flexShrink: 0, overflow: 'hidden' }}>
                {pg.images?.[0] ? <img src={pg.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
              </div>
              <div style={{ flex: 1, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-dark)' }}>{pg.name}</div>
                  {pg.verified && <span className="badge badge-verified" style={{ borderRadius: '20px' }}><MdVerified size={10} /> Verified</span>}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '12px' }}>{pg.location}, {pg.city}</div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}><strong style={{ color: 'var(--primary)', fontSize: '18px' }}>₹{pg.rent?.toLocaleString()}</strong>/mo</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', background: '#FFF7ED', color: '#C2410C', padding: '4px 8px', borderRadius: '8px' }}><MdStar color="#f59e0b" size={14} /> {pg.rating || 0}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', background: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '8px' }}><MdRestaurant color="#ea580c" size={14} /> Mess {pg.messRating || 0}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }} className="mobile-width-100">
                <Link to={`/partner/listings/edit/${pg.id}`} className="btn btn-outline btn-sm" style={{ flex: 1, height: '40px', borderRadius: '12px' }}><MdEdit /> Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pg.id)} style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PartnerLayout>
  );
};

export default ManageListings;

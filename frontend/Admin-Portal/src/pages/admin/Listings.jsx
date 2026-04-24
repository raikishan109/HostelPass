import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { MdVerified, MdDelete, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminListings = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'hostels'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pgsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPgs(pgsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = pgs.filter(p => 
    p.name?.toLowerCase().includes(queryText.toLowerCase()) || 
    p.location?.toLowerCase().includes(queryText.toLowerCase()) ||
    p.city?.toLowerCase().includes(queryText.toLowerCase())
  );

  const toggleVerified = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'hostels', id), { verified: !currentStatus });
      toast.success('Verification status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await deleteDoc(doc(db, 'hostels', id));
      toast.success('Listing removed');
    } catch (error) {
      toast.error('Failed to remove listing');
    }
  };

  return (
    <AdminLayout title="PG Listings" subtitle={`${pgs.length} total listings`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 16px', marginBottom: '20px' }}>
        <MdSearch color="var(--text-light)" />
        <input 
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }} 
          placeholder="Search listings by name, area or city..." 
          value={queryText} 
          onChange={e => setQueryText(e.target.value)} 
        />
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading properties...</div>
      ) : (
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table table-to-cards">
            <thead><tr><th>PG</th><th className="pc-only">Location</th><th className="pc-only">Type</th><th className="pc-only">Rent</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(pg => (
                <tr key={pg.id}>
                  <td data-label="PG">
                    <div style={{ fontWeight: 600 }}>{pg.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{pg.location}, {pg.city}</div>
                  </td>
                  <td data-label="Type" className="pc-only"><span className="badge badge-grey">{pg.type}</span></td>
                  <td data-label="Rent" style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{pg.rent?.toLocaleString()}</td>
                  <td data-label="Rating">{pg.rating || 0} ⭐</td>
                  <td data-label="Status">{pg.verified ? <span className="badge badge-verified">Verified</span> : <span className="badge badge-warning">Unverified</span>}</td>
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => toggleVerified(pg.id, pg.verified)}>
                        {pg.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }} onClick={() => remove(pg.id)}>
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No listings found matching your search.</div>}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminListings;

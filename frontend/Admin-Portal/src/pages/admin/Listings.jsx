import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { MOCK_PGS } from '../../data/mockData';
import { MdVerified, MdDelete, MdVisibility, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminListings = () => {
  const [pgs, setPgs] = useState(MOCK_PGS);
  const [query, setQuery] = useState('');
  const filtered = pgs.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()));

  const toggleVerified = id => {
    setPgs(p => p.map(x => x.id === id ? { ...x, verified: !x.verified } : x));
    toast.success('Verification status updated');
  };
  const remove = id => { setPgs(p => p.filter(x => x.id !== id)); toast.success('Listing removed'); };

  return (
    <AdminLayout title="PG Listings" subtitle={`${pgs.length} total listings`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 16px', marginBottom: '20px' }}>
        <MdSearch color="var(--text-light)" />
        <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }} placeholder="Search listings..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>PG</th><th className="pc-only">Location</th><th className="pc-only">Type</th><th className="pc-only">Rent</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(pg => (
              <tr key={pg.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{pg.name}</div>
                  <div className="mobile-only" style={{ fontSize: '11px', color: 'var(--text-light)' }}>{pg.location}</div>
                </td>
                <td className="pc-only" style={{ fontSize: '13px', color: 'var(--text-light)' }}>{pg.location}</td>
                <td className="pc-only"><span className="badge badge-grey">{pg.type}</span></td>
                <td className="pc-only" style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{pg.rent.toLocaleString()}</td>
                <td>{pg.rating} ⭐</td>
                <td>{pg.verified ? <span className="badge badge-verified"><MdVerified size={10} /> Verified</span> : <span className="badge badge-warning">Unverified</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => toggleVerified(pg.id)}>
                      <MdVerified size={12} /> <span className="pc-only">{pg.verified ? 'Unverify' : 'Verify'}</span>
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => remove(pg.id)}>
                      <MdDelete size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminListings;

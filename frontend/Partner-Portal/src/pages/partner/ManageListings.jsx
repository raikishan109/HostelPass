import React from 'react';
import { Link } from 'react-router-dom';
import PartnerLayout from '../../components/layout/PartnerLayout';
import { MOCK_PGS } from '../../data/mockData';
import { MdEdit, MdDelete, MdAdd, MdStar, MdRestaurant, MdVerified } from 'react-icons/md';
import toast from 'react-hot-toast';

const ManageListings = () => {
  const pgs = MOCK_PGS.slice(0, 2);

  return (
    <PartnerLayout title="My Listings" subtitle={`${pgs.length} active listings`}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link to="/partner/add-listing" className="btn btn-primary btn-sm"><MdAdd /> Add New PG</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {pgs.map(pg => (
          <div key={pg.id} className="flex-mobile-col" style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '12px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>🏠</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{pg.name}</div>
                {pg.verified && <span className="badge badge-verified"><MdVerified size={10} /> Verified</span>}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '8px' }}>{pg.location}</div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px' }}><strong style={{ color: 'var(--primary)' }}>₹{pg.rent.toLocaleString()}</strong>/mo</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}><MdStar color="#f59e0b" size={14} />{pg.rating}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}><MdRestaurant color="#ea580c" size={14} />Mess {pg.messRating}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>{pg.reviewCount} reviews</span>
                <span style={{ fontSize: '13px', color: pg.complaintCount > 0 ? 'var(--danger)' : 'var(--verified-color)' }}>{pg.complaintCount} complaints</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link to={`/partner/listings/edit/${pg.id}`} className="btn btn-outline btn-sm"><MdEdit /> Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={() => toast.error('Delete functionality requires Firebase')}><MdDelete /></button>
            </div>
          </div>
        ))}
      </div>
    </PartnerLayout>
  );
};

export default ManageListings;

import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { MOCK_REVIEWS, MOCK_PGS } from '../../data/mockData';
import { MdDelete, MdFlag, MdStar, MdRestaurant } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const remove = id => { setReviews(r => r.filter(x => x.id !== id)); toast.success('Review removed'); };

  return (
    <AdminLayout title="Review Management" subtitle={`${reviews.length} total reviews`}>
      <div className="table-wrapper">
        <table className="table table-to-cards">
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>PG</th>
              <th>Overall</th>
              <th>Mess</th>
              <th>Review Excerpt</th>
              <th className="pc-only">Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => {
              const pg = MOCK_PGS.find(p => p.id === r.pgId);
              return (
                <tr key={r.id}>
                  <td data-label="Reviewer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar avatar-sm">{r.userName.charAt(0)}</div>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{r.userName}</span>
                    </div>
                  </td>
                  <td data-label="PG" style={{ fontSize: '13px', color: 'var(--text-light)' }}>{pg?.name}</td>
                  <td data-label="Rating">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MdStar color="#f59e0b" size={13} />{r.overallRating}
                    </span>
                  </td>
                  <td data-label="Food">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MdRestaurant color="#ea580c" size={13} />{r.messRating}
                    </span>
                  </td>
                  <td data-label="Comment" style={{ maxWidth: '200px', fontSize: '13px', color: 'var(--text-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.text}
                  </td>
                  <td className="pc-only" data-label="Date" style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td data-label="Action">
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--warning)' }} title="Flag as suspicious" onClick={() => toast.success('Review flagged for review')}>
                        <MdFlag size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => remove(r.id)}>
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;

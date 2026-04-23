import React from 'react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import Topbar from '../../components/layout/Topbar';
import { MOCK_REVIEWS, MOCK_PGS } from '../../data/mockData';
import { MdStar, MdRestaurant, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

const MyReviews = () => {
  const reviews = MOCK_REVIEWS.slice(0, 2);

  return (
    <div className="dashboard-layout">
      <StudentSidebar />
      <div className="main-content">
        <Topbar title="My Reviews" subtitle={`${reviews.length} reviews written`} />
        <div className="page-content animate-fadeIn">
          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✍️</div>
              <h3>No reviews yet</h3>
              <p>Visit a PG and share your experience to help other students!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map(r => {
                const pg = MOCK_PGS.find(p => p.id === r.pgId);
                return (
                  <div key={r.id} className="review-card">
                    <div className="review-header">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{pg?.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge badge-primary"><MdStar size={10} /> {r.overallRating}/5</span>
                        <span className="badge" style={{ background: '#fff7ed', color: '#c2410c' }}><MdRestaurant size={10} /> Mess {r.messRating}/5</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Review deleted')} style={{ padding: '6px', color: 'var(--danger)' }}>
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                    <p className="review-text">"{r.text}"</p>
                    <div className="review-ratings">
                      <span className="review-rating-item"><span className="review-rating-label">Cleanliness:</span> {r.cleanlinessRating}/5</span>
                      <span className="review-rating-item"><span className="review-rating-label">Security:</span> {r.securityRating}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviews;

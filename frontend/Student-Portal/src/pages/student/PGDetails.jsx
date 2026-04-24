import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import ReviewModal from '../../components/common/ReviewModal';
import { MOCK_PGS, MOCK_REVIEWS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdLocationOn, MdVerified, MdStar, MdRestaurant, MdWifi, MdFavorite, MdFavoriteBorder,
  MdPhone, MdReport, MdRateReview, MdArrowBack, MdCheckCircle, MdOutlineBedroomParent
} from 'react-icons/md';

const RatingBar = ({ label, value, color = 'var(--primary)' }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
      <span style={{ color: 'var(--text-medium)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value.toFixed(1)}</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${(value / 5) * 100}%`, background: color }} />
    </div>
  </div>
);

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const pg = MOCK_PGS.find(p => p.id === id) || MOCK_PGS[0];
  const reviews = MOCK_REVIEWS.filter(r => r.pgId === id);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReview, setShowReview] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaint, setComplaint] = useState({ category: '', text: '' });

  const handleReviewSubmit = (data) => {
    toast.success('Review submitted successfully!');
    setShowReview(false);
  };

  const handleComplaint = () => {
    if (!complaint.text.trim()) { toast.error('Please describe the issue'); return; }
    toast.success('Complaint submitted. We\'ll look into it!');
    setShowComplaint(false);
    setComplaint({ category: '', text: '' });
  };

  if (!pg) return <div className="empty-state"><h3>PG Not Found</h3></div>;

  return (
    <StudentLayout title={pg.name}>
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        <MdArrowBack /> Back to Search
      </button>

      {/* Hero Image Area */}
      <div className="pg-details-hero" style={{ background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)', borderRadius: '20px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <span style={{ fontSize: '72px', opacity: 0.3 }}>🏠</span>
        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
          {pg.verified && <span className="badge badge-verified"><MdVerified size={11} /> Verified PG</span>}
          <span className="badge badge-grey">{pg.type}</span>
        </div>
        <button style={{ position: 'absolute', top: '16px', right: '16px', width: 40, height: 40, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '18px' }}
          onClick={() => setIsFav(!isFav)}>
          {isFav ? <MdFavorite color="var(--primary)" /> : <MdFavoriteBorder />}
        </button>
      </div>

      <div className="pg-details-grid">
        {/* Main Column */}
        <div className="pg-details-main">
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', marginBottom: '20px' }}>
            <div className="pg-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>{pg.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '14px' }}>
                  <MdLocationOn size={16} />{pg.location}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 'fit-content' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)' }}>₹{pg.rent.toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>per month</div>
              </div>
            </div>

            {/* Ratings Row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fffbeb', padding: '8px 14px', borderRadius: '10px' }}>
                <MdStar color="#f59e0b" /> <span style={{ fontWeight: 700 }}>{pg.rating}</span>
                <span style={{ color: 'var(--text-light)', fontSize: '13px' }}>({pg.reviewCount} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff7ed', padding: '8px 14px', borderRadius: '10px' }}>
                <MdRestaurant color="#ea580c" /> <span style={{ fontWeight: 700 }}>Mess {pg.messRating}</span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: 1.8 }}>{pg.description}</p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {['overview', 'reviews', 'amenities'].map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ marginBottom: '24px' }}>
            {activeTab === 'overview' && (
              <div className="grid-2" style={{ gap: '20px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🍽️ Mess Breakdown</h3>
                  <RatingBar label="Food Variety" value={pg.messRating - 0.1} color="#f59e0b" />
                  <RatingBar label="Hygiene" value={pg.messRating + 0.1} color="var(--verified-color)" />
                  <RatingBar label="Timings" value={pg.messRating - 0.2} color="var(--info)" />
                </div>
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Overall Stats</h3>
                  <RatingBar label="Cleanliness" value={4.0} color="var(--verified-color)" />
                  <RatingBar label="Security" value={4.2} color="var(--info)" />
                  <RatingBar label="Value" value={3.8} color="#f59e0b" />
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700 }}>Reviews ({reviews.length})</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowReview(true)}>
                    <MdRateReview /> Write Review
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {reviews.map(r => (
                    <div key={r.id} className="review-card">
                      <div className="review-header">
                        <div className="review-author">
                          <div className="avatar avatar-sm">{r.userName.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.userName}</div>
                            <div className="review-meta">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                          </div>
                        </div>
                        <span className="badge badge-primary"><MdStar size={10} /> {r.overallRating}</span>
                      </div>
                      <p className="review-text">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Available Amenities</h3>
                <div className="amenities-grid">
                  {pg.amenities.map(a => (
                    <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--bg)', borderRadius: '10px' }}>
                      <MdCheckCircle color="var(--verified-color)" size={16} />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="pg-details-sidebar">
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Contact PG Owner</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="avatar avatar-md">{pg.partnerName.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{pg.partnerName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Verified Owner</div>
              </div>
            </div>
            <a href={`tel:${pg.phone}`} className="btn btn-primary w-full" style={{ marginBottom: '10px' }}>
              <MdPhone /> Call Owner
            </a>
            <button className="btn btn-outline w-full" onClick={() => setShowReview(true)}>
              <MdRateReview /> Write Review
            </button>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
              <button className="btn btn-ghost w-full btn-sm" onClick={() => setShowComplaint(true)}>
                <MdReport /> Report PG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReview && <ReviewModal pgName={pg.name} pgId={pg.id} onClose={() => setShowReview(false)} onSubmit={handleReviewSubmit} />}

      {showComplaint && (
        <div className="modal-overlay" onClick={() => setShowComplaint(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">File a Complaint</div>
              <button className="modal-close" onClick={() => setShowComplaint(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Issue Category</label>
                <select className="form-select" value={complaint.category} onChange={e => setComplaint(c => ({ ...c, category: e.target.value }))}>
                  <option value="">Select category...</option>
                  <option>Food / Mess Quality</option>
                  <option>Cleanliness / Hygiene</option>
                  <option>Safety / Security</option>
                  <option>WiFi / Internet</option>
                  <option>Owner Behaviour</option>
                  <option>Billing Issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Describe the Issue</label>
                <textarea className="form-input form-textarea" placeholder="Describe the problem in detail..." value={complaint.text} onChange={e => setComplaint(c => ({ ...c, text: e.target.value }))} rows={4} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowComplaint(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleComplaint}><MdReport /> Submit Complaint</button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default PGDetails;

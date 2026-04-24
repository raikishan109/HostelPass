import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdRestaurant, MdVerified, MdFavorite, MdFavoriteBorder, MdStar, MdHotel } from 'react-icons/md';

const StarRating = ({ value, size = 14 }) => {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star ${i <= Math.round(value) ? 'filled' : 'empty'}`} style={{ fontSize: size }}>
          ★
        </span>
      ))}
    </span>
  );
};

const PGCard = ({ pg, isFavorite, onToggleFavorite, linkPrefix = '/student/pg' }) => {
  const navigate = useNavigate();

  const handleFav = (e) => {
    e.stopPropagation();
    onToggleFavorite && onToggleFavorite(pg.id);
  };

  return (
    <div className="pg-card" onClick={() => navigate(`${linkPrefix}/${pg.id}`)} style={{
      borderRadius: '4px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div className="pg-card-image" style={{ height: '220px', borderRadius: '4px 4px 0 0' }}>
        {pg.images && pg.images.length > 0
          ? <img 
              src={pg.images[0]} 
              alt={pg.name} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="font-size: 48px; opacity: 0.2">🏠</span>';
              }}
              style={{ borderRadius: '4px 4px 0 0', width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          : <span style={{ fontSize: '48px', opacity: 0.2 }}>🏠</span>
        }
        {pg.verified && (
          <div className="pg-card-badge">
            <span className="badge" style={{ background: 'white', color: 'var(--verified-color)', border: '1px solid var(--verified-color)', borderRadius: '2px', fontWeight: 700 }}>
              <MdVerified size={10} /> VERIFIED
            </span>
          </div>
        )}
      </div>

      <div className="pg-card-body" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="pg-card-name" style={{ fontSize: '18px', fontWeight: 800 }}>{pg.name}</div>
            <div className="pg-card-location" style={{ marginBottom: '4px' }}>
              <MdLocationOn size={14} color="var(--primary)" /> {pg.location}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-medium)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <MdHotel size={14} color="#666" /> {pg.roomOptions}
            </div>
          </div>
          <div className="rating-chip" style={{ background: 'var(--verified-color)', color: 'white', borderRadius: '4px', padding: '4px 8px' }}>
            {pg.rating?.toFixed(1) || '—'} <MdStar size={14} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
           <span style={{ fontSize: '12px', color: 'var(--text-light)', border: '1px solid #eee', padding: '2px 8px', borderRadius: '2px' }}>{pg.type}</span>
           <span style={{ fontSize: '12px', color: '#c2410c', background: '#fff7ed', padding: '2px 8px', borderRadius: '2px', fontWeight: 600 }}>Mess {pg.messRating}★</span>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-dark)' }}>₹{pg.rent?.toLocaleString()}</span>
          <span style={{ fontSize: '14px', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{(pg.rent * 1.2).toLocaleString()}</span>
          <span style={{ fontSize: '14px', color: '#f97316', fontWeight: 700 }}>20% OFF</span>
        </div>
      </div>
    </div>
  );
};

export default PGCard;

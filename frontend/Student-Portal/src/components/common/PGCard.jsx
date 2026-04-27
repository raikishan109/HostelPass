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
    <div className="app-card" onClick={() => navigate(`${linkPrefix}/${pg.id}`)} style={{
      display: 'flex', gap: '16px', padding: '12px', cursor: 'pointer', position: 'relative',
      border: '1px solid #f2f2f2'
    }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <img 
          src={pg.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400'} 
          alt={pg.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {pg.verified && (
          <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'white', color: '#1AB64F', borderRadius: '4px', padding: '2px 4px', fontSize: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MdVerified size={10} /> VERIFIED
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#1a1a1a' }}>{pg.name}</h4>
          <button 
            onClick={handleFav} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: isFavorite ? 'var(--primary)' : '#ddd' }}
          >
            {isFavorite ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
          </button>
        </div>
        
        <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <MdLocationOn size={12} /> {pg.location || pg.city}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MdStar size={14} color="#f59e0b" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#333' }}>{pg.rating || (4.0 + (pg.id?.charCodeAt(0) % 10) / 10).toFixed(1)}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#aaa' }}>({pg.reviewsCount || (pg.id?.charCodeAt(1) % 200) + 50})</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#222' }}>
            ₹{pg.rent?.toLocaleString()} <span style={{ fontSize: '10px', color: '#999', fontWeight: 400 }}>/ mo</span>
          </div>
          <button className="pg-card-btn" style={{ 
            background: 'var(--primary)', color: 'white', border: 'none', 
            padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800,
            cursor: 'pointer'
          }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PGCard;

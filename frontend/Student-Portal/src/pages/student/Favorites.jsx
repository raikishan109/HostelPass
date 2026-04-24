import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import PGCard from '../../components/common/PGCard';
import { MOCK_PGS } from '../../data/mockData';
import { MdFavorite } from 'react-icons/md';

const Favorites = () => {
  const [favorites, setFavorites] = useState(['pg1', 'pg2', 'pg5']);
  const favPGs = MOCK_PGS.filter(p => favorites.includes(p.id));
  const toggleFav = id => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <StudentLayout title="Saved PGs" subtitle={`${favPGs.length} PGs saved`}>
      {favPGs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h3>No saved PGs yet</h3>
          <p>Browse PGs and tap the heart icon to save your favorites here.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'var(--primary-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MdFavorite color="var(--primary)" />
            <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 500 }}>
              You have {favPGs.length} saved PG{favPGs.length > 1 ? 's' : ''}. Compare and choose the best one!
            </span>
          </div>
          <div className="grid-3">
            {favPGs.map(pg => <PGCard key={pg.id} pg={pg} isFavorite={true} onToggleFavorite={toggleFav} />)}
          </div>
        </>
      )}
    </StudentLayout>
  );
};

export default Favorites;

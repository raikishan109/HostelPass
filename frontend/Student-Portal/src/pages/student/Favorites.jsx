import React, { useState } from 'react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import Topbar from '../../components/layout/Topbar';
import PGCard from '../../components/common/PGCard';
import { MOCK_PGS } from '../../data/mockData';
import { MdFavorite } from 'react-icons/md';

const Favorites = () => {
  const [favorites, setFavorites] = useState(['pg1', 'pg2', 'pg5']);
  const favPGs = MOCK_PGS.filter(p => favorites.includes(p.id));
  const toggleFav = id => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <div className="dashboard-layout">
      <StudentSidebar />
      <div className="main-content">
        <Topbar title="Saved PGs" subtitle={`${favPGs.length} PGs saved`} />
        <div className="page-content animate-fadeIn">
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
        </div>
      </div>
    </div>
  );
};

export default Favorites;

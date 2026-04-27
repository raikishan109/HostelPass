import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import PGCard from '../../components/common/PGCard';
import { CITY_OPTIONS, PG_TYPES } from '../../data/mockData';
import { MdSearch, MdClose, MdTune } from 'react-icons/md';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query as fsQuery, orderBy } from 'firebase/firestore';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const q = fsQuery(collection(db, 'hostels'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPgs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [filters, setFilters] = useState({ type: '', city: '', minRent: '', maxRent: '', minRating: '' });
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const results = useMemo(() => {
    let filtered = [...pgs];
    
    // Radius filter
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    if (lat && lng && radius) {
      filtered = filtered.filter(p => {
        if (!p.coordinates) return false;
        const dist = calculateDistance(Number(lat), Number(lng), p.coordinates.lat, p.coordinates.lng);
        return dist <= Number(radius);
      });
    }

    if (query) filtered = filtered.filter(p => 
      p.name?.toLowerCase().includes(query.toLowerCase()) || 
      p.location?.toLowerCase().includes(query.toLowerCase()) || 
      p.city?.toLowerCase().includes(query.toLowerCase())
    );
    if (filters.type) filtered = filtered.filter(p => p.type === filters.type);
    if (filters.city) filtered = filtered.filter(p => p.city === filters.city);
    if (filters.minRent) filtered = filtered.filter(p => p.rent >= Number(filters.minRent));
    if (filters.maxRent) filtered = filtered.filter(p => p.rent <= Number(filters.maxRent));
    if (filters.minRating) filtered = filtered.filter(p => p.rating >= Number(filters.minRating));
    
    if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'mess') filtered.sort((a, b) => (b.messRating || 0) - (a.messRating || 0));
    else if (sort === 'price_low') filtered.sort((a, b) => (a.rent || 0) - (b.rent || 0));
    else if (sort === 'price_high') filtered.sort((a, b) => (b.rent || 0) - (a.rent || 0));
    
    return filtered;
  }, [query, sort, filters, pgs, searchParams]);

  const clearFilters = () => {
    setFilters({ type: '', city: '', minRent: '', maxRent: '', minRating: '' });
    setSearchParams({});
    setQuery('');
  };
  const hasFilters = Object.values(filters).some(Boolean) || searchParams.has('lat') || query;
  const toggleFav = id => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <StudentLayout title="Explore PGs">
      <div className="animate-fadeIn app-page-container">
        
        {/* Search Bar (App Style) */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <MdSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '20px' }} />
          <input 
            type="text" 
            placeholder="Search by locality, PG name or owner" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', 
              border: '1px solid #f0f0f0', background: 'white', fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)', outline: 'none'
            }}
          />
        </div>

        {/* Category Filters (Horizontal Scroll) */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }} className="no-scrollbar">
          {['All', 'Boys PG', 'Girls PG', 'Hostel'].map(cat => {
            const val = cat === 'All' ? '' : (cat === 'Hostel' ? 'Hostel' : cat.split(' ')[0]);
            const isActive = filters.type === val;
            return (
              <button 
                key={cat}
                onClick={() => setFilter('type', val)}
                style={{
                  padding: '8px 20px', borderRadius: '12px', border: '1px solid',
                  borderColor: isActive ? 'var(--primary)' : '#f0f0f0',
                  background: isActive ? 'var(--primary)' : 'white',
                  color: isActive ? 'white' : '#666',
                  fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            );
          })}
          <button className="btn-icon" style={{ background: '#f8f9fa', borderRadius: '12px', minWidth: '40px', border: '1px solid #eee' }} onClick={() => setShowFilters(true)}>
            <MdTune size={20} color="#333" />
          </button>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>
             {results.length} results found
             {searchParams.get('radius') && <span style={{ color: 'var(--primary)' }}> within 5km</span>}
          </div>
          {hasFilters && (
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Clear All
            </button>
          )}
        </div>

        {/* Results List */}
        <div style={{ paddingBottom: '40px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading PGs...</div>
          ) : results.length > 0 ? (
            results.map(p => (
              <PGCard 
                key={p.id} 
                pg={p} 
                isFavorite={favorites.includes(p.id)} 
                onToggleFavorite={toggleFav} 
              />
            ))
          ) : (
            <div className="app-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No results found</h3>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>Try adjusting your filters or search query.</p>
              <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={clearFilters}>Reset All Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="modal-overlay" onClick={() => setShowFilters(false)} style={{ alignItems: 'flex-end', padding: 0 }}>
          <div className="modal animate-slideUp" onClick={e => e.stopPropagation()} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderRadius: '32px 32px 0 0', maxWidth: '600px' }}>
            <div className="modal-header" style={{ padding: '20px 24px' }}>
              <h3 className="modal-title" style={{ fontSize: '20px' }}>Filters</h3>
              <button className="modal-close" onClick={() => setShowFilters(false)}><MdClose /></button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-select" value={filters.city} onChange={e => setFilter('city', e.target.value)}>
                  <option value="">All Cities</option>
                  {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Sort By</label>
                <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="rating">Top Rated</option>
                  <option value="mess">Best Mess</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ padding: '20px 24px' }}>
              <button className="btn btn-outline w-full" onClick={clearFilters}>Reset All</button>
              <button className="btn btn-primary w-full" onClick={() => setShowFilters(false)}>Show Results</button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default SearchResults;

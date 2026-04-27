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
    <StudentLayout title="Find PGs & Hostels">
      {/* Search + Sort Bar */}
      <div className="search-controls" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 300px', display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 16px', transition: 'border-color 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <MdSearch color="var(--text-light)" />
          <input
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }}
            placeholder="Search by name, location or city..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><MdClose /></button>}
        </div>

        <div className="mobile-full-width" style={{ display: 'flex', gap: '12px', flex: '1 1 300px' }}>
          <select className="form-select" style={{ flex: 1, height: '44px', margin: 0 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="rating">Top Rated</option>
            <option value="mess">Best Mess</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>

          <button 
            className="btn btn-primary" 
            style={{ flex: 1, height: '44px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <MdTune /> Filters {hasFilters && `(${Object.values(filters).filter(Boolean).length})`}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Type</label>
            <select className="form-select" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
              <option value="">All Types</option>
              {PG_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City</label>
            <select className="form-select" value={filters.city} onChange={e => setFilter('city', e.target.value)}>
              <option value="">All Cities</option>
              {CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Rent (₹)</label>
            <input className="form-input" type="number" placeholder="e.g. 5000" value={filters.minRent} onChange={e => setFilter('minRent', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Rent (₹)</label>
            <input className="form-input" type="number" placeholder="e.g. 15000" value={filters.maxRent} onChange={e => setFilter('maxRent', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Rating</label>
            <select className="form-select" value={filters.minRating} onChange={e => setFilter('minRating', e.target.value)}>
              <option value="">Any Rating</option>
              <option value="3">3+</option>
              <option value="3.5">3.5+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
          {hasFilters && (
            <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}><MdClose /> Clear Filters</button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-light)' }}>
        <span style={{ color: 'var(--text-dark)', fontWeight: 700 }}>{results.length}</span> PGs found
        {searchParams.get('lat') && <span> within <span style={{ color: 'var(--primary)', fontWeight: 600 }}>5km</span> of your location</span>}
        {query && <span> for "<span style={{ color: 'var(--primary)', fontWeight: 600 }}>{query}</span>"</span>}
      </div>

      {/* Quick Filter Chips */}
      <div className="filter-chips" style={{ marginBottom: '20px' }}>
        {['All', 'Verified Only', 'With Mess', 'Boys', 'Girls', 'Co-Ed'].map(chip => (
          <button key={chip} className={`filter-chip ${chip === 'All' && !hasFilters ? 'active' : ''}`}
            onClick={() => {
              if (chip === 'Verified Only') setFilter('verified', true);
              else if (['Boys', 'Girls', 'Co-Ed'].includes(chip)) setFilter('type', filters.type === chip ? '' : chip);
              else clearFilters();
            }}
          >{chip}</button>
        ))}
      </div>

      {/* PG Grid */}
      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No PGs Found</h3>
          <p>Try adjusting your search query or filters to find more results.</p>
          <button className="btn btn-primary btn-sm" onClick={clearFilters}>Clear All</button>
        </div>
      ) : (
        <div className="grid-3">
          {results.map(pg => <PGCard key={pg.id} pg={pg} isFavorite={favorites.includes(pg.id)} onToggleFavorite={toggleFav} />)}
        </div>
      )}
    </StudentLayout>
  );
};

export default SearchResults;

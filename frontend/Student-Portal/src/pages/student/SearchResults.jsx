import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import PGCard from '../../components/common/PGCard';
import { MOCK_PGS, CITY_OPTIONS, PG_TYPES } from '../../data/mockData';
import { MdSearch, MdFilterList, MdSort, MdClose, MdTune } from 'react-icons/md';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  React.useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);
  const [filters, setFilters] = useState({ type: '', city: '', minRent: '', maxRent: '', minRating: '' });
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const results = useMemo(() => {
    let pgs = [...MOCK_PGS];
    if (query) pgs = pgs.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()) || p.city.toLowerCase().includes(query.toLowerCase()));
    if (filters.type) pgs = pgs.filter(p => p.type === filters.type);
    if (filters.city) pgs = pgs.filter(p => p.city === filters.city);
    if (filters.minRent) pgs = pgs.filter(p => p.rent >= Number(filters.minRent));
    if (filters.maxRent) pgs = pgs.filter(p => p.rent <= Number(filters.maxRent));
    if (filters.minRating) pgs = pgs.filter(p => p.rating >= Number(filters.minRating));
    if (sort === 'rating') pgs.sort((a, b) => b.rating - a.rating);
    else if (sort === 'mess') pgs.sort((a, b) => b.messRating - a.messRating);
    else if (sort === 'price_low') pgs.sort((a, b) => a.rent - b.rent);
    else if (sort === 'price_high') pgs.sort((a, b) => b.rent - a.rent);
    else if (sort === 'newest') pgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return pgs;
  }, [query, sort, filters]);

  const clearFilters = () => setFilters({ type: '', city: '', minRent: '', maxRent: '', minRating: '' });
  const hasFilters = Object.values(filters).some(Boolean);
  const toggleFav = id => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <StudentLayout title="Find PGs & Hostels">
      {/* Search + Sort Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 16px', minWidth: '200px', transition: 'border-color 0.2s' }}
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

        <select className="form-select" style={{ width: 'auto', minWidth: '180px' }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="rating">Sort: Top Rated</option>
          <option value="mess">Sort: Best Mess</option>
          <option value="price_low">Sort: Price (Low → High)</option>
          <option value="price_high">Sort: Price (High → Low)</option>
          <option value="newest">Sort: Newest</option>
        </select>

        <button className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setShowFilters(!showFilters)}>
          <MdTune /> Filters {hasFilters && `(${Object.values(filters).filter(Boolean).length})`}
        </button>
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
          <button className="btn btn-primary btn-sm" onClick={() => { setQuery(''); clearFilters(); }}>Clear All</button>
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

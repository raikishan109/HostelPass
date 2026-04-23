import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PartnerSidebar from '../../components/layout/PartnerSidebar';
import Topbar from '../../components/layout/Topbar';
import { MOCK_PGS, AMENITY_OPTIONS, CITY_OPTIONS, PG_TYPES } from '../../data/mockData';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack } from 'react-icons/md';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pg = MOCK_PGS.find(p => p.id === id) || MOCK_PGS[0];
  const [form, setForm] = useState({ name: pg.name, type: pg.type, city: pg.city, location: pg.location, rent: pg.rent, deposit: pg.deposit, amenities: [...pg.amenities], description: pg.description });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleAmenity = a => setField('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);
  const save = () => { toast.success('Listing updated successfully!'); navigate('/partner/listings'); };

  return (
    <div className="dashboard-layout">
      <PartnerSidebar />
      <div className="main-content">
        <Topbar title="Edit Listing" />
        <div className="page-content animate-fadeIn">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}><MdArrowBack /> Back</button>
          <div style={{ maxWidth: '720px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)', padding: '32px' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '24px' }}>Edit: {pg.name}</h2>
            <div className="form-group"><label className="form-label">PG Name</label><input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} /></div>
            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e => setField('type', e.target.value)}>{PG_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="form-group"><label className="form-label">City</label><select className="form-select" value={form.city} onChange={e => setField('city', e.target.value)}>{CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Monthly Rent (₹)</label><input className="form-input" type="number" value={form.rent} onChange={e => setField('rent', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Security Deposit (₹)</label><input className="form-input" type="number" value={form.deposit} onChange={e => setField('deposit', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="form-label">Locality</label><input className="form-input" value={form.location} onChange={e => setField('location', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" rows={3} value={form.description} onChange={e => setField('description', e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Amenities</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {AMENITY_OPTIONS.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)} style={{ padding: '8px 12px', borderRadius: '8px', border: '2px solid', borderColor: form.amenities.includes(a) ? 'var(--primary)' : 'var(--border)', background: form.amenities.includes(a) ? 'var(--primary-bg)' : 'white', color: form.amenities.includes(a) ? 'var(--primary)' : 'var(--text-medium)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {form.amenities.includes(a) ? '✓ ' : ''}{a}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}><MdSave /> Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListing;

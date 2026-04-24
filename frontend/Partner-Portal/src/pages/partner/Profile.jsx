import React, { useState } from 'react';
import PartnerLayout from '../../components/layout/PartnerLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEdit, MdSave } from 'react-icons/md';

const PartnerProfile = () => {
  const { userData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: userData?.name || '', email: userData?.email || '', phone: userData?.phone || '', businessName: '', gst: '', experience: '' });
  const save = () => { toast.success('Profile updated!'); setEditing(false); };

  return (
    <PartnerLayout title="Partner Profile">
      <div style={{ maxWidth: '640px' }}>
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="flex-mobile-col" style={{ background: 'linear-gradient(135deg, #1F1F1F, #2d0e0a)', padding: '36px 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="avatar avatar-xl" style={{ background: 'var(--primary)', color: 'white', border: '3px solid rgba(255,255,255,0.3)' }}>
              {(form.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>{form.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>PG Partner · Hostel-Pass</p>
            </div>
          </div>
          <div style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 700 }}>Business Details</h3>
              <button className="btn btn-outline btn-sm" onClick={() => editing ? save() : setEditing(true)}>
                {editing ? <><MdSave /> Save</> : <><MdEdit /> Edit</>}
              </button>
            </div>
            <div className="grid-2" style={{ gap: '16px' }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Business / Company Name', key: 'businessName', type: 'text' },
                { label: 'GST Number', key: 'gst', type: 'text', placeholder: 'Optional' },
                { label: 'Years of Experience', key: 'experience', type: 'number', placeholder: 'e.g. 5' },
              ].map(f => (
                <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" type={f.type} value={form[f.key]} placeholder={f.placeholder || ''} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} disabled={!editing} style={{ background: editing ? 'white' : 'var(--bg)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
};

export default PartnerProfile;

import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEdit, MdSave, MdPerson, MdEmail, MdPhone } from 'react-icons/md';

const StudentProfile = () => {
  const { userData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: userData?.name || '', email: userData?.email || '', phone: userData?.phone || '', college: '', city: '' });
  const save = () => { toast.success('Profile updated!'); setEditing(false); };

  return (
    <StudentLayout title="My Profile">
      <div className="animate-fadeIn" style={{ maxWidth: '640px', width: '100%' }}>
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div className="profile-header" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', padding: '40px 32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="avatar avatar-xl" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '36px', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }}>
                {(form.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="profile-header-text">
                <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: 0 }}>{form.name || 'Student'}</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: '4px 0 0' }}>Student · Hostel-Pass Member</p>
              </div>
            </div>
            <div className="profile-body" style={{ padding: '28px 32px' }}>
              <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                <h3 style={{ fontWeight: 700, margin: 0 }}>Personal Information</h3>
                <button className="btn btn-outline btn-sm" onClick={() => editing ? save() : setEditing(true)} style={{ whiteSpace: 'nowrap' }}>
                  {editing ? <><MdSave /> Save</> : <><MdEdit /> Edit Profile</>}
                </button>
              </div>
              <div className="grid-2" style={{ gap: '16px' }}>
                {[
                  { label: 'Full Name', key: 'name', icon: <MdPerson />, type: 'text', placeholder: 'Your full name' },
                  { label: 'Email', key: 'email', icon: <MdEmail />, type: 'email', placeholder: 'Email address' },
                  { label: 'Phone', key: 'phone', icon: <MdPhone />, type: 'tel', placeholder: '+91 9876543210' },
                  { label: 'College / University', key: 'college', type: 'text', placeholder: 'Your college name' },
                  { label: 'Current City', key: 'city', type: 'text', placeholder: 'e.g. Bangalore' },
                ].map(f => (
                  <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" type={f.type} value={form[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} disabled={!editing} placeholder={f.placeholder} style={{ background: editing ? 'white' : 'var(--bg)', cursor: editing ? 'text' : 'default' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;

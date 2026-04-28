import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  MdEdit, MdSave, MdPerson, MdEmail, MdPhone, MdSchool, 
  MdLocationCity, MdNotifications, MdSecurity, MdHelp, 
  MdLogout, MdChevronRight, MdVerifiedUser, MdFavorite, 
  MdCreditCard, MdHistory, MdSettings
} from 'react-icons/md';

const InfoItem = ({ icon: Icon, label, value, editing, onChange, type = "text" }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #f2f2f2' }}>
    <div style={{ 
      width: '40px', height: '40px', borderRadius: '12px', background: '#f8f9fa', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666',
      fontSize: '20px'
    }}>
      <Icon />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      {editing ? (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          style={{ 
            border: 'none', borderBottom: '2px solid var(--primary)', width: '100%', 
            fontSize: '15px', fontWeight: 700, padding: '4px 0', outline: 'none',
            background: 'transparent', color: '#1a1a1a'
          }}
        />
      ) : (
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' }}>{value || 'Not Set'}</div>
      )}
    </div>
  </div>
);

const MenuAction = ({ icon: Icon, label, color, onClick, subtitle }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
      borderRadius: '16px', cursor: 'pointer'
    }}
  >
    <div style={{ 
      width: '44px', height: '44px', borderRadius: '14px', background: `${color}10`, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: color,
      fontSize: '22px'
    }}>
      <Icon />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>{label}</div>
      {subtitle && <div style={{ fontSize: '11px', color: '#999' }}>{subtitle}</div>}
    </div>
    <MdChevronRight size={20} color="#ccc" />
  </div>
);

const StudentProfile = () => {
  const { userData, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ 
    name: userData?.name || '', 
    email: userData?.email || '', 
    phone: userData?.phone || '', 
    college: userData?.college || 'University of Lucknow', 
    city: userData?.city || 'Lucknow' 
  });

  const save = () => { 
    toast.success('Profile updated successfully!'); 
    setEditing(false); 
  };

  const formatMemberSince = (timestamp) => {
    if (!timestamp) return 'August 2024';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch (e) {
      return 'August 2024';
    }
  };

  return (
    <StudentLayout title="My Profile">
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '100px' }}>
        
        {/* Profile Header Card */}
        <div className="app-card" style={{ 
          padding: '40px 24px', textAlign: 'center', marginBottom: '24px', 
          background: 'white', position: 'relative', overflow: 'hidden',
          border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          {/* Top Right Action */}
          <button 
            onClick={() => editing ? save() : setEditing(true)}
            style={{ 
              position: 'absolute', top: '20px', right: '20px', background: editing ? 'var(--primary)' : 'var(--primary-bg)', 
              color: editing ? 'white' : 'var(--primary)', border: 'none', padding: '8px 16px', 
              borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            {editing ? <><MdSave /> Save</> : <><MdEdit /> Edit</>}
          </button>

          {/* Avatar Section */}
          <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 20px' }}>
            <div className="avatar" style={{ 
              width: '100%', height: '100%', fontSize: '36px', 
              background: 'var(--primary-gradient)', color: 'white', 
              border: '5px solid white', boxShadow: '0 15px 35px rgba(230,0,0,0.2)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
            }}>
              {form.name?.charAt(0) || 'S'}
            </div>
            <div style={{ 
              position: 'absolute', bottom: '5px', right: '5px', 
              width: '28px', height: '28px', background: '#10B981', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', border: '3px solid white', color: 'white' 
            }} title="Verified Student">
              <MdVerifiedUser size={14} />
            </div>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 950, margin: 0, color: '#1a1a1a' }}>{form.name}</h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px', fontWeight: 500 }}>
            Student · Member since {formatMemberSince(userData?.createdAt)}
          </p>

          {/* Stats Bar */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '20px', marginTop: '32px', paddingTop: '24px', 
            borderTop: '1px solid #f8f9fa' 
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#1a1a1a' }}>1</div>
              <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Active PG</div>
            </div>
            <div style={{ borderLeft: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#1a1a1a' }}>4</div>
              <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Reviews</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#1a1a1a' }}>₹0</div>
              <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Dues</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="section-header">
          <h3 className="section-title-app">Personal Details</h3>
        </div>
        <div className="app-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }}>
          <InfoItem icon={MdPerson} label="Full Name" value={form.name} editing={editing} onChange={(val) => setForm({...form, name: val})} />
          <InfoItem icon={MdEmail} label="Email Address" value={form.email} editing={editing} onChange={(val) => setForm({...form, email: val})} type="email" />
          <InfoItem icon={MdPhone} label="Phone Number" value={form.phone} editing={editing} onChange={(val) => setForm({...form, phone: val})} type="tel" />
          <InfoItem icon={MdSchool} label="College / University" value={form.college} editing={editing} onChange={(val) => setForm({...form, college: val})} />
          <InfoItem icon={MdLocationCity} label="Current City" value={form.city} editing={editing} onChange={(val) => setForm({...form, city: val})} />
        </div>

        {/* Quick Actions / Settings */}
        <div className="section-header">
          <h3 className="section-title-app">Account & Settings</h3>
        </div>
        <div className="app-card" style={{ padding: '8px', marginBottom: '32px' }}>
          <MenuAction icon={MdHistory} label="Payment History" subtitle="View all your past transactions" color="#8B5CF6" />
          <MenuAction icon={MdFavorite} label="Saved Properties" subtitle="PGs you shortlisted earlier" color="#EC4899" />
          <MenuAction icon={MdCreditCard} label="Payment Methods" subtitle="Manage your saved cards/UPI" color="#F59E0B" />
          <MenuAction icon={MdNotifications} label="Notifications" subtitle="Alerts for rent & messages" color="#3B82F6" />
          <MenuAction icon={MdSecurity} label="Security & Password" subtitle="Change password & 2FA" color="#10B981" />
          <MenuAction icon={MdSettings} label="App Settings" subtitle="Language & app preferences" color="#64748B" />
        </div>

        {/* Support & Legal */}
        <div className="app-card" style={{ padding: '8px', marginBottom: '32px' }}>
          <MenuAction icon={MdHelp} label="Help & Support Center" color="#1a1a1a" />
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{ 
            width: '100%', padding: '18px', borderRadius: '20px', 
            background: '#fef2f2', border: '1px solid #fee2e2', 
            color: '#ef4444', fontWeight: 900, fontSize: '16px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            gap: '10px', cursor: 'pointer'
          }}
        >
          <MdLogout size={22} /> Log Out from Account
        </button>

        <div style={{ textAlign: 'center', marginTop: '32px', opacity: 0.4, fontSize: '12px', fontWeight: 600 }}>
          HostelPass v2.4.0 · Lucknow, India
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentProfile;


import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEdit, MdSave, MdPerson, MdEmail, MdPhone, MdSchool, MdLocationCity, MdNotifications, MdSecurity, MdHelp, MdLogout } from 'react-icons/md';

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
    toast.success('Profile updated!'); 
    setEditing(false); 
  };

  const formatMemberSince = (timestamp) => {
    if (!timestamp) return '2024';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch (e) {
      return '2024';
    }
  };

  const menuItems = [
    { icon: <MdNotifications />, label: 'Notifications', color: '#3b82f6' },
    { icon: <MdSecurity />, label: 'Security & Privacy', color: '#10b981' },
    { icon: <MdHelp />, label: 'Help & Support', color: '#f59e0b' },
  ];

  return (
    <StudentLayout title="Profile">
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '40px' }}>
        
        {/* Profile Card */}
        <div className="app-card" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '24px', position: 'relative' }}>
          <button 
            onClick={() => editing ? save() : setEditing(true)}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            {editing ? 'Save' : 'Edit'}
          </button>

          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px' }}>
            <div className="avatar avatar-xl" style={{ width: '100%', height: '100%', fontSize: '32px', background: 'var(--primary-gradient)', color: 'white', border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
              {form.name?.charAt(0) || 'U'}
            </div>
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '24px', height: '24px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <MdEdit size={14} color="#666" />
            </div>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>{form.name}</h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Member since {formatMemberSince(userData?.createdAt)}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f8f8f8' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900 }}>1</div>
              <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Booking</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900 }}>4.8</div>
              <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900 }}>₹0</div>
              <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Due</div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="app-card" style={{ padding: '8px', marginBottom: '24px' }}>
          {[
            { icon: <MdEmail />, label: 'Email', value: form.email, key: 'email' },
            { icon: <MdPhone />, label: 'Phone', value: form.phone, key: 'phone' },
            { icon: <MdSchool />, label: 'College', value: form.college, key: 'college' },
            { icon: <MdLocationCity />, label: 'City', value: form.city, key: 'city' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderBottom: i === 3 ? 'none' : '1px solid #f8f8f8' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                {editing ? (
                  <input 
                    type="text" 
                    value={item.value} 
                    onChange={(e) => setForm({...form, [item.key]: e.target.value})}
                    style={{ border: 'none', borderBottom: '1px solid var(--primary)', width: '100%', fontSize: '14px', fontWeight: 700, padding: '2px 0', outline: 'none' }}
                  />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>{item.value || 'Not Set'}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Settings List */}
        <div className="app-card" style={{ padding: '8px', marginBottom: '24px' }}>
          {menuItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', cursor: 'pointer', borderBottom: i === 2 ? 'none' : '1px solid #f8f8f8' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#333', flex: 1 }}>{item.label}</span>
              <div style={{ width: '8px', height: '8px', borderTop: '2px solid #ccc', borderRight: '2px solid #ccc', transform: 'rotate(45deg)' }}></div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <MdLogout /> Log Out
        </button>

      </div>
    </StudentLayout>
  );
};

export default StudentProfile;

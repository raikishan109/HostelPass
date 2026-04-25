import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { MdShield, MdEmail, MdBadge, MdAccessTime } from 'react-icons/md';

const AdminProfile = () => {
  const { user, userData } = useAuth();

  return (
    <AdminLayout title="Admin Profile" subtitle="System Account Management">
      <div className="container-sm animate-fadeIn" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          <div style={{ 
            width: '100px', height: '100px', background: 'var(--primary-bg)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' 
          }}>
            <MdShield size={48} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{userData?.name || 'Super Admin'}</h2>
          <span className="badge badge-primary" style={{ marginBottom: '32px' }}>System Administrator</span>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                <MdBadge size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>FULL NAME</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{userData?.name || 'Administrator'}</div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                <MdEmail size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                <MdAccessTime size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>ACCOUNT TYPE</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Super Admin Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdSchool, MdBusiness, MdAdminPanelSettings, MdArrowBack } from 'react-icons/md';

const LoginPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      desc: 'Find and book your perfect student home',
      icon: <MdSchool />,
      path: '/login/student',
      color: '#EE2E24'
    },
    {
      id: 'partner',
      title: 'PG Partner',
      desc: 'Manage your property and bookings',
      icon: <MdBusiness />,
      path: '/login/partner',
      color: '#008080'
    },
    {
      id: 'admin',
      title: 'Administrator',
      desc: 'System controls and management',
      icon: <MdAdminPanelSettings />,
      path: '/login/admin',
      color: '#333'
    }
  ];

  return (
    <div className="auth-page selection-page">
      <div className="auth-card animate-fadeIn" style={{ maxWidth: '600px' }}>
        <Link to="/" className="back-link"><MdArrowBack /> Back to Home</Link>
        <div className="auth-header">
          <h2>Welcome to Hostel<span style={{ color: 'var(--primary)' }}>Pass</span></h2>
          <p>Please select your login portal to continue</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '32px' }}>
          {roles.map(role => (
            <div
              key={role.id}
              onClick={() => navigate(role.path)}
              className="role-selection-card"
              style={{
                display: 'flex', alignItems: 'center', gap: '20px', padding: '20px',
                borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer',
                transition: 'all 0.2s', background: 'white'
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '12px', background: `${role.color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: role.color
              }}>
                {role.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-dark)' }}>{role.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>{role.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="auth-footer" style={{ marginTop: '32px' }}>
          New to HostelPass? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

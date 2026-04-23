import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdSchool, MdBusiness, MdAdminPanelSettings, MdArrowBack } from 'react-icons/md';

const LoginPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      desc: 'Book your perfect stay in seconds',
      icon: <MdSchool />,
      path: '/login/student',
      color: '#EE2E24',
      gradient: 'linear-gradient(135deg, #EE2E24 0%, #FF5A5F 100%)'
    },
    {
      id: 'partner',
      title: 'Partner Dashboard',
      desc: 'Manage listings & maximize bookings',
      icon: <MdBusiness />,
      path: '/login/partner',
      color: '#008080',
      gradient: 'linear-gradient(135deg, #008080 0%, #20B2AA 100%)'
    },
    {
      id: 'admin',
      title: 'System Admin',
      desc: 'Full control over the ecosystem',
      icon: <MdAdminPanelSettings />,
      path: '/login/admin',
      color: '#1A1A1A',
      gradient: 'linear-gradient(135deg, #1A1A1A 0%, #444444 100%)'
    }
  ];

  return (
    <div className="auth-page selection-page" style={{ 
      background: 'radial-gradient(circle at top right, #fff5f5, #ffffff)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="auth-card animate-fadeIn" style={{ 
        maxWidth: '500px', 
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
      }}>
        <Link to="/" className="back-link" style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '24px' 
        }}>
          <MdArrowBack /> Back to Home
        </Link>
        
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Hostel-Pass</h2>
          <p style={{ color: '#888' }}>Choose your gateway to continue</p>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {roles.map(role => (
            <div
              key={role.id}
              onClick={() => navigate(role.path)}
              className="role-selection-card"
              style={{
                display: 'flex', alignItems: 'center', gap: '20px', padding: '20px',
                borderRadius: '16px', border: '1px solid #eee', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: 'white'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = role.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#eee';
              }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: '14px', background: role.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: 'white', flexShrink: 0
              }}>
                {role.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#1A1A1A' }}>{role.title}</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{role.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="auth-footer" style={{ marginTop: '40px', textAlign: 'center', color: '#888' }}>
          Need help? <Link to="/support" style={{ color: '#EE2E24', fontWeight: 600 }}>Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

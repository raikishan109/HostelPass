import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdArrowBack, MdAdminPanelSettings, MdSecurity } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (!authLoading && user && userRole === 'admin') {
      navigate('/admin');
    }
  }, [user, userRole, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Admin access granted');
      navigate('/admin');
    } catch (error) {
      toast.error('Unauthorized access or invalid admin credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page admin-theme" style={{ 
      background: '#0a0a0a', 
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)' 
    }}>
      <div className="auth-card animate-fadeIn" style={{ 
        background: '#141414', 
        border: '1px solid #333',
        boxShadow: '0 0 40px rgba(238, 46, 36, 0.1)',
        width: '100%',
        maxWidth: '380px',
        padding: '32px'
      }}>
        
        <div className="auth-header" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div className="role-icon admin-icon" style={{ 
            width: '52px', height: '52px', minWidth: '52px', margin: 0, fontSize: '26px',
            background: 'linear-gradient(135deg, #EE2E24, #c4221a)',
            boxShadow: '0 0 20px rgba(238, 46, 36, 0.4)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'
          }}>
            <MdAdminPanelSettings />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Admin Login</h2>
            <p style={{ color: '#666', fontSize: '13px', margin: '2px 0 0' }}>Secure Management</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#888' }}>Admin Email</label>
            <div className="input-with-icon">
              <MdEmail className="input-icon" style={{ color: '#444' }} />
              <input
                type="email"
                className="form-input"
                style={{ 
                  background: '#1f1f1f', 
                  border: '1px solid #333', 
                  color: 'white',
                  paddingLeft: '44px' 
                }}
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#888' }}>Access Password</label>
            <div className="input-with-icon">
              <MdLock className="input-icon" style={{ color: '#444' }} />
              <input
                type="password"
                className="form-input"
                style={{ 
                  background: '#1f1f1f', 
                  border: '1px solid #333', 
                  color: 'white',
                  paddingLeft: '44px' 
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'rgba(238, 46, 36, 0.05)', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            border: '1px solid rgba(238, 46, 36, 0.1)'
          }}>
            <MdSecurity style={{ color: '#EE2E24', minWidth: '18px' }} />
            <span style={{ fontSize: '12px', color: '#888', textAlign: 'left', lineHeight: 1.4 }}>
              Secure IP logging active. Unauthorized attempts are blocked.
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ 
            height: '46px', 
            fontSize: '14px', 
            fontWeight: 800,
            letterSpacing: '0.5px',
            borderRadius: '10px'
          }} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Enter Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

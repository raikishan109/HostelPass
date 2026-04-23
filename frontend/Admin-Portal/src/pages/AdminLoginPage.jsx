import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdArrowBack, MdAdminPanelSettings, MdSecurity } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Admin access granted');
      navigate('/admin');
    } catch (error) {
      toast.error('Unauthorized access or invalid admin credentials');
    } finally {
      setLoading(false);
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
        maxWidth: '400px'
      }}>
        <Link to="/" className="back-link" style={{ color: '#666' }}>
          <MdArrowBack /> Back to Home
        </Link>
        
        <div className="auth-header">
          <div className="role-icon admin-icon" style={{ 
            background: 'linear-gradient(135deg, #EE2E24, #c4221a)',
            boxShadow: '0 0 20px rgba(238, 46, 36, 0.4)',
            color: 'white'
          }}>
            <MdAdminPanelSettings />
          </div>
          <h2 style={{ color: 'white', letterSpacing: '-0.5px' }}>Admin Login</h2>
          <p style={{ color: '#666' }}>Secure System Management Portal</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#888' }}>System Identifier</label>
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
                placeholder="admin@hostelpass.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#888' }}>Access Key</label>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(238, 46, 36, 0.05)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid rgba(238, 46, 36, 0.1)'
          }}>
            <MdSecurity style={{ color: '#EE2E24' }} />
            <span style={{ fontSize: '12px', color: '#888', textAlign: 'left' }}>
              IP logging is active. Unauthorized attempts will be blocked.
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ 
            height: '48px', 
            fontSize: '16px', 
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

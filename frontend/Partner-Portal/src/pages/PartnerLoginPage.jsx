import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdArrowBack, MdBusiness } from 'react-icons/md';
import toast from 'react-hot-toast';

const PartnerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as partner
  React.useEffect(() => {
    if (!authLoading && user && userRole === 'partner') {
      navigate('/partner');
    }
  }, [user, userRole, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Partner!');
      navigate('/partner');
    } catch (error) {
      toast.error('Invalid credentials or partner account not found');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page partner-theme">
      <div className="auth-card animate-fadeIn" style={{ width: '100%', maxWidth: '380px', padding: '32px' }}>
        
        <div className="auth-header" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div className="role-icon partner-icon" style={{ 
            width: '52px', height: '52px', minWidth: '52px', margin: 0, fontSize: '26px',
            background: '#e6fffa', color: '#008080',
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'
          }}>
            <MdBusiness />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Partner Login</h2>
            <p style={{ color: '#666', fontSize: '13px', margin: '2px 0 0' }}>Manage Properties</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#555' }}>Business Email</label>
            <div className="input-with-icon">
              <MdEmail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#555' }}>Access Password</label>
            <div className="input-with-icon">
              <MdLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting} style={{ 
            background: '#008080', color: 'white', height: '46px', fontSize: '14px', fontWeight: 800, borderRadius: '10px' 
          }}>
            {isSubmitting ? 'Verifying...' : 'Sign In as Partner'}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
          Want to list your PG? <Link to="/register" style={{ color: '#008080', fontWeight: 700 }}>Register as Partner</Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerLoginPage;

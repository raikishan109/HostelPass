import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdSchool } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle, user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as student
  React.useEffect(() => {
    if (!authLoading && user && userRole === 'student') {
      navigate('/student');
    }
  }, [user, userRole, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome to HostelPass!');
      navigate('/student');
    } catch (error) {
      toast.error('Invalid credentials or user not found');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google!');
      navigate('/student');
    } catch (error) {
      toast.error('Google Login failed');
    }
  };

  return (
    <div className="auth-page student-theme">
      <div className="auth-card animate-fadeIn" style={{ width: '100%', maxWidth: '380px', padding: '32px' }}>
        <div className="auth-header" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div className="role-icon student-icon" style={{ 
            width: '52px', height: '52px', minWidth: '52px', margin: 0, fontSize: '26px',
            background: '#fff1f0', color: '#EE2E24',
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'
          }}>
            <MdSchool />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Student Login</h2>
            <p style={{ color: '#666', fontSize: '13px', margin: '2px 0 0' }}>Find your perfect home</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#555' }}>Student Email</label>
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
            <label className="form-label" style={{ color: '#555' }}>Password</label>
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

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting} style={{ height: '46px', fontSize: '14px', fontWeight: 800, borderRadius: '10px' }}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '24px 0' }}><span>OR</span></div>

        <button onClick={handleGoogleLogin} className="btn btn-outline w-full google-btn" style={{ height: '46px', borderRadius: '10px' }}>
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="auth-footer" style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create new account</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLoginPage;

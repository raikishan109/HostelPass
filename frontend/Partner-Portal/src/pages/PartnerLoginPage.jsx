import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdArrowBack, MdBusiness } from 'react-icons/md';
import toast from 'react-hot-toast';

const PartnerLoginPage = () => {
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
      toast.success('Welcome back, Partner!');
      navigate('/partner');
    } catch (error) {
      toast.error('Invalid credentials or partner account not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page partner-theme">
      <div className="auth-card animate-fadeIn">
        <Link to="/" className="back-link"><MdArrowBack /> Back to Home</Link>
        <div className="auth-header">
          <div className="role-icon partner-icon"><MdBusiness /></div>
          <h2>Partner Login</h2>
          <p>Manage your properties and bookings</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Business Email</label>
            <div className="input-with-icon">
              <MdEmail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="partner@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <MdLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-teal w-full" disabled={loading} style={{ background: '#008080', color: 'white' }}>
            {loading ? 'Verifying...' : 'Sign In as Partner'}
          </button>
        </form>

        <p className="auth-footer">
          Want to list your PG? <Link to="/register">Register as Partner</Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerLoginPage;

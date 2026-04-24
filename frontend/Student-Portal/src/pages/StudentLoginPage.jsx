import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdArrowBack, MdSchool } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome to HostelPass!');
      navigate('/student');
    } catch (error) {
      toast.error('Invalid credentials or user not found');
    } finally {
      setLoading(false);
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
      <div className="auth-card animate-fadeIn">
        <Link to="/" className="back-link"><MdArrowBack /> Back to Home</Link>
        <div className="auth-header">
          <div className="role-icon student-icon"><MdSchool /></div>
          <h2>Student Login</h2>
          <p>Find and book your perfect student home</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">College Email</label>
            <div className="input-with-icon">
              <MdEmail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="email@college.edu"
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

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In as Student'}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button onClick={handleGoogleLogin} className="btn btn-outline w-full google-btn">
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="auth-footer">
          New here? <Link to="/register">Create a student account</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLoginPage;

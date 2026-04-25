import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdPerson, MdEmail, MdLock, MdArrowForward, MdVisibility, MdVisibilityOff, MdPhone, MdSchool } from 'react-icons/md';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, 'student');
      toast.success('Account created! Welcome to HostelPass 🎉');
      navigate('/student');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'An account with this email already exists'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page student-theme">
      {/* Registration Card */}
      <div className="auth-card animate-fadeIn">
          <div className="auth-header" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', marginBottom: '8px' }}>
              <div className="role-icon student-icon" style={{ width: '44px', height: '44px', fontSize: '22px', margin: 0 }}><MdSchool /></div>
              <h2 style={{ margin: 0 }}>Registration</h2>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 700 }}>Full Name *</label>
              <input name="name" type="text" className="form-input" style={{ padding: '10px 14px', fontSize: '14px' }} placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 700 }}>Email Address *</label>
              <input name="email" type="email" className="form-input" style={{ padding: '10px 14px', fontSize: '14px' }} placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 700 }}>Phone Number</label>
              <input name="phone" type="tel" className="form-input" style={{ padding: '10px 14px', fontSize: '14px' }} placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 700 }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPw ? 'text' : 'password'} className="form-input" style={{ padding: '10px 14px', fontSize: '14px', paddingRight: '40px' }} placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                  {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 700 }}>Confirm Password *</label>
              <input name="confirm" type="password" className="form-input" style={{ padding: '10px 14px', fontSize: '14px' }} placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ height: '46px', borderRadius: '12px', fontWeight: 800 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '20px' }}>
            By creating an account you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
  );
};

export default RegisterPage;

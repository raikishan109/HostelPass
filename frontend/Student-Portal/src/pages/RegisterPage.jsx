import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdPerson, MdEmail, MdLock, MdArrowForward, MdVisibility, MdVisibilityOff, MdPhone } from 'react-icons/md';

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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(145deg, #1a0a00, #2d0e0a 50%, #1F1F1F)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 48px' }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div style={{ width: 42, height: 42, background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', color: 'white' }}>HP</div>
            <span style={{ fontWeight: 800, fontSize: '22px', color: 'white' }}>Hostel<span style={{ color: 'var(--primary)' }}>Pass</span></span>
          </Link>
          <h1 style={{ fontSize: '34px', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>Join thousands of students</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.8, marginBottom: '36px' }}>
            Create your free account and start exploring PGs with real mess ratings and honest student reviews.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '28px' }}>🍽️</span>
              <div>
                <div style={{ color: 'white', fontWeight: 700, marginBottom: '4px' }}>Mess Score System</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.6 }}>
                  Our unique Mess Score is calculated from real student food ratings — no bias, no sponsorships.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'white' }}>
        <div className="animate-fadeIn" style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '32px', 
          borderRadius: '24px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>Student Registration</h2>
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
              {loading ? 'Creating Account...' : 'Register as Student'}
            </button>
          </form>
          <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '20px' }}>
            By creating an account you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

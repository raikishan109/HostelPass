import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdBusiness, MdEmail, MdLock, MdArrowForward, MdVisibility, MdVisibilityOff, MdPhone, MdHomeWork, MdCheckCircle } from 'react-icons/md';

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
      await register(form.email, form.password, form.name, 'partner');
      toast.success('Business account created! Welcome Partner 🎉');
      navigate('/partner');
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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f7fa' }}>
      {/* Left Panel - Partner Themed */}
      <div style={{ flex: 1.2, background: '#004d40', backgroundImage: 'linear-gradient(135deg, #004d40 0%, #00251a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '360px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: 40, height: 40, background: '#00bfa5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: 'white' }}>HP</div>
            <span style={{ fontWeight: 800, fontSize: '20px', color: 'white' }}>Hostel<span style={{ color: '#00bfa5' }}>Pass</span> <span style={{fontSize: '12px', background: '#00bfa5', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px'}}>Partner</span></span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>Grow Your PG Business</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
            Join our platform to reach thousands of students and manage your property effortlessly.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'white', fontSize: '14px' }}>
              <MdHomeWork size={20} style={{ color: '#00bfa5' }} />
              <span>Smart Listing Management</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'white', fontSize: '14px' }}>
              <MdCheckCircle size={20} style={{ color: '#00bfa5' }} />
              <span>Get Verified Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Even Smaller Box */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="animate-fadeIn" style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: 'white', 
          padding: '28px', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a202c', marginBottom: '6px' }}>Partner Join</h2>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              <Link to="/login" style={{ color: '#00796b', fontWeight: 700, textDecoration: 'none' }}>Already a partner? Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', marginBottom: '4px' }}>Full Name *</label>
              <input name="name" type="text" className="form-input" style={{ padding: '9px 12px', fontSize: '14px' }} placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', marginBottom: '4px' }}>Email Address *</label>
              <input name="email" type="email" className="form-input" style={{ padding: '9px 12px', fontSize: '14px' }} placeholder="business@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', marginBottom: '4px' }}>Phone *</label>
              <input name="phone" type="tel" className="form-input" style={{ padding: '9px 12px', fontSize: '14px' }} placeholder="+91..." value={form.phone} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', marginBottom: '4px' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPw ? 'text' : 'password'} className="form-input" style={{ padding: '9px 12px', fontSize: '14px', paddingRight: '40px' }} placeholder="Min 6 chars" value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' }}>
                  {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', marginBottom: '4px' }}>Confirm *</label>
              <input name="confirm" type="password" className="form-input" style={{ padding: '9px 12px', fontSize: '14px' }} placeholder="Re-type password" value={form.confirm} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn w-full" style={{ 
              background: '#00796b', 
              color: 'white', 
              height: '44px', 
              fontSize: '15px', 
              fontWeight: 800,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 121, 107, 0.12)'
            }} disabled={loading}>
              {loading ? 'Processing...' : 'Register Partner'}
            </button>
          </form>

          <p style={{ fontSize: '11px', color: '#a0aec0', textAlign: 'center', marginTop: '16px' }}>
            Agree to our <b>Terms</b> and <b>Policy</b>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

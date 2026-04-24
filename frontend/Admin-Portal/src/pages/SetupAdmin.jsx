import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { MdSecurity, MdCheckCircle } from 'react-icons/md';

const SetupAdmin = () => {
  const [status, setStatus] = useState('ready');
  const [error, setError] = useState('');

  const [setupKey, setSetupKey] = useState('');

  const createAdmin = async () => {
    if (setupKey !== 'rocky_secret_2026') {
      setError('Invalid Setup Key!');
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        'admin@hostelpass.com', 
        'admin123'
      );
      
      // 2. Set Role in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: 'admin@hostelpass.com',
        role: 'admin',
        name: 'Super Admin',
        createdAt: new Date().toISOString()
      });

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeIn">
        <MdSecurity size={50} color="#EE2E24" style={{ marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '10px' }}>Admin Setup Utility</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>This will create a permanent admin account in your Firebase database.</p>
        
        {status === 'ready' && (
          <>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Enter Setup Key" 
                className="form-input"
                style={{ paddingLeft: '16px' }}
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
              />
            </div>
            <button onClick={createAdmin} className="btn btn-primary w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Creating...' : 'Create Admin Account'}
            </button>
          </>
        )}

        {status === 'loading' && <p>Creating account... Please wait.</p>}
        
        {status === 'success' && (
          <div style={{ color: '#059669', marginTop: '20px' }}>
            <MdCheckCircle size={40} />
            <h3>Success!</h3>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>Admin account created. You can now login at /login.</p>
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', marginTop: '16px', textAlign: 'left' }}>
              <p style={{ fontSize: '13px' }}><b>Email:</b> admin@hostelpass.com</p>
              <p style={{ fontSize: '13px' }}><b>Pass:</b> admin123</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ color: '#EE2E24', marginTop: '20px' }}>
            <h3>Error</h3>
            <p style={{ fontSize: '14px' }}>{error}</p>
            <button className="btn btn-ghost btn-sm mt-16" onClick={() => setStatus('ready')}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupAdmin;

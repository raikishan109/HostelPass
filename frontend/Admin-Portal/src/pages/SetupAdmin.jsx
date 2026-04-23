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
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <MdSecurity size={50} color="#EE2E24" />
        <h2>Admin Setup Utility</h2>
        <p style={{ color: '#666' }}>This will create a permanent admin account in your Firebase database.</p>
        
        {status === 'ready' && (
          <>
            <input 
              type="password" 
              placeholder="Enter Setup Key" 
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button onClick={createAdmin} className="btn btn-primary w-full" style={{ padding: '12px', fontWeight: 800, width: '100%', cursor: 'pointer' }}>
              Create Admin Account
            </button>
          </>
        )}

        {status === 'loading' && <p>Creating account... Please wait.</p>}
        
        {status === 'success' && (
          <div style={{ color: '#059669' }}>
            <MdCheckCircle size={40} />
            <h3>Success!</h3>
            <p>Admin account created. You can now login at /login.</p>
            <p><b>Email:</b> admin@hostelpass.com</p>
            <p><b>Pass:</b> admin123</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ color: '#EE2E24' }}>
            <h3>Error</h3>
            <p>{error}</p>
            <p>Try logging in directly if the account already exists.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupAdmin;

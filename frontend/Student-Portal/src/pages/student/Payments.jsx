import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { MdPayments, MdHistory, MdAccountBalanceWallet, MdArrowForward, MdCheckCircle, MdAccessTime } from 'react-icons/md';

const Payments = () => {
  const { userData } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.uid) {
      // If we have userData but no UID, it means user is not logged in or data is missing
      // But protected route handles login, so we just wait for data
      return;
    }
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', userData.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false); // Stop loading even on error
    });
    return () => unsubscribe();
  }, [userData]);

  return (
    <StudentLayout title="Payments">
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '40px' }}>
        
        {/* Balance Card */}
        <div className="app-gradient-card" style={{ marginBottom: '24px', textAlign: 'center', padding: '32px 20px' }}>
          <div style={{ fontSize: '13px', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Outstanding Balance</div>
          <div style={{ fontSize: '36px', fontWeight: 950, margin: '8px 0' }}>₹0</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>No pending dues for this month</div>
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <h3 className="section-title-app">Payment Options</h3>
        </div>
        <div className="grid-2" style={{ gap: '12px', marginBottom: '32px' }}>
          <div className="app-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
              <MdPayments size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Pay Rent</div>
              <div style={{ fontSize: '11px', color: '#888' }}>UPI, Cards, Netbanking</div>
            </div>
            <MdArrowForward color="#ccc" />
          </div>
          <div className="app-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#be185d' }}>
              <MdAccountBalanceWallet size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Deposit</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Refundable amount</div>
            </div>
            <MdArrowForward color="#ccc" />
          </div>
        </div>

        {/* Transaction History */}
        <div className="section-header">
          <h3 className="section-title-app">Transaction History</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading transactions...</div>
          ) : payments.length > 0 ? (
            payments.map(p => (
              <div key={p.id} className="app-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '50%', 
                  background: p.status === 'success' ? '#ecfdf5' : '#fef2f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: p.status === 'success' ? '#059669' : '#dc2626'
                }}>
                  {p.status === 'success' ? <MdCheckCircle size={22} /> : <MdAccessTime size={22} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Rent for {p.month || 'Current Month'}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{p.date || 'Today'} • {p.method || 'UPI'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>₹{p.amount?.toLocaleString()}</div>
                  <div style={{ fontSize: '10px', color: p.status === 'success' ? '#059669' : '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>{p.status}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="app-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <MdHistory size={48} color="#eee" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>No transactions yet</div>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Your payment history will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
};

export default Payments;

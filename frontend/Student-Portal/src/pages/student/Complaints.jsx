import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { MOCK_PGS } from '../../data/mockData';
import toast from 'react-hot-toast';
import { MdReport, MdCheckCircle, MdHourglassEmpty, MdAdd } from 'react-icons/md';

const STATUS_COLORS = {
  pending: { bg: '#fffbeb', color: '#d97706', label: 'Pending' },
  resolved: { bg: '#ecfdf5', color: '#059669', label: 'Resolved' },
  investigating: { bg: '#eff6ff', color: '#2563eb', label: 'Investigating' },
};

const MOCK_COMPLAINTS = [
  { id: 'c1', pgId: 'pg1', pgName: 'Sunrise Boys PG', category: 'Food / Mess Quality', text: 'The food quality has dropped significantly in the last month. Vegetables are not fresh.', status: 'investigating', date: new Date('2024-08-15') },
  { id: 'c2', pgId: 'pg3', pgName: 'City View Co-Living', category: 'WiFi / Internet', text: 'WiFi is very slow during evenings and often disconnects.', status: 'pending', date: new Date('2024-09-01') },
];

const Complaints = () => {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ pgId: '', category: '', text: '' });

  const handleSubmit = () => {
    if (!form.pgId || !form.category || !form.text.trim()) { toast.error('Please fill all fields'); return; }
    const pg = MOCK_PGS.find(p => p.id === form.pgId);
    setComplaints(c => [...c, { id: Date.now(), pgId: form.pgId, pgName: pg?.name, category: form.category, text: form.text, status: 'pending', date: new Date() }]);
    toast.success('Complaint submitted!');
    setForm({ pgId: '', category: '', text: '' });
    setShowForm(false);
  };

  return (
    <StudentLayout title="Complaints" subtitle="Track your reported issues">
      <div className="animate-fadeIn">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              <MdAdd /> File New Complaint
            </button>
          </div>

          {showForm && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>New Complaint</h3>
              <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">PG / Hostel</label>
                  <select className="form-select" value={form.pgId} onChange={e => setForm(f => ({ ...f, pgId: e.target.value }))}>
                    <option value="">Select PG...</option>
                    {MOCK_PGS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Issue Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category...</option>
                    {['Food / Mess Quality', 'Cleanliness / Hygiene', 'Safety / Security', 'WiFi / Internet', 'Owner Behaviour', 'Billing Issue', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" placeholder="Describe the issue in detail..." value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={3} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSubmit}><MdReport /> Submit Complaint</button>
              </div>
            </div>
          )}

          {complaints.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">✅</div><h3>No complaints</h3><p>You haven't filed any complaints yet.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaints.map(c => {
                const status = STATUS_COLORS[c.status] || STATUS_COLORS.pending;
                return (
                  <div key={c.id} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.pgName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                          {c.category} · {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span className="badge" style={{ background: status.bg, color: status.color }}>
                        {c.status === 'resolved' ? <MdCheckCircle size={10} /> : <MdHourglassEmpty size={10} />} {status.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: 1.7 }}>{c.text}</p>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </StudentLayout>
  );
};

export default Complaints;

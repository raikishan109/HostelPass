import React, { useState } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';
import { MdCheckCircle, MdHourglassEmpty, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';

const MOCK_COMPLAINTS = [
  { id: 'c1', pgName: 'Sunrise Boys PG', student: 'Arjun Patel', category: 'Food / Mess Quality', text: 'The food quality has dropped significantly. Vegetables are not fresh and portions are small.', status: 'investigating', date: new Date('2024-08-15') },
  { id: 'c2', pgName: 'City View Co-Living', student: 'Pooja Verma', category: 'WiFi / Internet', text: 'WiFi is very slow in the evenings and frequently disconnects during work hours.', status: 'pending', date: new Date('2024-09-01') },
  { id: 'c3', pgName: 'Student Hub Hostel', student: 'Rohan Mehta', category: 'Cleanliness / Hygiene', text: 'Bathrooms are not cleaned regularly and there are cockroaches in the kitchen.', status: 'pending', date: new Date('2024-09-10') },
  { id: 'c4', pgName: 'Campus Corner PG', student: 'Ananya Singh', category: 'Owner Behaviour', text: 'Owner is very rude and does not respond to maintenance requests promptly.', status: 'resolved', date: new Date('2024-07-20') },
];

const STATUS_MAP = {
  pending: { bg: '#fffbeb', color: '#d97706', label: 'Pending' },
  investigating: { bg: '#eff6ff', color: '#2563eb', label: 'Investigating' },
  resolved: { bg: '#ecfdf5', color: '#059669', label: 'Resolved' },
};

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [statusFilter, setStatusFilter] = useState('');

  const updateStatus = (id, status) => {
    setComplaints(c => c.map(x => x.id === id ? { ...x, status } : x));
    toast.success('Complaint status updated');
  };

  const filtered = complaints.filter(c => statusFilter ? c.status === statusFilter : true);

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="Complaints" subtitle={`${complaints.filter(c => c.status !== 'resolved').length} open complaints`} />
        <div className="page-content animate-fadeIn">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['', 'pending', 'investigating', 'resolved'].map(s => (
              <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(c => {
              const st = STATUS_MAP[c.status];
              return (
                <div key={c.id} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{c.pgName}</span>
                        <span className="badge badge-grey">{c.category}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                        By {c.student} · {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <span className="badge" style={{ background: st.bg, color: st.color }}>
                      {c.status === 'resolved' ? <MdCheckCircle size={10} /> : <MdHourglassEmpty size={10} />} {st.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: 1.7, marginBottom: '14px' }}>{c.text}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {c.status !== 'investigating' && <button className="btn btn-outline btn-sm" onClick={() => updateStatus(c.id, 'investigating')}>Mark Investigating</button>}
                    {c.status !== 'resolved' && <button className="btn btn-sm" style={{ background: 'var(--verified-color)', color: 'white' }} onClick={() => updateStatus(c.id, 'resolved')}><MdCheckCircle size={13} /> Mark Resolved</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;

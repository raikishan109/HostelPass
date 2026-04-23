import React, { useState } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';
import { MdSearch, MdBlock, MdCheckCircle, MdPerson, MdBusiness, MdAdminPanelSettings } from 'react-icons/md';
import toast from 'react-hot-toast';

const MOCK_USERS = [
  { id: 'u1', name: 'Arjun Patel', email: 'arjun@email.com', role: 'student', status: 'active', reviews: 5, joined: '2024-03-12' },
  { id: 'u2', name: 'Sneha Reddy', email: 'sneha@email.com', role: 'student', status: 'active', reviews: 12, joined: '2024-04-01' },
  { id: 'u3', name: 'Ramesh Kumar', email: 'ramesh@email.com', role: 'partner', status: 'active', reviews: 0, joined: '2024-01-10' },
  { id: 'u4', name: 'Priya Sharma', email: 'priya@email.com', role: 'partner', status: 'active', reviews: 0, joined: '2024-02-15' },
  { id: 'u5', name: 'Fake User', email: 'fake@email.com', role: 'student', status: 'suspended', reviews: 48, joined: '2024-05-20' },
];

const ROLE_ICONS = { student: <MdPerson />, partner: <MdBusiness />, admin: <MdAdminPanelSettings /> };

const AdminUsers = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState('');

  const filtered = users.filter(u =>
    (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())) &&
    (roleFilter ? u.role === roleFilter : true)
  );

  const toggleStatus = (id) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x));
    toast.success('User status updated');
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="User Management" subtitle={`${users.length} total users`} />
        <div className="page-content animate-fadeIn">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 16px' }}>
              <MdSearch color="var(--text-light)" />
              <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }} placeholder="Search users..." value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 'auto', minWidth: '160px' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="partner">Partners</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>User</th><th>Role</th><th>Reviews</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'partner' ? 'badge-info' : u.role === 'admin' ? 'badge-danger' : 'badge-grey'}`}>
                        {ROLE_ICONS[u.role]} {u.role}
                      </span>
                    </td>
                    <td>{u.reviews}</td>
                    <td style={{ fontSize: '13px', color: 'var(--text-light)' }}>{new Date(u.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-verified' : 'badge-danger'}`}>
                        {u.status === 'active' ? <MdCheckCircle size={10} /> : <MdBlock size={10} />} {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-ghost'}`}
                        style={{ fontSize: '12px' }}
                        onClick={() => toggleStatus(u.id)}
                      >
                        {u.status === 'active' ? <><MdBlock size={12} /> Suspend</> : <><MdCheckCircle size={12} /> Restore</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

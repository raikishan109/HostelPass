import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
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
    <AdminLayout title="User Management" subtitle={`${users.length} total users`}>
      <div className="flex-mobile-col" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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

      <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
        <table className="table table-to-cards">
          <thead><tr><th>User</th><th>Role</th><th>Reviews</th><th className="pc-only">Joined</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td data-label="User">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Role">
                  <span className={`badge ${u.role === 'partner' ? 'badge-info' : u.role === 'admin' ? 'badge-danger' : 'badge-grey'}`}>
                    {u.role}
                  </span>
                </td>
                <td data-label="Reviews">{u.reviews}</td>
                <td data-label="Status">
                  <span className={`badge ${u.status === 'active' ? 'badge-verified' : 'badge-danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td data-label="Action">
                  <button
                    className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-ghost'}`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === 'active' ? 'Suspend' : 'Restore'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

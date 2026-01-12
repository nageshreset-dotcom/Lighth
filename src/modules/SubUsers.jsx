import React, { useState } from 'react';

export default function SubUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', permissions: { restart: true, files: true, backup: true } },
    { id: 2, name: 'Player', permissions: { restart: false, files: false, backup: false } }
  ]);
  const [newUserName, setNewUserName] = useState('');

  const addUser = () => {
    if (!newUserName.trim()) return;
    setUsers([...users, {
      id: Date.now(),
      name: newUserName,
      permissions: { restart: false, files: false, backup: false }
    }]);
    setNewUserName('');
  };

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const updatePermission = (id, perm, value) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, permissions: { ...u.permissions, [perm]: value } } : u
    ));
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Sub-Users</h1>
      
      <div style={{ maxWidth: '600px', marginBottom: '32px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="New user name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} style={{ flex: 1, padding: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} />
          <button onClick={addUser} style={{ padding: '12px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add User</button>
        </div>
      </div>

      <div style={{ maxWidth: '800px' }}>
        {users.map(user => (
          <div key={user.id} style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{user.name}</h3>
              <button onClick={() => removeUser(user.id)} style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {Object.entries(user.permissions).map(([perm, value]) => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={value} onChange={(e) => updatePermission(user.id, perm, e.target.checked)} />
                  Can {perm.charAt(0).toUpperCase() + perm.slice(1)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

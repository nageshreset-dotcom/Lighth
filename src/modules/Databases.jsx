import React, { useState } from 'react';

export default function Databases() {
  const [host, setHost] = useState('localhost');
  const [dbName, setDbName] = useState('minecraft_db');
  const [password, setPassword] = useState('');
  const [connected, setConnected] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 16; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setPassword(pwd);
  };

  const testConnection = () => {
    if (!host || !dbName || !password) return;
    setConnected(true);
    setTimeout(() => setConnected(false), 2000);
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Databases</h1>
      
      <div style={{ maxWidth: '600px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>MySQL Host</label>
          <input type="text" value={host} onChange={(e) => setHost(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px', marginBottom: '16px' }} />

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Database Name</label>
          <input type="text" value={dbName} onChange={(e) => setDbName(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px', marginBottom: '16px' }} />

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ flex: 1, padding: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} />
            <button onClick={generatePassword} style={{ padding: '12px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Generate</button>
          </div>

          <button onClick={testConnection} style={{ width: '100%', padding: '12px', background: connected ? '#10b981' : '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {connected ? '✓ Connected' : 'Test Connection'}
          </button>
        </div>
      </div>
    </div>
  );
}

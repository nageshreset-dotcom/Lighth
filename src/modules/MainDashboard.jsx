import React, { useState } from 'react';

export default function MainDashboard() {
  const [status, setStatus] = useState('online');
  const [serverIp] = useState('192.168.1.100');
  const [cpu] = useState(45);
  const [ram] = useState(62);
  const [disk] = useState(78);
  const [network] = useState(32);

  const getStatusColor = (s) => {
    if (s === 'online') return '#10b981';
    if (s === 'starting') return '#f59e0b';
    return '#ef4444';
  };

  const copyIp = () => {
    navigator.clipboard.writeText(serverIp);
    alert('Server IP copied to clipboard!');
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '32px', fontWeight: 'bold' }}>Main Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '16px' }}>Server Status</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: getStatusColor(status) }}></div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>{status}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setStatus('online')} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Start</button>
            <button onClick={() => setStatus('stopping')} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Stop</button>
            <button onClick={() => setStatus('starting')} style={{ padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Restart</button>
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '16px' }}>Server Address</h2>
          <p style={{ fontSize: '14px', marginBottom: '12px', color: '#cbd5e1' }}>IP Address</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <code style={{ flex: 1, background: '#0f172a', padding: '12px', borderRadius: '4px', fontFamily: 'monospace' }}>{serverIp}:25565</code>
            <button onClick={copyIp} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Copy</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[{ label: 'CPU', value: cpu, color: '#3b82f6' }, { label: 'RAM', value: ram, color: '#8b5cf6' }, { label: 'Disk', value: disk, color: '#ec4899' }, { label: 'Network', value: network, color: '#06b6d4' }].map((widget, i) => (
          <div key={i} style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '14px' }}>{widget.label}</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>{widget.value}%</div>
            <div style={{ background: '#0f172a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ background: widget.color, height: '100%', width: `${widget.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

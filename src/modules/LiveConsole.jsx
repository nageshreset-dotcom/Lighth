import React, { useState } from 'react';

export default function LiveConsole() {
  const [logs, setLogs] = useState(['[12:34:56] Server started', '[12:34:57] Loading world...', '[12:34:59] Players online: 3']);
  const [cmd, setCmd] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const sendCommand = () => {
    if (!cmd.trim()) return;
    setLogs([...logs, `> ${cmd}`, `[Response] Command executed`]);
    setCmd('');
  };

  const killServer = () => {
    setLogs([...logs, '[SYSTEM] Server kill signal sent']);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '32px', background: '#1a1a1a', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1 style={{ marginBottom: '16px', color: '#00ff00' }}>Live Console</h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <label style={{ color: '#0f0' }}>
          <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} />
          Auto-scroll
        </label>
        <button onClick={killServer} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>KILL</button>
        <button onClick={clearLogs} style={{ padding: '8px 16px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #0f0', borderRadius: '4px', padding: '16px', height: '400px', overflowY: 'auto', marginBottom: '16px' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '4px', color: log.startsWith('>') ? '#ffff00' : '#0f0', fontSize: '14px' }}>
            {log}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="text" value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendCommand()} placeholder="Enter command..." style={{ flex: 1, padding: '12px', background: '#0a0a0a', border: '1px solid #0f0', color: '#0f0', fontFamily: 'monospace', borderRadius: '4px' }} />
        <button onClick={sendCommand} style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
      </div>
    </div>
  );
}

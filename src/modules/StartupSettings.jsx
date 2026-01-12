import React, { useState } from 'react';

export default function StartupSettings() {
  const [javaVersion, setJavaVersion] = useState('17');
  const [memory, setMemory] = useState(8);
  const [eulaAccepted, setEulaAccepted] = useState(false);

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Startup Settings</h1>
      
      <div style={{ maxWidth: '600px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Java Version</label>
          <select value={javaVersion} onChange={(e) => setJavaVersion(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }}>
            <option value="11">Java 11</option>
            <option value="17">Java 17</option>
            <option value="21">Java 21</option>
          </select>
        </div>

        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Memory Allocation (GB)</label>
          <input type="range" min="2" max="32" value={memory} onChange={(e) => setMemory(Number(e.target.value))} style={{ width: '100%', marginBottom: '8px' }} />
          <p style={{ color: '#cbd5e1' }}>Current: {memory} GB</p>
        </div>

        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={eulaAccepted} onChange={(e) => setEulaAccepted(e.target.checked)} />
            <span>I accept the Minecraft EULA</span>
          </label>
          <p style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '8px' }}>You must accept the EULA to start the server.</p>
        </div>

        <button disabled={!eulaAccepted} style={{ padding: '12px 24px', background: eulaAccepted ? '#10b981' : '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: eulaAccepted ? 'pointer' : 'not-allowed', fontWeight: 'bold', width: '100%' }}>Save Settings</button>
      </div>
    </div>
  );
}

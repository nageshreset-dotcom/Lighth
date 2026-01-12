import React, { useState } from 'react';

export default function Schedules() {
  const [schedules, setSchedules] = useState([
    { id: 1, type: 'restart', time: '03:00', day: 'daily' },
    { id: 2, type: 'backup', time: '02:00', day: 'weekly' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState('restart');
  const [newTime, setNewTime] = useState('03:00');
  const [newDay, setNewDay] = useState('daily');

  const addSchedule = () => {
    setSchedules([...schedules, { id: Date.now(), type: newType, time: newTime, day: newDay }]);
    setShowForm(false);
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Schedules</h1>
      
      <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '16px' }}>Add Schedule</button>

      {showForm && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', marginBottom: '16px', maxWidth: '400px' }}>
          <select value={newType} onChange={(e) => setNewType(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }}>
            <option value="restart">Restart</option>
            <option value="backup">Backup</option>
          </select>
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }} />
          <select value={newDay} onChange={(e) => setNewDay(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '4px' }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addSchedule} style={{ flex: 1, padding: '8px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '8px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {schedules.map(s => (
          <div key={s.id} style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{s.type.toUpperCase()}</strong> at <code style={{ background: '#0f172a', padding: '4px 8px', borderRadius: '4px' }}>{s.time}</code> ({s.day})
            </div>
            <button onClick={() => deleteSchedule(s.id)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

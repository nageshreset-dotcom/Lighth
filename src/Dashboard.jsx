import { useState, useEffect } from 'react';
import './Dashboard.css';
import * as api from './mockServerApi';

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalServers: 0, totalPlayers: 0, onlineServers: 0 });
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', ram: '2GB', storage: '5GB', players: 10, eulaAccepted: false, edition: 'java', serverType: 'vanilla' });
  const [manageOpen, setManageOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', ram: '2GB', storage: '5GB', players: 10, eulaAccepted: false, edition: 'java', serverType: 'vanilla' });
  const [createLoading, setCreateLoading] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.fetchServers().then((s) => {
      if (mounted) {
        setServers(s);
        const onlineCount = s.filter(srv => srv.status === 'online').length;
        setStats({
          totalServers: s.length,
          totalPlayers: s.length * 10,
          onlineServers: onlineCount
        });
        setLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  function openCreate() {
    setForm({ name: '', ram: '2GB', storage: '5GB', players: 10, eulaAccepted: false, edition: 'java', serverType: 'vanilla' });
    setCreateOpen(true);
  }

  function openManage() {
    setManageOpen(true);
  }

  function closeManage() {
    setManageOpen(false);
    setEditing(null);
  }

  function closeCreate() {
    setCreateOpen(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.eulaAccepted) {
      addToast('You must accept the EULA to create a server', 'error');
      return;
    }
    setCreateLoading(true);
    const payload = {
      name: form.name || `server-${Date.now()}`,
      ram: form.ram,
      storage: form.storage,
      players: Number(form.players) || 0,
      status: 'provisioning',
      eulaAccepted: !!form.eulaAccepted
    };
    try {
      const s = await api.createServer(payload);
      setServers((p) => [s, ...p]);
      setStats((st) => ({
        ...st,
        totalServers: st.totalServers + 1,
        totalPlayers: (st.totalPlayers || 0) + (s.players || 0)
      }));
      setCreateOpen(false);
      addToast('Server created', 'success');
      // auto-open the new server panel
      window.location.hash = `#/servers/${s.id}`;
    } catch (err) {
      console.error('create server failed', err);
      addToast('Create failed', 'error');
      // keep modal open for retry
    } finally {
      setCreateLoading(false);
    }
  }

  function updateField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addToast(message, kind = 'info') {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }

  function updateEditField(k, v) {
    setEditForm((f) => ({ ...f, [k]: v }));
  }

  function startEdit(srv) {
    setEditing(srv.id);
    setEditForm({ name: srv.name, ram: srv.ram, storage: srv.storage, players: srv.players || 0, edition: srv.edition || 'java', serverType: srv.serverType || 'vanilla' });
  }

  async function applyEdit(e) {
    e.preventDefault();
    setEditingLoading(true);
    const payload = { name: editForm.name, ram: editForm.ram, storage: editForm.storage, players: Number(editForm.players), eulaAccepted: !!editForm.eulaAccepted };
    try {
      const res = await api.updateServer(editing, payload);
      if (res.ok) {
        setServers((list) => list.map((s) => (s.id === editing ? res.server : s)));
        setEditing(null);
        addToast('Server updated', 'success');
      }
    } catch (err) {
      console.error('update failed', err);
      addToast('Update failed', 'error');
    } finally {
      setEditingLoading(false);
    }
  }

  async function removeServer(id) {
    setDeletingId(id);
    try {
      await api.deleteServer(id);
      setServers((list) => list.filter((s) => s.id !== id));
      setStats((st) => ({ ...st, totalServers: Math.max(0, st.totalServers - 1) }));
      addToast('Server deleted', 'success');
    } catch (err) {
      console.error('delete failed', err);
      addToast('Delete failed', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: '#fff' }}>LightNode</h1>
        <p className="dashboard-subtitle" style={{ color: 'rgba(255,255,255,0.85)' }}>Welcome back! Here's your server overview.</p>
      </header>

      <div className="dashboard-container">
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Total Servers</div>
            <div className="stat-value">{stats.totalServers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Online Servers</div>
            <div className="stat-value">{stats.onlineServers}</div>
          </div>
          {/* Total Players and Status removed per design request */}
        </section>

        <section className="dashboard-servers">
          <div className="section-header">
            <h2 style={{ color: '#fff' }}>Your Servers</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={openManage}>Manage Servers</button>
              <button className="btn primary small" onClick={openCreate}>➕ Create Server</button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading servers…</div>
          ) : (
            <div className="server-preview">
              {servers.length === 0 ? null : (
                servers.slice(0, 3).map((srv) => (
                  <div key={srv.id} className="server-card-mini">
                    <div className="server-header">
                      <h3>{srv.name}</h3>
                      <span className={`status-badge status-${srv.status}`}>{srv.status}</span>
                    </div>
                    <div className="server-info">
                      <span>{srv.ram} RAM</span>
                      <span>{srv.storage} Storage</span>
                      <span>{srv.players} players</span>
                    </div>
                    <a className="btn primary small" href={`#/servers/${srv.id}`}>Open Panel</a>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
        {createOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-card">
              <header className="modal-header">
                <h3>Create Server</h3>
                <button className="modal-close" onClick={closeCreate} aria-label="Close">✕</button>
              </header>
              <form className="modal-body" onSubmit={handleCreate}>
                <label>
                  Server Name
                  <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="My awesome server" />
                </label>
                <label>
                  Edition
                  <select value={form.edition} onChange={(e) => updateField('edition', e.target.value)}>
                    <option value="java">Java Edition</option>
                    <option value="bedrock">Bedrock Edition</option>
                  </select>
                </label>
                <label>
                  Server Type
                  <select value={form.serverType} onChange={(e) => updateField('serverType', e.target.value)}>
                    {form.edition === 'java' && (
                      <>
                        <option value="vanilla">Vanilla</option>
                        <option value="snapshot">Snapshot</option>
                        <option value="paper">Paper (plugins)</option>
                        <option value="spigot">Spigot (plugins)</option>
                        <option value="purpur">Purpur (plugins)</option>
                        <option value="fabric">Fabric (mods)</option>
                        <option value="quilt">Quilt (mods)</option>
                        <option value="glowstone">Glowstone (plugins)</option>
                        <option value="neoforge">NeoForge (mods)</option>
                        <option value="forge">Forge (mods)</option>
                        <option value="modpack">Modpack</option>
                        <option value="arclight">Arclight (plugins/mods)</option>
                      </>
                    )}
                    {form.edition === 'bedrock' && (
                      <>
                        <option value="bedrock">Bedrock</option>
                        <option value="bedrock-preview">Bedrock Preview</option>
                        <option value="pocketmine">PocketMine (plugins)</option>
                      </>
                    )}
                  </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.eulaAccepted} onChange={(e) => updateField('eulaAccepted', e.target.checked)} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>I accept the Minecraft EULA (required)</span>
                </label>
                <label>
                  RAM
                  <select value={form.ram} onChange={(e) => updateField('ram', e.target.value)}>
                    <option>1GB</option>
                    <option>2GB</option>
                    <option>4GB</option>
                    <option>8GB</option>
                  </select>
                </label>
                <label>
                  Storage
                  <select value={form.storage} onChange={(e) => updateField('storage', e.target.value)}>
                    <option>5GB</option>
                    <option>10GB</option>
                    <option>20GB</option>
                  </select>
                </label>
                <label>
                  Max Players
                  <input type="number" min="0" value={form.players} onChange={(e) => updateField('players', e.target.value)} />
                </label>
                <footer className="modal-footer">
                  <button type="button" className="btn" onClick={closeCreate}>Cancel</button>
                  <button type="submit" className="btn primary">{createLoading ? 'Creating…' : 'Create'}</button>
                </footer>
              </form>
            </div>
          </div>
        )}
        {manageOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-card">
              <header className="modal-header">
                <h3>Manage Servers</h3>
                <button className="modal-close" onClick={closeManage} aria-label="Close">✕</button>
              </header>
              <div className="modal-body">
                {/* Toasts */}
                <div className="toasts-ctn" aria-hidden>
                  {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.kind}`}>{t.message}</div>
                  ))}
                </div>
                {servers.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)' }}>No servers available.</div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {servers.map((s) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{s.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.ram} • {s.storage} • {s.players} players</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn" onClick={() => startEdit(s)}>Edit</button>
                          <button className="btn" onClick={() => removeServer(s.id)}>{deletingId === s.id ? 'Deleting…' : 'Delete'}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editing && (
                  <form onSubmit={applyEdit} style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label>
                      Name
                      <input value={editForm.name} onChange={(e) => updateEditField('name', e.target.value)} />
                    </label>                  <label>
                    Edition
                    <select value={editForm.edition} onChange={(e) => updateEditField('edition', e.target.value)}>
                      <option value="java">Java Edition</option>
                      <option value="bedrock">Bedrock Edition</option>
                    </select>
                  </label>
                  <label>
                    Server Type
                    <select value={editForm.serverType} onChange={(e) => updateEditField('serverType', e.target.value)}>
                      {editForm.edition === 'java' && (
                        <>
                          <option value="vanilla">Vanilla</option>
                          <option value="snapshot">Snapshot</option>
                          <option value="paper">Paper (plugins)</option>
                          <option value="spigot">Spigot (plugins)</option>
                          <option value="purpur">Purpur (plugins)</option>
                          <option value="fabric">Fabric (mods)</option>
                          <option value="quilt">Quilt (mods)</option>
                          <option value="glowstone">Glowstone (plugins)</option>
                          <option value="neoforge">NeoForge (mods)</option>
                          <option value="forge">Forge (mods)</option>
                          <option value="modpack">Modpack</option>
                          <option value="arclight">Arclight (plugins/mods)</option>
                        </>
                      )}
                      {editForm.edition === 'bedrock' && (
                        <>
                          <option value="bedrock">Bedrock</option>
                          <option value="bedrock-preview">Bedrock Preview</option>
                          <option value="pocketmine">PocketMine (plugins)</option>
                        </>
                      )}
                    </select>
                  </label>                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={editForm.eulaAccepted} onChange={(e) => updateEditField('eulaAccepted', e.target.checked)} />
                      <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>EULA accepted</span>
                    </label>
                    <label>
                      RAM
                      <select value={editForm.ram} onChange={(e) => updateEditField('ram', e.target.value)}>
                        <option>1GB</option>
                        <option>2GB</option>
                        <option>4GB</option>
                        <option>8GB</option>
                      </select>
                    </label>
                    <label>
                      Storage
                      <select value={editForm.storage} onChange={(e) => updateEditField('storage', e.target.value)}>
                        <option>5GB</option>
                        <option>10GB</option>
                        <option>20GB</option>
                      </select>
                    </label>
                    <label>
                      Max Players
                      <input type="number" min="0" value={editForm.players} onChange={(e) => updateEditField('players', e.target.value)} />
                    </label>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
                      <button type="submit" className="btn primary">Save</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

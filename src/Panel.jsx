import { useEffect, useState, useRef } from 'react';
import './Panel.css';
import { startServer, stopServer, restartServer, execCommand } from './serverApi';
import {
  TerminalIcon,
  FolderIcon,
  SlidersIcon,
  GlobeIcon,
  PuzzleIcon,
  GearIcon,
  MicrochipIcon,
  RamIcon,
  StorageIcon,
  PlayIcon,
  RefreshIcon,
  CrownIcon,
  DoorIcon,
  BanIcon,
  CheckIcon
} from './icons';
import { ClipboardIcon } from './icons';

// Provide a small set of version-aware command suggestions.
const COMMAND_SETS = {
  '1.8': [
    'op <playername>',
    'deop <playername>',
    'whitelist add <playername>',
    'whitelist remove <playername>',
    'gamemode survival',
    'gamemode creative',
    'say Hello',
    'kick <playername>'
  ],
  '1.12': [
    'op <playername>',
    'deop <playername>',
    'whitelist add <playername>',
    'whitelist remove <playername>',
    'gamemode survival',
    'gamemode creative',
    'save-all',
    'list',
    'say Hello everyone',
    'kick <playername> [reason]'
  ],
  'modern': [
    'op <playername>',
    'deop <playername>',
    'whitelist add <playername>',
    'whitelist remove <playername>',
    'gamemode survival',
    'gamemode creative',
    'save-all',
    'list',
    'say Hello everyone',
    'kick <playername> [reason]',
    'weather clear',
    'time set day'
  ]
};

function getCommandsForVersion(v) {
  if (!v) return COMMAND_SETS.modern;
  if (v.startsWith('1.8')) return COMMAND_SETS['1.8'];
  if (v.startsWith('1.12') || v.startsWith('1.13')) return COMMAND_SETS['1.12'];
  return COMMAND_SETS.modern;
}

function randomIp() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

function ConsoleTab({ logs, onSend, selectedVersion, domain, playAddr, onCopy }) {
  const [cmd, setCmd] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [copied, setCopied] = useState(false);

  function update(v) {
    setCmd(v);
    if (!v) return setFiltered([]);
    const q = v.toLowerCase();
    const commands = getCommandsForVersion(selectedVersion);
    setFiltered(commands.filter((c) => c.toLowerCase().includes(q)).slice(0, 6));
  }

  return (
    <div className="tab-content">
      <div className="console-header">
        <div className="console-server">
          <div className="console-server-name">{domain || 'yourusername.lighthost.serv.net'}</div>
          <div className="console-server-ip">{playAddr || `play.${(domain||'yourusername.lighthost.serv.net').split('.')[0]}.shulkercraft.com`}</div>
        </div>
        <div className="console-header-actions">
          <button className="btn small secondary" onClick={() => { try { (onCopy || (() => {}))(); setCopied(true); setTimeout(()=>setCopied(false),1400);} catch(e){ (onCopy || (() => {}))(); } }}>
            {copied ? 'Copied' : 'Copy IP'}
          </button>
        </div>
      </div>

      <div className="log-lines console">
        {logs.length === 0 ? <div className="muted">No console output</div> : logs.map((l, i) => <div key={i} className="log">{l}</div>)}
      </div>
      <form className="console-form" onSubmit={(e) => { e.preventDefault(); if (!cmd) return; onSend(cmd); setCmd(''); setFiltered([]); }}>
        <input value={cmd} onChange={(e)=>update(e.target.value)} placeholder="Type a command..." />
        <button className="btn">Send</button>
        {filtered.length > 0 && (
          <div className="suggestions">
            {filtered.map((s, i) => (
              <div key={i} className="suggestion" onClick={() => { onSend(s); setCmd(''); setFiltered([]); }}>{s}</div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

function FilesTab({ files, onDownload }) {
  return (
    <div className="tab-content">
      <div className="file-list">
        {files.length === 0 && <div className="muted">No files</div>}
        {files.map((f, i) => (
          <div key={i} className="file-row">
            <div className="file-name">{f.name}</div>
            <div className="file-actions">
              <button className="btn" onClick={() => onDownload(f)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseTab({ db, onInsert }) {
  const [k, setK] = useState('');
  const [v, setV] = useState('');
  return (
    <div className="tab-content">
      <div className="db-list">
        {Object.keys(db).length === 0 && <div className="muted">No records</div>}
        {Object.entries(db).map(([key, val]) => (
          <div key={key} className="db-row"><strong>{key}</strong>: {val}</div>
        ))}
      </div>
      <form className="db-form" onSubmit={(e)=>{e.preventDefault(); onInsert(k,v); setK(''); setV('');}}>
        <input placeholder="key" value={k} onChange={(e)=>setK(e.target.value)} />
        <input placeholder="value" value={v} onChange={(e)=>setV(e.target.value)} />
        <button className="btn">Insert</button>
      </form>
    </div>
  );
}

function BackupsTab({ backups, onDownload, onRestore }) {
  return (
    <div className="tab-content">
      <div className="backup-list">
        {backups.length === 0 && <div className="muted">No backups</div>}
        {backups.map((b, i) => (
          <div key={i} className="backup-row">
            <div>{b.name} — {b.date}</div>
            <div className="file-actions">
              <button className="btn" onClick={() => onDownload(b)}>Download</button>
              <button className="btn" onClick={() => onRestore(b)}>Restore</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigTab({ config, onSave }) {
  const [local, setLocal] = useState({ ...config });
  return (
    <div className="tab-content">
      <form className="config-form" onSubmit={(e)=>{e.preventDefault(); onSave(local);}}>
        <label>Max RAM
          <input value={local.maxRam} onChange={(e)=>setLocal({...local, maxRam: e.target.value})} />
        </label>
        <label>Auto-backup
          <select value={local.autoBackup} onChange={(e)=>setLocal({...local, autoBackup: e.target.value})}>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="off">off</option>
          </select>
        </label>
        <button className="btn">Save</button>
      </form>
    </div>
  );
}

function PluginsTab({ plugins, onDownloadPlugin }) {
  return (
    <div className="tab-content">
      <div className="plugin-list">
        {plugins.map((p, i) => (
          <div key={i} className="plugin-row">
            <div>
              <strong>{p.name}</strong>
              <div className="muted">{p.version} — {p.description}</div>
            </div>
            <div className="file-actions">
              <button className="btn" onClick={() => onDownloadPlugin(p)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilesPluginsTab({ pluginFiles, onUpload, onDownload }) {
  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    onUpload(files);
    e.target.value = null;
  }

  return (
    <div className="tab-content">
      <div style={{ marginBottom: 12 }}>
        <label className="btn primary">
          Upload plugins
          <input type="file" accept=".jar,.zip" multiple onChange={handleFiles} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="file-list">
        {pluginFiles.length === 0 && <div className="muted">No plugins uploaded</div>}
        {pluginFiles.map((f, i) => (
          <div key={i} className="file-row">
            <div className="file-name">{f.name}</div>
            <div className="file-actions">
              <button className="btn" onClick={() => onDownload(f)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayersTab() {
  const [playerMode, setPlayerMode] = useState(null);
  const [ops, setOps] = useState([{ id: 1, name: 'Admin' }]);
  const [kicked, setKicked] = useState([]);
  const [banned, setBanned] = useState([]);
  const [whitelist, setWhitelist] = useState([{ id: 1, name: 'Player1' }]);
  const [inputName, setInputName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  const [knownPlayers] = useState(['Player1', 'alice', 'bob', 'Admin']);

  function playerExists(name) {
    if (!name) return false;
    return knownPlayers.some((p) => p.toLowerCase() === name.toLowerCase());
  }

  function addToList(list, setList) {
    const name = inputName.trim();
    if (!name) return;
    if (!playerExists(name)) {
      setPopupMsg('Player data not found');
      setShowPopup(true);
      return;
    }
    setList([...list, { id: Date.now(), name }]);
    setInputName('');
  }

  function removeFromList(list, setList, id) {
    setList(list.filter((item) => item.id !== id));
  }

  const Popup = () => (
    showPopup ? (
      <div className="popup-overlay">
        <div className="popup-box">
          <p>{popupMsg}</p>
          <div className="popup-actions">
            <button className="btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      </div>
    ) : null
  );

  if (playerMode === 'op') {
    return (
      <div className="tab-content">
        <Popup />
        <button className="btn secondary" onClick={() => setPlayerMode(null)}>← Back</button>
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Operators (OP)</h3>
          <form onSubmit={(e) => { e.preventDefault(); addToList(ops, setOps); }} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input placeholder="Player name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
            <button className="btn primary">Add OP</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ops.length === 0 && <div className="muted">No operators</div>}
            {ops.map((op) => (
              <div key={op.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'rgba(22, 163, 74, 0.1)', borderRadius: 8, border: '1px solid #16a34a' }}>
                <span>{op.name}</span>
                <button className="btn danger" onClick={() => removeFromList(ops, setOps, op.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (playerMode === 'kick') {
    return (
      <div className="tab-content">
        <Popup />
        <button className="btn secondary" onClick={() => setPlayerMode(null)}>← Back</button>
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Kicked Players</h3>
          <form onSubmit={(e) => { e.preventDefault(); addToList(kicked, setKicked); }} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input placeholder="Player name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
            <button className="btn primary">Kick Player</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {kicked.length === 0 && <div className="muted">No kicked players</div>}
            {kicked.map((player) => (
              <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'rgba(217, 119, 6, 0.1)', borderRadius: 8, border: '1px solid #f59e0b' }}>
                <span>{player.name}</span>
                <button className="btn danger" onClick={() => removeFromList(kicked, setKicked, player.id)}>Unkick</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (playerMode === 'ban') {
    return (
      <div className="tab-content">
        <Popup />
        <button className="btn secondary" onClick={() => setPlayerMode(null)}>← Back</button>
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Banned Players</h3>
          <form onSubmit={(e) => { e.preventDefault(); addToList(banned, setBanned); }} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input placeholder="Player name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
            <button className="btn primary">Ban Player</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {banned.length === 0 && <div className="muted">No banned players</div>}
            {banned.map((player) => (
              <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'rgba(197, 48, 48, 0.1)', borderRadius: 8, border: '1px solid #c53030' }}>
                <span>{player.name}</span>
                <button className="btn danger" onClick={() => removeFromList(banned, setBanned, player.id)}>Unban</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (playerMode === 'whitelist') {
    return (
      <div className="tab-content">
        <Popup />
        <button className="btn secondary" onClick={() => setPlayerMode(null)}>← Back</button>
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Whitelist</h3>
          <form onSubmit={(e) => { e.preventDefault(); addToList(whitelist, setWhitelist); }} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input placeholder="Player name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
            <button className="btn primary">Add to Whitelist</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {whitelist.length === 0 && <div className="muted">No whitelisted players</div>}
            {whitelist.map((player) => (
              <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'rgba(0, 102, 204, 0.1)', borderRadius: 8, border: '1px solid #0066cc' }}>
                <span>{player.name}</span>
                <button className="btn danger" onClick={() => removeFromList(whitelist, setWhitelist, player.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <Popup />
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Player Manager</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage players, view live data, and control access</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <button 
          className="player-management-card op"
          onClick={() => setPlayerMode('op')}
        >
          <div className="card-icon">👑</div>
          <div className="card-title">Operators</div>
          <div className="card-count">{ops.length}</div>
          <div className="card-desc">Manage OP players</div>
        </button>

        <button 
          className="player-management-card kick"
          onClick={() => setPlayerMode('kick')}
        >
          <div className="card-icon">🚪</div>
          <div className="card-title">Kicked</div>
          <div className="card-count">{kicked.length}</div>
          <div className="card-desc">Manage kicked players</div>
        </button>

        <button 
          className="player-management-card ban"
          onClick={() => setPlayerMode('ban')}
        >
          <div className="card-icon">🚫</div>
          <div className="card-title">Banned</div>
          <div className="card-count">{banned.length}</div>
          <div className="card-desc">Manage banned players</div>
        </button>

        <button 
          className="player-management-card whitelist"
          onClick={() => setPlayerMode('whitelist')}
        >
          <div className="card-icon">✅</div>
          <div className="card-title">Whitelist</div>
          <div className="card-count">{whitelist.length}</div>
          <div className="card-desc">Manage whitelisted players</div>
        </button>
      </div>
    </div>
  );
}

function InstancesTab() {
  return (
    <div className="tab-content">
      <div className="muted">Instances — Switch between multiple server setups (modded/vanilla)</div>
    </div>
  );
}

function SftpTab() {
  return (
    <div className="tab-content">
      <div className="muted">SFTP — Login information for Secure File Transfer Protocol connections</div>
    </div>
  );
}

function WorldsTab() {
  return (
    <div className="tab-content">
      <div className="muted">Worlds — Manage all uploaded or generated worlds</div>
    </div>
  );
}

function PresetsTab() {
  return (
    <div className="tab-content">
      <div className="muted">Presets — Install voice chat, Java-Bedrock crossplay, and more</div>
    </div>
  );
}

function ModsTab() {
  return (
    <div className="tab-content">
      <div className="muted">Mods — Browse mods from Curseforge and Modrinth</div>
    </div>
  );
}

function DatapacksTab() {
  return (
    <div className="tab-content">
      <div className="muted">Datapacks — Download VanillaTweaks datapacks by version and category</div>
    </div>
  );
}

function VersionTab() {
  return (
    <div className="tab-content">
      <div className="muted">Version — List all available server types and versions for easy installation</div>
    </div>
  );
}

function ModpacksTab() {
  return (
    <div className="tab-content">
      <div className="muted">Modpacks — Browse thousands from CurseForge, Modrinth, and FTB</div>
    </div>
  );
}

function PropertiesGeneralTab() {
  return (
    <div className="tab-content">
      <div className="muted">Properties — Configure all available server properties</div>
    </div>
  );
}

function WorldPropertiesTab() {
  return (
    <div className="tab-content">
      <div className="muted">World Properties — Configure world-related server properties</div>
    </div>
  );
}

function AdminTab() {
  return (
    <div className="tab-content">
      <div className="muted">Admin Properties — Configure admin-related server properties</div>
    </div>
  );
}

function SchedulesTab() {
  const [schedules, setSchedules] = useState([{ id: 1, type: 'restart', time: '03:00' }]);
  const [type, setType] = useState('restart');
  const [time, setTime] = useState('03:00');

  function addSchedule(e) {
    e.preventDefault();
    setSchedules((s) => [...s, { id: Date.now(), type, time }]);
    setTime('03:00');
  }

  function removeSchedule(id) {
    setSchedules((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="tab-content">
      <form className="db-form" onSubmit={addSchedule}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="restart">Restart</option>
          <option value="announce">Announcement</option>
        </select>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button className="btn">Add</button>
      </form>

      <div style={{ marginTop: 12 }}>
        {schedules.length === 0 && <div className="muted">No schedules</div>}
        {schedules.map((s) => (
          <div key={s.id} className="backup-row">
            <div>{s.type} at {s.time}</div>
            <div className="file-actions">
              <button className="btn" onClick={() => removeSchedule(s.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkTab() {
  const [port, setPort] = useState(25565);
  const [subdomain, setSubdomain] = useState('play');
  const [subs, setSubs] = useState([{ id: 1, name: 'play', domain: 'example.com' }]);

  function addSub(e) {
    e.preventDefault();
    setSubs((s) => [...s, { id: Date.now(), name: subdomain, domain: 'example.com' }]);
    setSubdomain('');
  }

  function removeSub(id) { setSubs((s) => s.filter(x => x.id !== id)); }

  return (
    <div className="tab-content">
      <form className="db-form" onSubmit={(e) => { e.preventDefault(); }}> 
        <label style={{ marginRight: 8 }}>Port
          <input value={port} onChange={(e) => setPort(Number(e.target.value))} />
        </label>
        <button className="btn">Save Port</button>
      </form>

      <form className="db-form" onSubmit={addSub} style={{ marginTop: 12 }}>
        <input placeholder="subdomain" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} />
        <button className="btn">Add Subdomain</button>
      </form>

      <div style={{ marginTop: 12 }}>
        {subs.map(s => (
          <div key={s.id} className="backup-row">
            <div>{s.name}.{s.domain}</div>
            <div className="file-actions"><button className="btn" onClick={() => removeSub(s.id)}>Remove</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([{ id: 1, name: 'alice', role: 'admin' }]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('viewer');

  function addUser(e) {
    e.preventDefault();
    setUsers(u => [...u, { id: Date.now(), name, role }]);
    setName('');
  }

  function removeUser(id) { setUsers(u => u.filter(x => x.id !== id)); }

  return (
    <div className="tab-content">
      <form className="db-form" onSubmit={addUser}>
        <input placeholder="username" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button className="btn">Add User</button>
      </form>

      <div style={{ marginTop: 12 }}>
        {users.map(u => (
          <div key={u.id} className="backup-row">
            <div>{u.name} — {u.role}</div>
            <div className="file-actions"><button className="btn" onClick={() => removeUser(u.id)}>Remove</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartupTab() {
  return (
    <div className="tab-content">
      <div className="muted">Startup — Modify startup parameters and JVM flags</div>
    </div>
  );
}

function ActivityTab({ logs }) {
  return (
    <div className="tab-content">
      <div className="log-lines console">
        {logs.length === 0 ? <div className="muted">No activity logged</div> : logs.map((l, i) => <div key={i} className="log">{l}</div>)}
      </div>
    </div>
  );
}

export default function Panel({ serverId = 'demo' }) {
  const [tab, setTab] = useState('console-general');
  const [name, setName] = useState('My Server');
  const [status, setStatus] = useState('stopped');
  const [ip, setIp] = useState(null);
  const [port] = useState(25565);
  const [selectedVersion, setSelectedVersion] = useState('1.20.1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  function addToast(message, kind = 'info') {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }
  const [logs, setLogs] = useState([]);
  const [files, setFiles] = useState([{ name: 'server.jar' }, { name: 'mods.zip' }]);
  const [pluginFiles, setPluginFiles] = useState([]);
  const [db, setDb] = useState({});
  const [backups, setBackups] = useState([{ name: 'backup-1.zip', date: '2026-01-01' }]);
  const [config, setConfig] = useState({ maxRam: '8G', autoBackup: 'daily' });
  const [cpu, setCpu] = useState(12);
  const [memory, setMemory] = useState(3.2);
  const [players, setPlayers] = useState(4);
  const [storage, setStorage] = useState(12);
  const [domain, setDomain] = useState('');
  const [playAddr, setPlayAddr] = useState('');
  const pluginsRef = useRef([{ name: 'EssentialsX', version: '2.19.0', description: 'Essential server utilities' }, { name: 'WorldEdit', version: '7.2.12', description: 'In-game world editing' }]);

  useEffect(() => {
    setLogs([`${new Date().toLocaleTimeString()}: Panel ready`]);
  }, []);

  useEffect(() => {
    try { document.body.classList.add('force-desktop'); } catch (e) { }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.max(5, Math.floor(Math.random() * 95)));
      setMemory(parseFloat((Math.random() * 7.9 + 0.1).toFixed(1)));
      setPlayers(Math.floor(Math.random() * 20));
      setStorage(Math.max(8, Math.floor(Math.random() * 95)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  function appendLog(line) {
    setLogs((s) => [...s, `${new Date().toLocaleTimeString()}: ${line}`]);
  }

  async function handleCreate(e) {
    if (e && e.preventDefault) e.preventDefault();
    const accepted = window.confirm('Do you accept the EULA? Click OK to accept.');
    if (!accepted) {
      appendLog('EULA not accepted; start cancelled');
      return;
    }

    setStatus('starting');
    appendLog(`EULA accepted`);
    appendLog(`Downloading Minecraft version ${selectedVersion}...`);
    setIp(null);

    setIsProcessing(true);
    try {
      const res = await startServer(serverId, selectedVersion);
      appendLog(`Downloaded Minecraft version ${res.version}`);
      const generatedIp = randomIp();
      setIp(generatedIp);
      // derive domain and play address from server name (username)
      const user = (name || 'yourusername').toString().trim().toLowerCase().replace(/[^a-z0-9\-]/g, '') || 'yourusername';
      setDomain(`${user}.lighthost.serv.net`);
      setPlayAddr(`play.${user}.shulkercraft.com`);
      setStatus(res.status || 'online');
      appendLog(`Server is online at ${generatedIp}:${port}`);
      setFiles((fs) => [...fs, { name: `minecraft-server-${res.version}.jar` }]);
      addToast(`Server started (${res.version})`, 'success');
    } catch (err) {
      appendLog('Start failed');
      setStatus('stopped');
      addToast('Start failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleStop() {
    setStatus('stopping');
    appendLog('Stopping server...');
    setIsProcessing(true);
    stopServer(serverId).then(() => {
      setStatus('stopped');
      appendLog('Server stopped');
      setIp(null);
      addToast('Server stopped', 'success');
    }).catch(() => addToast('Stop failed', 'error')).finally(() => setIsProcessing(false));
  }

  function handleRestart() {
    if (status !== 'online') return;
    setStatus('starting');
    appendLog('Restarting server...');
    setIsProcessing(true);
    restartServer(serverId).then(() => {
      setStatus('online');
      appendLog('Server restarted');
      addToast('Server restarted', 'success');
    }).catch(() => addToast('Restart failed', 'error')).finally(() => setIsProcessing(false));
  }

  function sendCommand(cmd) {
    appendLog(`> ${cmd}`);
    execCommand(serverId, cmd).then((res) => {
      appendLog(res.output || '');
      if (res && res.output) addToast(res.output, 'info');
    }).catch(() => {
      appendLog('Command failed');
      addToast('Command failed', 'error');
    });
  }

  function copyPlayAddr() {
    if (!playAddr) return addToast('No address to copy', 'error');
    try {
      navigator.clipboard.writeText(playAddr);
      addToast('Address copied', 'success');
    } catch (e) {
      addToast('Copy failed', 'error');
    }
  }

  function downloadFile(file) {
    const content = `This is a mock file: ${file.name}`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    appendLog(`Downloaded ${file.name}`);
  }

  function insertDb(k, v) {
    setDb((d) => ({ ...d, [k]: v }));
    appendLog(`DB insert ${k}=${v}`);
  }

  function downloadBackup(b) {
    const content = `Backup ${b.name}`;
    const blob = new Blob([content], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = b.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    appendLog(`Downloaded backup ${b.name}`);
  }

  function restoreBackup(b) {
    appendLog(`Restoring ${b.name}...`);
    setTimeout(() => appendLog(`Restore complete: ${b.name}`), 900);
  }

  function saveConfig(newConfig) {
    setConfig(newConfig);
    appendLog('Configuration saved');
  }

  function downloadPlugin(p) {
    const content = `Mock plugin ${p.name} v${p.version}`;
    const blob = new Blob([content], { type: 'application/java-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.name.replace(/\s+/g, '_')}.jar`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    appendLog(`Plugin downloaded: ${p.name}`);
  }

  function uploadPlugins(files) {
    const entries = files.map((f) => ({ name: f.name, file: f }));
    setPluginFiles((p) => [...p, ...entries]);
    entries.forEach((e) => appendLog(`Plugin uploaded: ${e.name}`));
  }

  function downloadPluginFile(f) {
    const fileObj = f.file;
    if (!fileObj) {
      appendLog(`No file data for ${f.name}`);
      return;
    }
    const url = URL.createObjectURL(fileObj);
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    appendLog(`Downloaded plugin: ${f.name}`);
  }

  return (
    <div className="panel-root">
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind || 'info'}`}>{t.message}</div>
        ))}
      </div>
      <div className="panel-card">
        <div className="panel-header top">
          <div className="top-nav">
            <button className={`nav-item ${tab==='console-general' ? 'active' : ''}`} onClick={() => setTab('console-general')}>
              <TerminalIcon className="nav-icon" /><span className="label">Console</span>
            </button>
            <button className={`nav-item ${tab==='files-general' ? 'active' : ''}`} onClick={() => setTab('files-general')}>
              <FolderIcon className="nav-icon" /><span className="label">Files</span>
            </button>
            <button className={`nav-item ${tab==='properties-general' ? 'active' : ''}`} onClick={() => setTab('properties-general')}>
              <SlidersIcon className="nav-icon" /><span className="label">Properties</span>
            </button>
            <button className={`nav-item ${tab==='worlds' ? 'active' : ''}`} onClick={() => setTab('worlds')}>
              <GlobeIcon className="nav-icon" /><span className="label">Worlds</span>
            </button>
            <button className={`nav-item ${tab==='addons-presets' ? 'active' : ''}`} onClick={() => setTab('addons-presets')}>
              <PuzzleIcon className="nav-icon" /><span className="label">Addons</span>
            </button>
            <button className={`nav-item ${tab==='settings-general' ? 'active' : ''}`} onClick={() => setTab('settings-general')}>
              <GearIcon className="nav-icon" /><span className="label">Settings</span>
            </button>
          </div>

          <div className="header-controls">
            <div className={`status-badge ${status==='online'?'online':''}`}>{status==='online'?'ONLINE':status.toUpperCase()}</div>
            <div className="server-box">
              <div className="server-domain">{domain || `${(name||'yourusername').toLowerCase()}.lighthost.serv.net`}</div>
              <button className="copy-btn" onClick={copyPlayAddr} title="Copy play address"><ClipboardIcon /></button>
            </div>
            <div className="action-buttons">
              <button className="pill start" onClick={handleCreate}><span className="icon">▶️</span> START</button>
              <button className="pill restart" onClick={handleRestart}><span className="icon">🔁</span> RESTART</button>
            </div>
          </div>
        </div>

        <div className="panel-layout">
          <div className="main fullwidth">
            <div className="panel-body console-container">
              {tab === 'console-general' && (
                <div className="console-panel-wrapper console-two-col">
                  <div className="console-main terminal-large">
                    <ConsoleTab logs={logs} onSend={sendCommand} selectedVersion={selectedVersion} domain={domain} playAddr={playAddr} onCopy={copyPlayAddr} />
                  </div>

                  <aside className="console-side gauges-column">
                    <div className="gauges">
                      <div className="gauge-card">
                        <div className="gauge-label"><MicrochipIcon className="gauge-icon" /> CPU Usage</div>
                        <div className="gauge-dial" style={{ ['--value']: cpu }} data-value={cpu}></div>
                        <div className="gauge-value">{cpu}%</div>
                      </div>

                      <div className="gauge-card">
                        <div className="gauge-label"><RamIcon className="gauge-icon" /> Memory Usage</div>
                        <div className="gauge-dial" style={{ ['--value']: Math.min(100, Math.round((memory / 8) * 100)) }} data-value={memory}></div>
                        <div className="gauge-value">{memory} GB</div>
                      </div>

                      <div className="gauge-card">
                        <div className="gauge-label"><StorageIcon className="gauge-icon" /> Disk Usage</div>
                        <div className="gauge-dial" style={{ ['--value']: storage }} data-value={storage}></div>
                        <div className="gauge-value">{storage} GB</div>
                      </div>
                    </div>
                  </aside>
                </div>
              )}
              {tab === 'console-players' && <PlayersTab />}
              {tab === 'files-general' && <FilesTab files={files} onDownload={downloadFile} />}
              {tab === 'files-instances' && <InstancesTab />}
              {tab === 'files-sftp' && <SftpTab />}
              {tab === 'files-databases' && <DatabaseTab db={db} onInsert={insertDb} />}
              {tab === 'files-backups' && <BackupsTab backups={backups} onDownload={downloadBackup} onRestore={restoreBackup} />}
              {tab === 'properties-general' && <PropertiesGeneralTab />}
              {tab === 'properties-world' && <WorldPropertiesTab />}
              {tab === 'properties-admin' && <AdminTab />}
              {tab === 'worlds' && <WorldsTab />}
              {tab === 'addons-presets' && <PresetsTab />}
              {tab === 'addons-mods' && <ModsTab />}
              {tab === 'addons-datapacks' && <DatapacksTab />}
              {tab === 'files-plugins' && <FilesPluginsTab pluginFiles={pluginFiles} onUpload={uploadPlugins} onDownload={downloadPluginFile} />}
              {tab === 'version-version' && <VersionTab />}
              {tab === 'version-modpacks' && <ModpacksTab />}
              {tab === 'settings-general' && <ConfigTab config={config} onSave={saveConfig} />}
              {tab === 'settings-schedules' && <SchedulesTab />}
              {tab === 'settings-network' && <NetworkTab />}
              {tab === 'settings-users' && <UsersTab />}
              {tab === 'settings-startup' && <StartupTab />}
              {tab === 'settings-activity' && <ActivityTab logs={logs} />}
            </div>
          </div>
        </div>

        <div className="panel-note">
          This is a client-side mock. In production the panel would call server APIs to manage real VMs/containers, files, databases and plugin repositories.
        </div>
      </div>
    </div>
  );
}

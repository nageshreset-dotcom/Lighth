// Simple client-side mock API that simulates network latency
// Start with no pre-created servers — require manual creation via UI
const servers = [];

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchServers() {
  await wait(600 + Math.random() * 400);
  return servers.slice();
}

// Only allow manual server creation via UI (function kept for manual use)
export async function createServer(data) {
  await wait(800 + Math.random() * 600);
  const s = { id: `srv-${Date.now()}`, status: 'provisioning', ...data };
  servers.push(s);
  return s;
}

export async function deleteServer(id) {
  await wait(200 + Math.random() * 300);
  const idx = servers.findIndex((s) => s.id === id);
  if (idx !== -1) servers.splice(idx, 1);
  return { ok: true };
}

export async function updateServer(id, data) {
  await wait(200 + Math.random() * 300);
  const s = servers.find((x) => x.id === id);
  if (!s) return { ok: false, error: 'not found' };
  Object.assign(s, data);
  return { ok: true, server: s };
}

export async function getPlugins(id) {
  await wait(300 + Math.random() * 200);
  const defaultPlugins = [
    { name: 'EssentialsX', version: '2.19.0', status: 'enabled' },
    { name: 'WorldEdit', version: '7.2.12', status: 'enabled' },
    { name: 'CoreProtect', version: '20.5', status: 'disabled' }
  ];
  return defaultPlugins;
}

export async function installPlugin(id, pluginName) {
  await wait(500 + Math.random() * 800);
  return { ok: true, plugin: { name: pluginName, version: '1.0', status: 'enabled' } };
}

export async function uninstallPlugin(id, pluginName) {
  await wait(300 + Math.random() * 400);
  return { ok: true };
}

export async function startServer(id, version = '1.20.1') {
  await wait(600 + Math.random() * 500);
  const s = servers.find((x) => x.id === id) || servers[0];
  s.status = 'starting';
  await wait(400 + Math.random() * 600);
  s.status = 'online';
  s.version = version;
  return { ok: true, status: s.status, version };
}

export async function stopServer(id) {
  await wait(300 + Math.random() * 400);
  const s = servers.find((x) => x.id === id) || servers[0];
  s.status = 'stopped';
  return { ok: true, status: s.status };
}

export async function restartServer(id) {
  await wait(300 + Math.random() * 300);
  const s = servers.find((x) => x.id === id) || servers[0];
  s.status = 'starting';
  await wait(500 + Math.random() * 500);
  s.status = 'online';
  return { ok: true, status: s.status };
}

// Very small command executor simulating server responses for common Minecraft commands
export async function execCommand(id, cmd) {
  await wait(120 + Math.random() * 200);
  const normalized = (cmd || '').trim();
  if (!normalized) return { ok: false, output: 'No command entered' };

  const parts = normalized.split(/\s+/);
  const base = parts[0].toLowerCase();

  if (base === 'op') {
    return { ok: true, output: `Gave ${parts[1] || '<name>'} operator permissions` };
  }
  if (base === 'whitelist' && parts[1] === 'add') {
    return { ok: true, output: `Added ${parts.slice(2).join(' ')} to whitelist` };
  }
  if (base === 'gamemode') {
    return { ok: true, output: `Set gamemode to ${parts[1] || 'survival'}` };
  }
  if (base === 'save-all') {
    return { ok: true, output: 'Saved the world (save-all)' };
  }
  if (base === 'list') {
    return { ok: true, output: 'There are 3/20 players online: alice, bob, charlie' };
  }

  // generic echo for unknown commands
  return { ok: true, output: `Executed: ${normalized}` };
}

export default { fetchServers, createServer, deleteServer, updateServer, getPlugins, installPlugin, uninstallPlugin, startServer, stopServer, restartServer, execCommand };

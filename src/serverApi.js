import mock from './mockServerApi';

async function postJSON(path, payload) {
  const API_BASE = (typeof window !== 'undefined' && window.location)
    ? `${window.location.protocol}//${window.location.hostname}:4001`
    : '';
  try {
    const url = API_BASE ? `${API_BASE}/${path}` : `/api/${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('bad');
    return await res.json();
  } catch (err) {
    // Fallback to mock API for development/offline
    return null;
  }
}

export async function startServer(id, version = '1.20.1') {
  const remote = await postJSON('server/start', { id, version });
  if (remote) return remote;
  return mock.startServer(id, version);
}

export async function stopServer(id) {
  const remote = await postJSON('server/stop', { id });
  if (remote) return remote;
  return mock.stopServer(id);
}

export async function restartServer(id) {
  const remote = await postJSON('server/restart', { id });
  if (remote) return remote;
  return mock.restartServer(id);
}

export async function execCommand(id, cmd) {
  const remote = await postJSON('server/exec', { id, cmd });
  if (remote) return remote;
  return mock.execCommand(id, cmd);
}

export default { startServer, stopServer, restartServer, execCommand };

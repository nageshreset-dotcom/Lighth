import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Basic in-memory server list — replace with a DB in production
const servers = [
  { id: 'srv-1', name: 'Survival', ram: '8G', storage: '16G', players: 'unlimited', status: 'online' },
  { id: 'srv-2', name: 'Creative', ram: '8G', storage: '16G', players: 'unlimited', status: 'stopped' },
];

// Simple token check for mutating endpoints
function checkToken(req, res, next) {
  const token = req.headers['x-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (!process.env.ADMIN_TOKEN) return next(); // dev convenience
  if (!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.get('/api/servers', (req, res) => {
  res.json({ servers });
});

app.post('/api/servers', checkToken, (req, res) => {
  const data = req.body || {};
  const s = { id: `srv-${Date.now()}`, status: 'provisioning', ...data };
  servers.push(s);
  res.json({ server: s });
});

app.delete('/api/servers/:id', checkToken, (req, res) => {
  const id = req.params.id;
  const idx = servers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  servers.splice(idx, 1);
  res.json({ ok: true });
});

// GPT proxy endpoint — server-side only, uses OPENAI_API_KEY from env
app.post('/api/gpt', async (req, res) => {
  const { prompt, opts } = req.body || {};
  if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'Prompt required' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured on server' });

  try {
    const body = {
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: prompt }],
      ...opts,
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: 'OpenAI API error', details: text });
    }
    const data = await r.json();
    const result = data.choices?.[0]?.message?.content || '';
    res.json({ result, raw: data });
  } catch (err) {
    console.error('GPT proxy error:', err);
    res.status(500).json({ error: 'GPT proxy failed', details: err.message });
  }
});

// Create HTTP server and WebSocket server for console streaming
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/console' });

wss.on('connection', (ws) => {
  console.log('Console WS client connected');
  ws.send(JSON.stringify({ type: 'welcome', message: 'Console connected' }));

  ws.on('message', (m) => {
    let msg = '';
    try { msg = m.toString(); } catch (e) { msg = String(m); }
    console.log('Console command received:', msg);
    // Echo command and stream some fake output lines
    ws.send(JSON.stringify({ type: 'echo', command: msg }));

    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      ws.send(JSON.stringify({ type: 'output', line: `> ${msg} — simulated output ${i}` }));
      if (i >= 6) {
        clearInterval(iv);
        ws.send(JSON.stringify({ type: 'done', message: 'Command complete' }));
      }
    }, 600);
  });

  ws.on('close', () => console.log('Console WS client disconnected'));
});

server.listen(PORT, () => {
  console.log(`Lighth server running on http://localhost:${PORT}`);
});

// --- Additional server control endpoints (start/stop/restart/exec, commands list) ---
import { getCommands } from './commands.js';

app.post('/api/server/start', checkToken, async (req, res) => {
  const { id, version = '1.20.1' } = req.body || {};
  const s = servers.find((x) => x.id === id) || servers[0];
  s.status = 'starting';
  s.version = version;
  // simulate download/provisioning
  setTimeout(() => { s.status = 'online'; }, 800);
  res.json({ ok: true, status: s.status, version });
});

app.post('/api/server/stop', checkToken, async (req, res) => {
  const { id } = req.body || {};
  const s = servers.find((x) => x.id === id) || servers[0];
  s.status = 'stopping';
  setTimeout(() => { s.status = 'stopped'; }, 400);
  res.json({ ok: true, status: 'stopping' });
});

app.post('/api/server/restart', checkToken, async (req, res) => {
  const { id } = req.body || {};
  const s = servers.find((x) => x.id === id) || servers[0];
  s.status = 'starting';
  setTimeout(() => { s.status = 'online'; }, 600);
  res.json({ ok: true, status: 'starting' });
});

app.post('/api/server/exec', checkToken, async (req, res) => {
  const { id, cmd } = req.body || {};
  if (!cmd) return res.status(400).json({ ok: false, output: 'No command provided' });
  const c = (cmd || '').trim();
  const parts = c.split(/\s+/);
  const base = parts[0].toLowerCase();

  if (base === 'op') return res.json({ ok: true, output: `Gave ${parts[1] || '<name>'} operator permissions` });
  if (base === 'whitelist' && parts[1] === 'add') return res.json({ ok: true, output: `Added ${parts.slice(2).join(' ')} to whitelist` });
  if (base === 'gamemode') return res.json({ ok: true, output: `Set gamemode to ${parts[1] || 'survival'}` });
  if (base === 'save-all') return res.json({ ok: true, output: 'Saved the world (save-all)' });
  if (base === 'list') return res.json({ ok: true, output: 'There are 3/20 players online: alice, bob, charlie' });

  return res.json({ ok: true, output: `Executed: ${c}` });
});

app.get('/api/commands', (req, res) => {
  const version = req.query.version || req.headers['x-mc-version'] || '1.20.1';
  res.json({ commands: getCommands(version) });
});

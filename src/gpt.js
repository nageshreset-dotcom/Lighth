// gpt.js — Client-side proxy helper for calling the backend GPT endpoint
// The real OpenAI API key must never be exposed client-side. A server proxy
// (server/index.js) receives requests from the client and forwards them to
// OpenAI using a server-side API key.

export async function gpt4_1(prompt, opts = {}) {
  if (!prompt || !prompt.trim()) return '';
  const res = await fetch('/api/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, opts }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'GPT proxy request failed');
  }
  const data = await res.json();
  return data.result || '';
}

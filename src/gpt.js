// gpt.js — Utility for GPT-4.1 API calls
// Replace YOUR_OPENAI_API_KEY with your actual key or use env vars in production

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'YOUR_OPENAI_API_KEY'; // TODO: Secure this in production

export async function gpt4_1(prompt, opts = {}) {
  const body = {
    model: 'gpt-4-1106-preview',
    messages: [{ role: 'user', content: prompt }],
    ...opts,
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

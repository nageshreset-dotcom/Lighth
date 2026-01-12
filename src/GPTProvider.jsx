import React, { createContext, useContext, useState } from 'react';
import { gpt4_1 } from './gpt';

const GptContext = createContext();

export function GPTProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState('');

  const askGpt = async (prompt) => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await gpt4_1(prompt);
      setLastResult(result);
    } catch (error) {
      setLastResult(`Error: ${error.message || 'Failed to get response'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GptContext.Provider value={{ askGpt, loading, lastResult }}>
      {children}
    </GptContext.Provider>
  );
}

export function useGpt() {
  const ctx = useContext(GptContext);
  if (!ctx) throw new Error('useGpt must be used within GPTProvider');
  return ctx;
}

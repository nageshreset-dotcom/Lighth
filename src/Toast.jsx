import React from 'react';
import './Dashboard.css';

export default function Toasts({ toasts = [], className = '' }) {
  return (
    <div className={`toast-container ${className}`} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind || 'info'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

import React, { useState } from 'react';

export default function Billing() {
  const [plan] = useState({ name: 'Professional', price: 29.99, nextBillingDate: '2024-02-15' });
  const [invoices] = useState([
    { id: 1, date: '2024-01-15', amount: 29.99, status: 'Paid' },
    { id: 2, date: '2023-12-15', amount: 29.99, status: 'Paid' },
    { id: 3, date: '2023-11-15', amount: 29.99, status: 'Paid' }
  ]);

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Billing & Management</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#10b981' }}>Current Plan</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '16px 0' }}>{plan.name}</p>
          <p style={{ margin: '8px 0', color: '#cbd5e1' }}>${plan.price}/month</p>
          <p style={{ margin: '8px 0', color: '#cbd5e1', fontSize: '14px' }}>Next billing: {plan.nextBillingDate}</p>
          <button style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '16px', fontWeight: 'bold' }}>Renew Now</button>
        </div>

        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#10b981' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Support Ticket</button>
            <button style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Contact Sales</button>
            <button style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Upgrade Plan</button>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '16px' }}>Invoice History</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #475569' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px' }}>{invoice.date}</td>
                  <td style={{ padding: '12px' }}>${invoice.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px', color: '#10b981' }}>{invoice.status}</td>
                  <td style={{ padding: '12px' }}><button style={{ padding: '6px 12px', background: '#475569', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

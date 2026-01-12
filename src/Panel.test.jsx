import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Panel from './Panel.jsx';

test('start server via UI and execute console command', async () => {
  // Accept EULA automatically for the test
  window.confirm = () => true;

  render(<Panel serverId="srv-test" />);

  // Click the Start button
  const startBtn = screen.getByRole('button', { name: /start/i });
  fireEvent.click(startBtn);

  // Wait for server to become online
  await waitFor(() => expect(screen.getByText(/Server is online at/)).toBeInTheDocument(), { timeout: 5000 });

  // Send a console command
  const input = screen.getByPlaceholderText(/Type a command/i);
  fireEvent.change(input, { target: { value: 'list' } });
  const sendBtn = screen.getByRole('button', { name: /send/i });
  fireEvent.click(sendBtn);

  // Expect the mock response from execCommand
  await waitFor(() => expect(screen.getByText(/There are 3\/20 players online/)).toBeInTheDocument(), { timeout: 3000 });
});

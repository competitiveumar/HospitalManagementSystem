import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Hospital Management System title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Hospital Management System/i);
  expect(titleElement).toBeInTheDocument();
});

import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Download Source Code link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Download Source Code/i);
  expect(linkElement).toBeInTheDocument();
});

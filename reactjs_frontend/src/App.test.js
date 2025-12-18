import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator container', () => {
  render(<App />);
  const region = screen.getByRole('region', { name: /calculator/i });
  expect(region).toBeInTheDocument();
});

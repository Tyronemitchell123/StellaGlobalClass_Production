import { render, screen, fireEvent } from '@testing-library/react';
import Home from './page';

describe('Landing Page - Velocities', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('renders hero section with title and description', () => {
    expect(screen.getByText('Velocities')).toBeInTheDocument();
    expect(screen.getByText(/Luxury Chauffeur Service Redefined/i)).toBeInTheDocument();
  });

  test('renders premium services section', () => {

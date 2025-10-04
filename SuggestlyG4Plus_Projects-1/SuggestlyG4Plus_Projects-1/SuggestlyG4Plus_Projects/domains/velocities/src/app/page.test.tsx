import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

describe('Landing Page - Velocities', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('renders hero section with title and description', () => {
    const velocitiesTitles = screen.getAllByText('VELOCITIES');
    expect(velocitiesTitles.length).toBeGreaterThan(0);
    expect(screen.getByText('ADVANCED')).toBeInTheDocument();
    expect(screen.getByText('MOBILITY')).toBeInTheDocument();
    expect(screen.getByText(/Experience the future of luxury transportation with AI-powered routing/i)).toBeInTheDocument();
  });

  test('renders premium fleet section', () => {
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.getByText('FLEET')).toBeInTheDocument();
    expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    expect(screen.getByText('BMW i7')).toBeInTheDocument();
    expect(screen.getByText('Rolls Royce Spectre')).toBeInTheDocument();
  });

  test('renders AI-powered booking section', () => {
    expect(screen.getByText('AI-POWERED')).toBeInTheDocument();
    expect(screen.getByText('BOOKING')).toBeInTheDocument();
    expect(screen.getByText(/Our intelligent system optimizes your route/i)).toBeInTheDocument();
  });

  test('renders booking form and allows input', () => {
    const pickupInput = screen.getByPlaceholderText('Pickup Location');
    fireEvent.change(pickupInput, { target: { value: '123 Main St' } });
    expect(pickupInput.value).toBe('123 Main St');

    const destinationInput = screen.getByPlaceholderText('Destination');
    fireEvent.change(destinationInput, { target: { value: '456 Elm St' } });
    expect(destinationInput.value).toBe('456 Elm St');

    const dateInput = screen.getByPlaceholderText('Select date') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-10-01' } });
    expect(dateInput.value).toBe('2024-10-01');

    const timeInput = screen.getByPlaceholderText('Select time') as HTMLInputElement;
    fireEvent.change(timeInput, { target: { value: '12:00' } });
    expect(timeInput.value).toBe('12:00');
  });

  test('renders vehicle type selection', () => {
    expect(screen.getByText('Vehicle Class')).toBeInTheDocument();
    expect(screen.getByText('Executive Sedan')).toBeInTheDocument();
    expect(screen.getByText('Luxury Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Ultra-Luxury')).toBeInTheDocument();
  });

  test('renders tech stats', () => {
    expect(screen.getByText('AI Routes')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('< 2min')).toBeInTheDocument();
    expect(screen.getByText('Cities')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Vehicles')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
  });

  test('renders footer with contact info', () => {
    expect(screen.getByText(/Premium chauffeur service providing luxury transportation solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone: \+1 \(555\) 123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: info@velocities.ltd/i)).toBeInTheDocument();
  });
});

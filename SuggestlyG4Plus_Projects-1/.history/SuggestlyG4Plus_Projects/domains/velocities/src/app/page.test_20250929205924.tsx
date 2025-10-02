import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

describe('Landing Page - Velocities', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('renders hero section with title and description', () => {
    const titles = screen.getAllByText('Velocities');
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getByText(/Luxury Chauffeur Service Redefined/i)).toBeInTheDocument();
  });

  test('renders premium services section', () => {
    expect(screen.getByText('Our Premium Services')).toBeInTheDocument();
    const airportTransfers = screen.getAllByText('Airport Transfers');
    expect(airportTransfers.length).toBeGreaterThan(0);
    expect(screen.getByText('Corporate Travel')).toBeInTheDocument();
    expect(screen.getByText('Special Events')).toBeInTheDocument();
  });

  test('renders booking form and allows input', () => {
    const pickupInput = screen.getByPlaceholderText('Enter pickup address');
    fireEvent.change(pickupInput, { target: { value: '123 Main St' } });
    expect(pickupInput.value).toBe('123 Main St');

    const destinationInput = screen.getByPlaceholderText('Enter destination');
    fireEvent.change(destinationInput, { target: { value: '456 Elm St' } });
    expect(destinationInput.value).toBe('456 Elm St');

    // Adjusted to query by placeholder instead of label due to missing form control association
    const dateInput = screen.getByPlaceholderText('Select date');
    fireEvent.change(dateInput, { target: { value: '2024-10-01' } });
    expect(dateInput.value).toBe('2024-10-01');

    const timeInput = screen.getByPlaceholderText('Select time');
    fireEvent.change(timeInput, { target: { value: '12:00' } });
    expect(timeInput.value).toBe('12:00');
  });

  test('renders footer with contact info', () => {
    expect(screen.getByText(/Premium chauffeur service providing luxury transportation solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone: \+1 \(555\) 123-4567/i)).toBeInTheDocument();
  });

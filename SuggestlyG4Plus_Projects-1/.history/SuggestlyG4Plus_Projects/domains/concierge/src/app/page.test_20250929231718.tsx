import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConciergeLandingPage from './page';

describe('ConciergeLandingPage', () => {
  beforeEach(() => {
    render(<ConciergeLandingPage />);
  });

  test('renders hero section with title and subtitle', () => {
    expect(screen.getByText(/Comprehensive AI Concierge/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience the future of premium lifestyle management/i)).toBeInTheDocument();
  });

  test('renders navigation menu links', () => {

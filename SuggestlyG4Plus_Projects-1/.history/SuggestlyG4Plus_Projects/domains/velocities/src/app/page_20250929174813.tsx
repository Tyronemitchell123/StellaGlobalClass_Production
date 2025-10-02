'use client';

import { useState } from 'react';

export default function Home() {
  const [bookingForm, setBookingForm] = useState({
    pickup: '',
    destination: '',

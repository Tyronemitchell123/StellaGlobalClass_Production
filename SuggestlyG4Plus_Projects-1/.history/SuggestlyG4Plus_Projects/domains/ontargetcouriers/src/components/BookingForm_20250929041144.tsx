'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Package, Phone, Mail, MessageSquare, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingFormData } from '@/types';
import toast from 'react-hot-toast';

const bookingSchema = z.object({
  pickupAddress: z.string().min(10, 'Pickup address must be at least 10 characters'),
  deliveryAddress: z.string().min(10, 'Delivery address must be at least 10 characters'),
  packageDescription: z.string().min(5, 'Package description is required'),
  packageWeight: z.number().min(0.1, 'Weight must be at least 0.1 kg').max(50, 'Weight cannot exceed 50 kg'),
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  contactPhone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  contactEmail: z.string().email('Invalid email address'),
  specialInstructions: z.string().optional(),
  serviceType: z.enum(['same-day', 'express', 'standard']),
});

type BookingFormInputs = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit?: (data: BookingFormData) => void;
}

export function BookingForm({ onSubmit }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: 'standard',
    },
  });

  const serviceType = watch('serviceType');

  const onSubmitForm = async (data: BookingFormInputs) => {
    setIsSubmitting(true);

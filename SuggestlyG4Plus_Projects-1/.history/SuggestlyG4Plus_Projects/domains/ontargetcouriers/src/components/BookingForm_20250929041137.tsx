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

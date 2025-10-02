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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingData: BookingFormData = {
        ...data,
        packageWeight: Number(data.packageWeight),
      };

      if (onSubmit) {
        onSubmit(bookingData);
      }

      toast.success('Booking submitted successfully! You will receive a confirmation email shortly.');
      reset();
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServicePrice = (type: string) => {
    switch (type) {
      case 'same-day': return '$29.99';
      case 'express': return '$19.99';
      case 'standard': return '$9.99';
      default: return '$9.99';
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Delivery</h3>
        <p className="text-gray-600">Fast, reliable, and AI-optimized delivery service</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Service Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'standard', label: 'Standard', price: '$9.99', time: '2-3 days' },
              { value: 'express', label: 'Express', price: '$19.99', time: 'Next day' },
              { value: 'same-day', label: 'Same Day', price: '$29.99', time: 'Today' },
            ].map((option) => (
              <label key={option.value} className="relative">
                <input
                  type="radio"
                  value={option.value}
                  {...register('serviceType')}
                  className="sr-only peer"
                />
                <Card className={`p-4 cursor-pointer transition-all peer-checked:ring-2 peer-checked:ring-primary-500 peer-checked:border-primary-500 ${
                  serviceType === option.value ? 'ring-2 ring-primary-500 border-primary-500' : ''
                }`}>
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                    <h4 className="font-semibold text-gray-900">{option.label}</h4>
                    <p className="text-sm text-gray-600">{option.time}</p>
                    <p className="text-lg font-bold text-primary-600">{option.price}</p>
                  </div>
                </Card>
              </label>
            ))}
          </div>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-danger-600">{errors.serviceType.message}</p>
          )}
        </div>

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Pickup Address
            </label>
            <textarea
              {...register('pickupAddress')}
              className="input w-full h-20 resize-none"
              placeholder="Enter pickup address"
            />
            {errors.pickupAddress && (
              <p className="mt-1 text-sm text-danger-600">{errors.pickupAddress.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Delivery Address
            </label>
            <textarea
              {...register('deliveryAddress')}
              className="input w-full h-20 resize-none"
              placeholder="Enter delivery address"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-sm text-danger-600">{errors.deliveryAddress.message}</p>
            )}
          </div>
        </div>

        {/* Package Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="inline h-4 w-4 mr-1" />
              Package Description
            </label>
            <input
              type="text"
              {...register('packageDescription')}
              className="input w-full"
              placeholder="e.g., Documents, Electronics, Food"
            />
            {errors.packageDescription && (
              <p className="mt-1 text-sm text-danger-600">{errors.packageDescription.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('packageWeight', { valueAsNumber: true })}
              className="input w-full"
              placeholder="0.5"
            />
            {errors.packageWeight && (
              <p className="mt-1 text-sm text-danger-600">{errors.packageWeight.message}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register('contactName')}
              className="input w-full"
              placeholder="John Doe"
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-danger-600">{errors.contactName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone
            </label>
            <input
              type="tel"
              {...register('contactPhone')}
              className="input w-full"
              placeholder="+1 (555) 123-4567"
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-danger-600">{errors.contactPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              {...register('contactEmail')}
              className="input w-full"
              placeholder="john@example.com"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-danger-600">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Special Instructions (Optional)
          </label>
          <textarea
            {...register('specialInstructions')}
            className="input w-full h-20 resize-none"
            placeholder="Any special handling instructions..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            Selected service: <Badge className="ml-1">{serviceType}</Badge>
            <span className="ml-2 font-semibold text-primary-600">{getServicePrice(serviceType)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Book Delivery'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Package, Phone, Mail, MessageSquare, Truck, Crown, Shield, Zap } from 'lucide-react';
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
  priority: z.enum(['standard', 'priority', 'vip']).optional(),
  uhnwAssetValue: z.number().min(0).optional(),
  securityLevel: z.enum(['basic', 'enhanced', 'blockchain']),
  preferredCurrency: z.enum(['USD', 'EUR', 'GBP']),
  conciergePreferences: z.string().optional(),
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

  const serviceType = watch('serviceType');
  const priority = watch('priority');

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

      toast.success('Your exclusive delivery has been arranged. A concierge will contact you shortly.');
      reset();
    } catch (error) {
      toast.error('Unable to process your request. Please contact our premium concierge line.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceDetails = (type: string) => {
    switch (type) {
      case 'same-day':
        return { price: '$149', time: 'Same day', features: ['Dedicated courier', 'Real-time tracking', 'Priority handling'] };
      case 'express':
        return { price: '$89', time: 'Next business day', features: ['Express routing', 'Secure packaging', 'SMS updates'] };
      case 'standard':
        return { price: '$49', time: '2-3 business days', features: ['Reliable delivery', 'Basic tracking', 'Standard packaging'] };
      default:
        return { price: '$49', time: '2-3 business days', features: ['Reliable delivery', 'Basic tracking', 'Standard packaging'] };
    }
  };

  const serviceDetails = getServiceDetails(serviceType);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-gradient-to-br from-white via-gray-50 to-primary-50/30 border-2 border-primary-100">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Crown className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Exclusive Delivery Service</h3>
            <p className="text-gray-600 text-lg">World-class logistics for discerning clients</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Service Priority
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'standard', label: 'Standard', icon: Truck, desc: 'Reliable service' },
                { value: 'priority', label: 'Priority', icon: Zap, desc: 'Expedited handling' },
                { value: 'vip', label: 'VIP Concierge', icon: Crown, desc: 'Personal attendant' },
              ].map((option) => (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative cursor-pointer"
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register('priority')}
                    className="sr-only peer"
                  />
                  <Card className={`p-6 transition-all duration-300 peer-checked:ring-2 peer-checked:ring-primary-500 peer-checked:shadow-lg ${
                    priority === option.value
                      ? 'ring-2 ring-primary-500 shadow-lg bg-primary-50'
                      : 'hover:shadow-md'
                  }`}>
                    <div className="text-center">
                      <option.icon className={`h-8 w-8 mx-auto mb-3 ${
                        priority === option.value ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <h4 className="font-bold text-gray-900 mb-1">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </Card>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Delivery Speed
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'standard', label: 'Standard', price: '$49', time: '2-3 days' },
                { value: 'express', label: 'Express', price: '$89', time: 'Next day' },
                { value: 'same-day', label: 'Same Day', price: '$149', time: 'Today' },
              ].map((option) => (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative cursor-pointer"
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register('serviceType')}
                    className="sr-only peer"
                  />
                  <Card className={`p-6 transition-all duration-300 peer-checked:ring-2 peer-checked:ring-secondary-500 peer-checked:shadow-lg ${
                    serviceType === option.value
                      ? 'ring-2 ring-secondary-500 shadow-lg bg-secondary-50'
                      : 'hover:shadow-md'
                  }`}>
                    <div className="text-center">
                      <Shield className={`h-6 w-6 mx-auto mb-2 ${
                        serviceType === option.value ? 'text-secondary-600' : 'text-gray-400'
                      }`} />
                      <h4 className="font-bold text-gray-900">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.time}</p>
                      <p className="text-xl font-bold text-secondary-600 mt-2">{option.price}</p>
                    </div>
                  </Card>
                </motion.label>
              ))}
            </div>
            {errors.serviceType && (
              <p className="mt-2 text-sm text-danger-600">{errors.serviceType.message}</p>
            )}
          </div>

          {/* Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                <MapPin className="inline h-5 w-5 mr-2 text-primary-600" />
                Collection Address
              </label>
              <textarea
                {...register('pickupAddress')}
                className="input w-full h-24 resize-none text-lg"
                placeholder="Enter your collection address with full details"
              />
              {errors.pickupAddress && (
                <p className="mt-2 text-sm text-danger-600">{errors.pickupAddress.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                <MapPin className="inline h-5 w-5 mr-2 text-primary-600" />
                Delivery Address
              </label>
              <textarea
                {...register('deliveryAddress')}
                className="input w-full h-24 resize-none text-lg"
                placeholder="Enter delivery address with full details"
              />
              {errors.deliveryAddress && (
                <p className="mt-2 text-sm text-danger-600">{errors.deliveryAddress.message}</p>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                <Package className="inline h-5 w-5 mr-2 text-primary-600" />
                Item Description
              </label>
              <input
                type="text"
                {...register('packageDescription')}
                className="input w-full text-lg"
                placeholder="e.g., Fine art, Luxury goods, Important documents"
              />
              {errors.packageDescription && (
                <p className="mt-2 text-sm text-danger-600">{errors.packageDescription.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Package Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('packageWeight', { valueAsNumber: true })}
                className="input w-full text-lg"
                placeholder="0.5"
              />
              {errors.packageWeight && (
                <p className="mt-2 text-sm text-danger-600">{errors.packageWeight.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Full Name
              </label>
              <input
                type="text"
                {...register('contactName')}
                className="input w-full text-lg"
                placeholder="Your full name"
              />
              {errors.contactName && (
                <p className="mt-2 text-sm text-danger-600">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                <Phone className="inline h-5 w-5 mr-2 text-primary-600" />
                Phone Number
              </label>
              <input
                type="tel"
                {...register('contactPhone')}
                className="input w-full text-lg"
                placeholder="+1 (555) 123-4567"
              />
              {errors.contactPhone && (
                <p className="mt-2 text-sm text-danger-600">{errors.contactPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                <Mail className="inline h-5 w-5 mr-2 text-primary-600" />
                Email Address
              </label>
              <input
                type="email"
                {...register('contactEmail')}
                className="input w-full text-lg"
                placeholder="your.email@example.com"
              />
              {errors.contactEmail && (
                <p className="mt-2 text-sm text-danger-600">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              <MessageSquare className="inline h-5 w-5 mr-2 text-primary-600" />
              Special Instructions (Optional)
            </label>
            <textarea
              {...register('specialInstructions')}
              className="input w-full h-24 resize-none text-lg"
              placeholder="Any special handling requirements, security preferences, or concierge services needed..."
            />
          </div>

          {/* Service Summary */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <h4 className="font-bold text-gray-900 mb-4">Service Summary</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Selected Service</p>
                <p className="font-semibold text-gray-900">{serviceType} Delivery</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority Level</p>
                <Badge className="bg-primary-100 text-primary-800">
                  {priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="font-semibold text-gray-900">{serviceDetails.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-secondary-600">{serviceDetails.price}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Included Features:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {serviceDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-success-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Arrange Exclusive Delivery
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              By submitting, you agree to our premium service terms. A concierge will contact you within 30 minutes.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

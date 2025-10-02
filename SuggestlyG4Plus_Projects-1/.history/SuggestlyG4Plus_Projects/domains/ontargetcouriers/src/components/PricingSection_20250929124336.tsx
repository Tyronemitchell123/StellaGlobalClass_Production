'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PricingTier } from '@/types';

interface PricingSectionProps {
  onSelectPlan?: (plan: PricingTier) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
  };

  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const pricingTiers: PricingTier[] = [
    {
      name: 'Standard',
      price: 49,
      features: [
        'Reliable delivery within 2-3 days',
        'Basic tracking updates',
        'Standard packaging',
        'Email notifications',
        'Customer support'
      ]
    },
    {
      name: 'Express',
      price: 89,
      popular: true,
      features: [
        'Next business day delivery',
        'Real-time GPS tracking',
        'Express routing optimization',
        'Priority customer support',
        'Secure packaging',
        'SMS delivery updates',
        'Signature confirmation'
      ]
    },
    {
      name: 'VIP Concierge',
      price: 149,
      features: [
        'Same-day delivery guarantee',
        'Personal concierge service',
        'White-glove handling',
        '24/7 premium support',
        'Luxury packaging options',
        'Real-time updates',
        'Dedicated delivery coordinator',
        'Insurance coverage up to $10,000',
        'Temperature-controlled shipping'
      ]
    },
    {
      name: 'Global Elite',
      price: 999,
      popular: true,
      features: [
        'Private aviation logistics worldwide',
        'Blockchain provenance tracking',
        'Unlimited insurance coverage',
        'Dedicated UHNW advisor 24/7',
        'Quantum-secured global handoffs',
        'Predictive elite ETA with 99.9% accuracy',
        'Concierge preferences integration',
        'Multi-currency billing support',
        'Exclusive vault partner access'
      ]
    }
  ];



  const handleSelectPlan = (tier: PricingTier) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Crown className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Delivery Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect delivery solution for your valuable shipments.
              From standard reliability to VIP concierge service.
            </p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-secondary-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`p-8 h-full transition-all duration-300 hover:shadow-xl ${
                tier.popular
                  ? 'ring-2 ring-secondary-500 shadow-lg scale-105'
                  : 'hover:scale-105'
              }`}>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    {tier.name === 'Standard' && <Shield className="h-8 w-8 text-primary-600" />}
                    {tier.name === 'Express' && <Zap className="h-8 w-8 text-secondary-600" />}
                    {tier.name === 'VIP Concierge' && <Crown className="h-8 w-8 text-yellow-600" />}
                    {tier.name === 'Global Elite' && <Star className="h-8 w-8 text-purple-600" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-5xl font-bold text-primary-600 mb-2">
                    {symbols[selectedCurrency]}{Math.round(tier.price * (rates[selectedCurrency] || 1))}
                  </div>
                  <p className="text-gray-600">per delivery</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      className="flex items-start"
                    >
                      <Check className="h-5 w-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(tier)}
                  className={`w-full py-3 text-lg font-semibold ${
                    tier.popular
                      ? 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800'
                      : tier.name === 'VIP Concierge'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                      : tier.name === 'Global Elite'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
                  }`}
                  size="lg"
                >
                  {tier.name === 'VIP Concierge' ? (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      Choose VIP Service
                    </>
                  ) : tier.name === 'Global Elite' ? (
                    <>
                      <Star className="h-5 w-5 mr-2" />
                      Choose Global Elite
                    </>
                  ) : (
                    `Select ${tier.name}`
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose On Target Couriers?
              </h3>
              <p className="text-gray-600">
                Experience the difference with our premium logistics solutions
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure & Insured</h4>
                <p className="text-sm text-gray-600">
                  Full insurance coverage and secure handling for peace of mind
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-secondary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Optimized</h4>
                <p className="text-sm text-gray-600">
                  Machine learning algorithms ensure fastest, most efficient routes
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-success-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Reliable</h4>
                <p className="text-sm text-gray-600">
                  99.8% on-time delivery rate with real-time tracking
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Premium Service</h4>
                <p className="text-sm text-gray-600">
                  White-glove service and personal concierge for VIP clients
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enterprise Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <h3 className="text-2xl font-bold mb-4">Enterprise & High-Value Solutions</h3>
            <p className="text-gray-300 mb-6">
              For businesses requiring specialized logistics, high-value shipments, or custom solutions
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
              size="lg"
            >
              Contact Enterprise Sales
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

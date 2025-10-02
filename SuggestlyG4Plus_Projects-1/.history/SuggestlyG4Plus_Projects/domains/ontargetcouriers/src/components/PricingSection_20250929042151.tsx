'use client';

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

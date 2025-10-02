'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Calculator, DollarSign, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InsuranceOption {
  name: string;
  coverage: number;
  premium: number;
  deductible: number;
  features: string[];
  recommended?: boolean;
}

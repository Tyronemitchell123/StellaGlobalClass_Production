'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, CheckCircle, AlertCircle, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingData, TrackingUpdate } from '@/types';

interface TrackingInterfaceProps {
  trackingData?: TrackingData;
  onTrack?: (trackingNumber: string) => void;

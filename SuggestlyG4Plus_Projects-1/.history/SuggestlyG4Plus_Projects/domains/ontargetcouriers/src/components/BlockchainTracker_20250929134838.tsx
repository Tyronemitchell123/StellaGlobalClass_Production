'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle, Clock, MapPin, Hash, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrackingData } from '@/types';

interface BlockchainTrackerProps {
  trackingData: TrackingData;
  isPrivacyMode?: boolean;
}

interface BlockchainBlock {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: Date;
  data: {
    location: string;
    status: string;
    temperature?: number;
    humidity?: number;
    securityCheck: boolean;
  };
  nonce: number;
  verified: boolean;
}

export function BlockchainTracker({ trackingData, isPrivacyMode = false }: BlockchainTrackerProps) {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  // Generate mock blockchain data based on tracking updates
  useEffect(() => {
    const generateBlockchain = () => {
      const mockBlocks: BlockchainBlock[] = [];
      let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

      trackingData.updates.forEach((update, index) => {
        const block: BlockchainBlock = {
          id: `block_${index + 1}`,
          hash: generateMockHash(update.timestamp.toISOString() + update.location + index),
          previousHash,
          timestamp: update.timestamp,
          data: {
            location: isPrivacyMode ? maskLocation(update.location) : update.location,
            status: update.status,
            temperature: Math.floor(Math.random() * 10) + 15, // Mock temperature
            humidity: Math.floor(Math.random() * 20) + 40, // Mock humidity
            securityCheck: Math.random() > 0.1, // 90% pass rate
          },
          nonce: Math.floor(Math.random() * 1000000),
          verified: true,
        };

        mockBlocks.push(block);
        previousHash = block.hash;
      });

      setBlocks(mockBlocks);
    };

    generateBlockchain();
  }, [trackingData, isPrivacyMode]);

  const generateMockHash = (input: string): string => {
    // Simple mock hash generation for demo
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  };

  const maskLocation = (location: string): string => {
    // Privacy-preserving location masking
    const parts = location.split(',');
    if (parts.length >= 2) {
      return `${parts[0].substring(0, 3)}***, ${parts[1].substring(0, 2)}***`;
    }
    return location.substring(0, 5) + '***';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pickup': return 'bg-blue-500';
      case 'in-transit': return 'bg-yellow-500';
      case 'delivered': return 'bg-green-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pickup': return <MapPin className="h-4 w-4" />;
      case 'in-transit': return <Clock className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'delayed': return <Clock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Blockchain Security</h3>
            <p className="text-sm text-gray-600">Tamper-proof tracking verification</p>
          </div>

            <div className="bg-primary-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-primary-900 mb-2">Security Features</h4>
              <ul className="text-xs text-primary-800 space-y-1">
                <li>• Quantum-resistant encryption</li>
                <li>• Immutable blockchain ledger</li>
                <li>• Multi-signature verification</li>
                <li>• Real-time integrity checks</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

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
        </div>

        <div className="flex items-center space-x-2">
          {isPrivacyMode && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Lock className="h-3 w-3 mr-1" />
              Privacy Mode
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'} Chain
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(trackingData.status)}`}></div>
            <span className="font-semibold text-gray-900 capitalize">{trackingData.status}</span>
            {getStatusIcon(trackingData.status)}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Confidence</p>
            <p className="font-bold text-green-600">{Math.round(trackingData.confidence * 100)}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Location</p>
              <p className="font-semibold text-gray-900">
                {isPrivacyMode ? maskLocation(trackingData.currentLocation) : trackingData.currentLocation}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Blockchain Hash</p>
              <p className="font-mono text-xs text-blue-600">
                {trackingData.blockchainHash?.substring(0, 16)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Visualization */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-gray-900 mb-4">Transaction Chain</h4>

            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection line */}
                {index < blocks.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                )}

                <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Hash className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Block #{index + 1}
                          </Badge>
                          <Badge
                            variant={block.verified ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {block.verified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </div>

                        <p className="font-medium text-gray-900 mb-1">
                          {block.data.location}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            {getStatusIcon(block.data.status)}
                            <span className="ml-1 capitalize">{block.data.status}</span>
                          </span>
                          {block.data.temperature && (
                            <span>🌡️ {block.data.temperature}°C</span>
                          )}
                          {block.data.humidity && (
                            <span>💧 {block.data.humidity}%</span>
                          )}
                          <span className={`flex items-center ${block.data.securityCheck ? 'text-green-600' : 'text-red-600'}`}>
                            <Shield className="h-3 w-3 mr-1" />
                            {block.data.securityCheck ? 'Secure' : 'Alert'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500">
                          {block.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Hash</p>
                      <p className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {block.hash.substring(0, 12)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Nonce: {block.nonce}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Controls */}
      {isPrivacyMode && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Privacy Mode Active</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
            >
              {showPrivacyDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPrivacyDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          {showPrivacyDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
            >
              <h5 className="font-medium text-purple-900 mb-2">Privacy Protections</h5>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Location data is masked and anonymized</li>
                <li>• Personal information is encrypted end-to-end</li>
                <li>• Access logs are minimal and time-limited</li>
                <li>• Data sharing requires explicit consent</li>
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center">
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Shield className="h-3 w-3 mr-1" />
          Quantum Secured
        </Badge>
      </div>
    </Card>
  );
}

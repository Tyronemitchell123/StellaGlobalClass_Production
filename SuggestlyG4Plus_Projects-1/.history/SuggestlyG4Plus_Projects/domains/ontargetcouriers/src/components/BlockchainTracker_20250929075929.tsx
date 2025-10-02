'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingData } from '@/types';

interface BlockchainTrackerProps {
  trackingData: TrackingData;
}

export function BlockchainTracker({ trackingData }: BlockchainTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'in-transit':
        return <MapPin className="h-5 w-5 text-primary-600" />;
      case 'pickup':
        return <Clock className="h-5 w-5 text-warning-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-primary-50 border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Lock className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Secured Tracking</h3>
        </div>
        <Badge className="bg-success-100 text-success-800">
          Quantum Secure
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tracking Number:</span>
          <span className="font-mono text-sm text-gray-900">{trackingData.trackingNumber}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Blockchain Hash:</span>
          <span className="font-mono text-xs text-gray-700 truncate max-w-32">
            {trackingData.blockchainHash || 'Pending...'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div className="flex items-center">
            {getStatusIcon(trackingData.status)}
            <span className="ml-2 text-sm font-medium capitalize">{trackingData.status}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Location:</span>
          <span className="text-sm text-gray-900">{trackingData.currentLocation}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress:</span>
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${trackingData.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm text-gray-900">{trackingData.progress}%</span>
          </div>
        </div>

        {trackingData.uhnwPrivacyMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <Lock className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">UHNW Privacy Mode Active</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {isExpanded ? 'Hide Details' : 'Show Blockchain Details'}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="bg-gray-100 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Transaction History</h4>
              <div className="space-y-2">
                {trackingData.updates.slice(-3).map((update, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    {getStatusIcon(update.status)}
                    <div className="flex-1">
                      <p className="text-xs text-gray-700">{update.description}</p>
                      <p className="text-xs text-gray-500">{update.location} • {update.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
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

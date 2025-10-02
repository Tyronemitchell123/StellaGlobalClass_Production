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
}

export function TrackingInterface({ trackingData, onTrack }: TrackingInterfaceProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mockData, setMockData] = useState<TrackingData | null>(null);

  // Mock data for demonstration
  const generateMockData = (number: string): TrackingData => {
    const statuses = ['pickup', 'in-transit', 'delivered'];
    const locations = ['Warehouse A', 'Distribution Center', 'Local Hub', 'In Transit', 'Delivered'];
    const updates: TrackingUpdate[] = [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'Package received at warehouse',
        location: 'Warehouse A',
        description: 'Your package has been received and is being prepared for shipment.'
      },
      {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'In transit',
        location: 'Distribution Center',
        description: 'Package is now in transit to the delivery location.'
      },
      {
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'Out for delivery',
        location: 'Local Delivery Hub',
        description: 'Your package is out for delivery and will arrive shortly.'
      }
    ];

    return {
      trackingNumber: number,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      currentLocation: locations[Math.floor(Math.random() * locations.length)],
      estimatedDelivery: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
      progress: Math.floor(Math.random() * 100),
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      updates
    };
  };

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateMockData(trackingNumber);
      setMockData(data);
      if (onTrack) onTrack(trackingNumber);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pickup': return <Truck className="h-5 w-5" />;
      case 'in-transit': return <RefreshCw className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pickup': return 'text-blue-600 bg-blue-100';
      case 'in-transit': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const displayData = trackingData || mockData;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Package Tracking</h3>
          <p className="text-gray-600">Real-time tracking with AI-powered delivery predictions</p>
        </div>

        {/* Tracking Input */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number"
                className="input w-full text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
            </div>
            <Button
              onClick={handleTrack}
              disabled={isLoading || !trackingNumber.trim()}
              size="lg"
              className="px-8"
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Track
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tracking Results */}
        {displayData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Status Overview */}
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary-50 to-secondary-50">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getStatusIcon(displayData.status)}
                  </div>
                  <Badge className={`mb-2 ${getStatusColor(displayData.status)}`}>
                    {displayData.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-600">Status</p>
                </div>

                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                  <p className="font-semibold text-gray-900">{displayData.currentLocation}</p>
                  <p className="text-sm text-gray-600">Current Location</p>
                </div>

                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-secondary-600" />
                  <p className="font-semibold text-gray-900">
                    {displayData.estimatedDelivery.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">
                    {displayData.confidence}%
                  </div>
                  <p className="text-sm text-gray-600">On-Time Confidence</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Pickup</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${displayData.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-semibold text-primary-600">
                    {displayData.progress}% Complete
                  </span>
                </div>
              </div>
            </Card>

            {/* Tracking Updates */}
            <Card className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Tracking History</h4>
              <div className="space-y-4">
                {displayData.updates.map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-gray-900">{update.status}</h5>
                        <span className="text-sm text-gray-500">
                          {update.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{update.location}</p>
                      <p className="text-sm text-gray-500 mt-2">{update.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-6 mt-6 bg-gradient-to-r from-success-50 to-primary-50">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-success-600" />
                AI Delivery Insights
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Predicted Delivery Window</h5>
                  <p className="text-gray-600">
                    Based on current conditions, your package is expected to arrive between
                    <span className="font-semibold text-primary-600"> 2:00 PM - 4:00 PM </span>
                    today.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Route Optimization</h5>
                  <p className="text-gray-600">
                    AI has optimized the delivery route, reducing travel time by
                    <span className="font-semibold text-success-600"> 15 minutes</span>.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!displayData && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Track Your Package</h4>
            <p className="text-gray-600">
              Enter your tracking number above to see real-time updates and AI-powered delivery predictions.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

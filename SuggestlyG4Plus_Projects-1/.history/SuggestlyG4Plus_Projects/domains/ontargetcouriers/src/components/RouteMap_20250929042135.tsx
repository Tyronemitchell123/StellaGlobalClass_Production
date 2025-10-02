'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Route, Zap, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizedRoute, RoutePoint } from '@/types';

interface RouteMapProps {
  route?: OptimizedRoute;
  className?: string;
}

export function RouteMap({ route, className = '' }: RouteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock route data
  const mockRoute: OptimizedRoute = {
    points: [
      { lat: 40.7128, lng: -74.0060, type: 'pickup', address: '123 Pickup St, NYC' },
      { lat: 40.7589, lng: -73.9851, type: 'waypoint', address: 'Distribution Center' },
      { lat: 40.7505, lng: -73.9934, type: 'delivery', address: '456 Delivery Ave, NYC' },
    ],
    distance: 8.5,
    estimatedTime: 45,
    efficiency: 92,
  };

  const displayRoute = route || mockRoute;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw route line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    displayRoute.points.forEach((point, index) => {
      const x = (index / (displayRoute.points.length - 1)) * canvas.offsetWidth;
      const y = canvas.offsetHeight / 2 + (Math.random() - 0.5) * 40; // Add some curve

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = point.type === 'pickup' ? '#10b981' : point.type === 'delivery' ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.stroke();
  }, [displayRoute]);

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'pickup': return '📍';
      case 'delivery': return '🏁';
      case 'waypoint': return '📦';
      default: return '📍';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Route className="h-6 w-6 mr-2 text-primary-600" />
          AI-Optimized Route
        </h3>
        <p className="text-gray-600">Real-time route optimization with machine learning</p>
      </div>

      {/* Route Visualization */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-48 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border"
          style={{ width: '100%', height: '192px' }}
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-success-100 text-success-800">
            <Zap className="h-3 w-3 mr-1" />
            {displayRoute.efficiency}% Efficient
          </Badge>
        </div>
      </div>

      {/* Route Details */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{displayRoute.distance}km</div>
          <div className="text-sm text-gray-600">Distance</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-600">{displayRoute.estimatedTime}min</div>
          <div className="text-sm text-gray-600">Est. Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 mr-1" />
            {displayRoute.efficiency}%
          </div>
          <div className="text-sm text-gray-600">Efficiency</div>
        </div>
      </div>

      {/* Route Points */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Route Breakdown</h4>
        {displayRoute.points.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-lg">{getPointIcon(point.type)}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 capitalize">{point.type}</span>
                <Badge variant="outline" className="text-xs">
                  {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{point.address}</p>
            </div>
            {index < displayRoute.points.length - 1 && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Route className="h-4 w-4 text-primary-600" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50">
        <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Zap className="h-4 w-4 mr-2 text-primary-600" />
          AI Route Optimization
        </h5>
        <p className="text-sm text-gray-600">
          This route was optimized using machine learning algorithms that consider real-time traffic,
          weather conditions, and historical delivery data to ensure the fastest and most reliable delivery.
        </p>
      </Card>
    </Card>
  );
}

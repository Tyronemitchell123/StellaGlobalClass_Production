'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Navigation, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DriverLocation {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  lastUpdate: Date;
}

interface LiveDriverTrackingProps {
  trackingNumber?: string;
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    photo: string;
  };
}

export function LiveDriverTracking({ trackingNumber, driverInfo }: LiveDriverTrackingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation>({
    lat: 40.7589,
    lng: -73.9851,
    heading: 45,
    speed: 35,
    lastUpdate: new Date()
  });

  const [isConnected, setIsConnected] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'driver', text: 'Hello! I\'m on my way to pickup. ETA 5 minutes.', time: '2:30 PM' },
    { id: 2, sender: 'system', text: 'Driver arrived at pickup location', time: '2:35 PM' },
  ]);

  // Mock driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        speed: 25 + Math.random() * 20,
        lastUpdate: new Date()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Draw map with driver location
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
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, canvas.offsetHeight - 50);
    ctx.lineTo(canvas.offsetWidth - 50, 50);
    ctx.stroke();

    // Draw driver marker
    const driverX = canvas.offsetWidth / 2 + (Math.random() - 0.5) * 100;
    const driverY = canvas.offsetHeight / 2 + (Math.random() - 0.5) * 100;

    // Driver marker shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(driverX + 2, driverY + 2, 12, 0, 2 * Math.PI);
    ctx.fill();

    // Driver marker
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(driverX, driverY, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Driver marker border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Direction indicator
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(driverX, driverY);
    ctx.lineTo(driverX + 15, driverY - 15);
    ctx.stroke();
  }, [driverLocation]);

  const mockDriver = driverInfo || {
    name: 'Marcus Rodriguez',
    phone: '+1 (555) 123-4567',
    vehicle: 'Mercedes Sprinter Van #A-247',
    photo: '👨‍🚗'
  };

  const sendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'client',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Navigation className="h-6 w-6 mr-2 text-primary-600" />
              Live Driver Tracking
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {trackingNumber && (
            <p className="text-gray-600">Tracking: <span className="font-mono font-semibold">{trackingNumber}</span></p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Live Map */}
          <div className="md:col-span-2">
            <Card className="p-4">
              <canvas
                ref={canvasRef}
                className="w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border"
                style={{ width: '100%', height: '320px' }}
              />

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary-600">{driverLocation.speed.toFixed(0)} mph</div>
                  <div className="text-sm text-gray-600">Speed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-secondary-600">
                    {driverLocation.lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-gray-600">Last Update</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-success-600">2.3 mi</div>
                  <div className="text-sm text-gray-600">Distance</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Driver Info & Communication */}
          <div className="space-y-4">
            {/* Driver Profile */}
            <Card className="p-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{mockDriver.photo}</div>
                <h4 className="font-semibold text-gray-900">{mockDriver.name}</h4>
                <p className="text-sm text-gray-600">{mockDriver.vehicle}</p>
                <Badge className="mt-2 bg-success-100 text-success-800">
                  <Clock className="h-3 w-3 mr-1" />
                  5 min ETA
                </Badge>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => window.open(`tel:${mockDriver.phone}`)}
                  className="w-full"
                  variant="outline"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Driver
                </Button>

                <Button
                  onClick={() => setShowChat(!showChat)}
                  className="w-full"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Driver
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h5 className="font-semibold text-gray-900 mb-3">Quick Actions</h5>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => sendMessage("Please call when you arrive")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Request Call
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => sendMessage("Package is ready at front desk")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Confirm Pickup
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => sendMessage("Please handle with care - fragile items")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Special Instructions
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Chat Interface */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Chat with {mockDriver.name}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowChat(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="h-64 overflow-y-auto mb-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'client'
                          ? 'bg-primary-600 text-white'
                          : message.sender === 'driver'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button size="sm">Send</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

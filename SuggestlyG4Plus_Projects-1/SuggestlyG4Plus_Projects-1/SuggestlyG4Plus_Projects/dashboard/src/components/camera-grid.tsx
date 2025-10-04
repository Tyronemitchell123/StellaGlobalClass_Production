'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Settings, Maximize2 } from 'lucide-react';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  streamUrl: string;
  lastDetection?: string;
}

export function CameraGrid() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  useEffect(() => {
    // Simulate camera data
    const mockCameras: Camera[] = [
      {
        id: 'cam-1',
        name: 'Entrance Main',
        location: 'Building A',
        status: 'online',
        streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        lastDetection: '2 minutes ago',
      },
      {
        id: 'cam-2',
        name: 'Parking Lot',
        location: 'Building B',
        status: 'online',
        streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        lastDetection: '5 minutes ago',
      },
      {
        id: 'cam-3',
        name: 'Loading Dock',
        location: 'Warehouse',
        status: 'maintenance',
        streamUrl: '',
      },
      {
        id: 'cam-4',
        name: 'Security Office',
        location: 'Admin Building',
        status: 'online',
        streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        lastDetection: '1 hour ago',
      },
    ];

    setCameras(mockCameras);
  }, []);

  const getStatusColor = (status: Camera['status']) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Camera Feeds</CardTitle>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Cameras
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-colors"
            >
              {/* Camera Header */}
              <div className="flex items-center justify-between p-3 bg-slate-800">
                <div>
                  <h3 className="text-sm font-medium text-white">{camera.name}</h3>
                  <p className="text-xs text-slate-400">{camera.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(camera.status)}`}>
                    {camera.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setSelectedCamera(selectedCamera === camera.id ? null : camera.id)}
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Video Feed */}
              {camera.status === 'online' && camera.streamUrl ? (
                <div className="relative aspect-video bg-black">
                  <video
                    src={camera.streamUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    LIVE
                  </div>
                  {camera.lastDetection && (
                    <div className="absolute bottom-2 left-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                      Last detection: {camera.lastDetection}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <div className="text-2xl mb-2">
                      {camera.status === 'maintenance' ? '🔧' : '📷'}
                    </div>
                    <p className="text-sm">
                      {camera.status === 'maintenance' ? 'Under Maintenance' : 'Camera Offline'}
                    </p>
                  </div>
                </div>
              )}

              {/* Controls */}
              {camera.status === 'online' && (
                <div className="flex items-center justify-between p-3 bg-slate-800">
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

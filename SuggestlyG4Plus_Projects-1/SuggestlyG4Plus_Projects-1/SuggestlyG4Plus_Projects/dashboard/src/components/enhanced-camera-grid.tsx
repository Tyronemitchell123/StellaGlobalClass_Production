'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/components/enhanced-websocket-provider';
import { useAuth } from '@/contexts/auth-context';
import { apiService } from '@/lib/api-service';
import { useState, useEffect } from 'react';
import { Play, Pause, Settings, Maximize2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Camera {
  id: number;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export function EnhancedCameraGrid() {
  const { alerts, detections } = useWebSocket();
  const { isAuthenticated } = useAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordingStates, setRecordingStates] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCameras = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiService.getCameras();
        setCameras(response.cameras || []);
        
        // Initialize recording states
        const initialRecordingStates = response.cameras?.reduce((acc: {[key: number]: boolean}, camera: Camera) => {
          acc[camera.id] = false;
          return acc;
        }, {}) || {};
        setRecordingStates(initialRecordingStates);
      } catch (error) {
        console.error('Error fetching cameras:', error);
        setError('Failed to load camera data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameras();

    // Refresh camera data every 10 seconds
    const interval = setInterval(fetchCameras, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const getStatusColor = (status: Camera['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Camera['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const toggleRecording = (cameraId: number) => {
    setRecordingStates(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId]
    }));
  };

  const hasRecentAlerts = (cameraId: number) => {
    // Check if there are alerts related to this camera
    return alerts.some(alert => alert.toLowerCase().includes(`camera ${cameraId}`) || 
                           alert.toLowerCase().includes('motion') ||
                           alert.toLowerCase().includes('detection'));
  };

  const getRecentDetections = (cameraId: number) => {
    // Get recent detections for this camera
    return detections.filter(detection => 
      detection.toLowerCase().includes(`camera ${cameraId}`) ||
      detection.toLowerCase().includes('zone') ||
      detection.toLowerCase().includes('motion')
    ).slice(-3); // Last 3 detections
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Camera Feeds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                <div className="animate-pulse space-y-3 p-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-32 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-red-500/20">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Camera Feeds</CardTitle>
          <div className="flex items-center gap-2">
            {alerts.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1">
                <span className="text-red-400 text-sm font-medium">
                  {alerts.length} Active Alerts
                </span>
              </div>
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage Cameras
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map((camera) => {
            const recentDetections = getRecentDetections(camera.id);
            const hasAlerts = hasRecentAlerts(camera.id);
            const isRecording = recordingStates[camera.id];

            return (
              <div
                key={camera.id}
                className={`relative bg-slate-900 rounded-lg overflow-hidden border transition-all duration-200 ${
                  selectedCamera === camera.id 
                    ? 'border-purple-500 ring-2 ring-purple-500/20' 
                    : hasAlerts 
                      ? 'border-red-500/30 hover:border-red-500' 
                      : 'border-slate-700 hover:border-purple-500'
                }`}
              >
                {/* Camera Header */}
                <div className="flex items-center justify-between p-3 bg-slate-800">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(camera.status)}
                    <div>
                      <h3 className="text-sm font-medium text-white">{camera.name}</h3>
                      <p className="text-xs text-slate-400">Camera #{camera.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasAlerts && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <span className={`text-xs font-medium ${getStatusColor(camera.status)}`}>
                      {camera.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-slate-700"
                      onClick={() => setSelectedCamera(
                        selectedCamera === camera.id ? null : camera.id
                      )}
                    >
                      <Maximize2 className="h-3 w-3 text-slate-400" />
                    </Button>
                  </div>
                </div>

                {/* Video Feed */}
                {camera.status === 'active' && camera.url ? (
                  <div className="relative aspect-video bg-black">
                    <img
                      src={camera.url}
                      alt={camera.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback for failed image loads */}
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center hidden">
                      <div className="text-center text-slate-400">
                        <div className="text-2xl mb-2">📹</div>
                        <p className="text-sm">Camera Feed</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Stream unavailable
                        </p>
                      </div>
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                        LIVE
                      </div>
                      {isRecording && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                          REC
                        </div>
                      )}
                    </div>

                    {/* Recent Alerts/Detections */}
                    {recentDetections.length > 0 && (
                      <div className="absolute bottom-2 left-2 space-y-1">
                        {recentDetections.map((detection, index) => (
                          <div key={index} className="bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                            {detection}
                          </div>
                        ))}
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
                      <p className="text-xs text-slate-500 mt-1">
                        {camera.status === 'inactive' ? 'Connection lost' : 'Scheduled maintenance'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Controls */}
                {camera.status === 'active' && (
                  <div className="flex items-center justify-between p-3 bg-slate-800 border-t border-slate-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRecording(camera.id)}
                      className={`${
                        isRecording 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                          : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        Snapshot
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        Settings
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {cameras.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="text-lg font-medium text-white mb-2">No Cameras Found</h3>
            <p className="text-slate-400 mb-4">
              No cameras are currently configured or available.
            </p>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Cameras
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

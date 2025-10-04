'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWebSocket } from '@/components/enhanced-websocket-provider';
import { useAuth } from '@/contexts/auth-context';
import { apiService } from '@/lib/api-service';
import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Video, 
  AlertCircle, 
  Cpu, 
  MemoryStick, 
  Wifi, 
  Zap,
  Activity,
  Shield
} from 'lucide-react';

interface HealthData {
  status: string;
  timestamp: string;
  services: {
    mcp: string;
    ai: string;
    web: string;
  };
}

interface CameraData {
  success: boolean;
  cameras: Array<{
    id: number;
    name: string;
    url: string;
    status: string;
  }>;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  description: string;
  status: 'healthy' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'stable';
}

export function EnhancedOverviewMetrics() {
  const { metrics, isConnected, alerts } = useWebSocket();
  const { isAuthenticated } = useAuth();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [cameraData, setCameraData] = useState<CameraData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [health, cameras] = await Promise.all([
          apiService.getHealth(),
          apiService.getCameras()
        ]);

        setHealthData(health.data);
        setCameraData(cameras);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchInitialData, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const getMetricCards = (): MetricCard[] => {
    const activeCameras = cameraData?.cameras?.filter(c => c.status === 'active')?.length || 0;
    const totalCameras = cameraData?.cameras?.length || 0;
    
    return [
      {
        title: 'System Status',
        value: healthData?.status === 'healthy' ? 'Online' : 'Offline',
        change: isConnected ? 'Connected' : 'Disconnected',
        icon: <Shield className="h-4 w-4 text-blue-400" />,
        description: 'Overall system health',
        status: healthData?.status === 'healthy' ? 'healthy' : 'warning',
        trend: 'stable'
      },
      {
        title: 'CPU Usage',
        value: `${metrics.cpu || 0}%`,
        change: 'Real-time',
        icon: <Cpu className="h-4 w-4 text-orange-400" />,
        description: 'Current CPU utilization',
        status: (metrics.cpu || 0) > 80 ? 'warning' : 'healthy',
        trend: (metrics.cpu || 0) > 70 ? 'up' : 'stable'
      },
      {
        title: 'Memory Usage',
        value: `${metrics.memory || 0}%`,
        change: 'Real-time',
        icon: <MemoryStick className="h-4 w-4 text-purple-400" />,
        description: 'Current memory utilization',
        status: (metrics.memory || 0) > 80 ? 'warning' : 'healthy',
        trend: (metrics.memory || 0) > 70 ? 'up' : 'stable'
      },
      {
        title: 'Active Cameras',
        value: `${activeCameras}/${totalCameras}`,
        change: totalCameras > 0 ? `${Math.round((activeCameras / totalCameras) * 100)}% online` : 'No cameras',
        icon: <Video className="h-4 w-4 text-green-400" />,
        description: 'Connected camera feeds',
        status: activeCameras === totalCameras ? 'healthy' : 'warning',
        trend: 'stable'
      },
      {
        title: 'Network Latency',
        value: `${metrics.latency || 0}ms`,
        change: 'Real-time',
        icon: <Wifi className="h-4 w-4 text-cyan-400" />,
        description: 'Network response time',
        status: (metrics.latency || 0) > 100 ? 'warning' : 'healthy',
        trend: (metrics.latency || 0) > 50 ? 'up' : 'stable'
      },
      {
        title: 'Active Alerts',
        value: alerts.length,
        change: alerts.length > 0 ? `${alerts.length} active` : 'All clear',
        icon: <AlertCircle className="h-4 w-4 text-red-400" />,
        description: 'System alerts and notifications',
        status: alerts.length > 0 ? 'warning' : 'healthy',
        trend: alerts.length > 3 ? 'up' : 'stable'
      },
      {
        title: 'AI Engine',
        value: healthData?.services?.ai === 'initialized' ? 'Ready' : 'Loading',
        change: healthData?.services?.ai || 'Unknown',
        icon: <Zap className="h-4 w-4 text-yellow-400" />,
        description: 'AI processing status',
        status: healthData?.services?.ai === 'initialized' ? 'healthy' : 'warning',
        trend: 'stable'
      },
      {
        title: 'MCP Server',
        value: healthData?.services?.mcp === 'running' ? 'Active' : 'Offline',
        change: healthData?.services?.mcp || 'Unknown',
        icon: <Activity className="h-4 w-4 text-emerald-400" />,
        description: 'Backend server status',
        status: healthData?.services?.mcp === 'running' ? 'healthy' : 'error',
        trend: 'stable'
      }
    ];
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-400" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-green-400 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-blue-400" />;
    }
  };

  const metricCards = getMetricCards();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-700 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-red-500/20">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-slate-400">
            {isConnected ? 'Real-time updates active' : 'Disconnected from real-time updates'}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card 
            key={index} 
            className={`bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-200 ${
              metric.status === 'warning' ? 'border-yellow-500/30' : 
              metric.status === 'error' ? 'border-red-500/30' : ''
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {metric.title}
              </CardTitle>
              <div className="flex items-center gap-1">
                {metric.trend && getTrendIcon(metric.trend)}
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <p className="text-xs text-slate-400 mt-1">{metric.description}</p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.change}
                </p>
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'healthy' ? 'bg-emerald-400' :
                  metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

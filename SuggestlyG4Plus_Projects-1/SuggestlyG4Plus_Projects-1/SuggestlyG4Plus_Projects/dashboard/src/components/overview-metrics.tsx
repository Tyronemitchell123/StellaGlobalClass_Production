'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Video, AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Metric {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  description: string;
}

export function OverviewMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    // Simulate real-time metrics fetching
    const fetchMetrics = async () => {
      // In production, fetch from API or WebSocket
      setMetrics([
        {
          title: 'Total Cameras',
          value: '24',
          change: '+12% from last week',
          icon: <Video className="h-4 w-4 text-blue-400" />,
          description: 'Active camera feeds across all locations',
        },
        {
          title: 'Detections Today',
          value: '1,234',
          change: '+23%',
          icon: <AlertCircle className="h-4 w-4 text-orange-400" />,
          description: 'AI-powered object detections processed',
        },
        {
          title: 'System Uptime',
          value: '99.9%',
          change: '24h average',
          icon: <Clock className="h-4 w-4 text-green-400" />,
          description: 'Reliability of the monitoring system',
        },
        {
          title: 'Active Users',
          value: '15',
          change: '+5',
          icon: <Users className="h-4 w-4 text-purple-400" />,
          description: 'Concurrent dashboard users',
        },
        {
          title: 'Alerts Resolved',
          value: '89%',
          change: '+15% efficiency',
          icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,
          description: 'Percentage of alerts handled successfully',
        },
      ]);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <p className="text-xs text-slate-400 mt-1">{metric.description}</p>
            <p className="text-xs text-emerald-400 mt-2">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

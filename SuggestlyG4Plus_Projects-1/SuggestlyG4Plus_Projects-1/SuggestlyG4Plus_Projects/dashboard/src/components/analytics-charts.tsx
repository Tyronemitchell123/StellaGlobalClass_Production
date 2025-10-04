'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useEffect, useState } from 'react';

interface ChartData {
  name: string;
  detections: number;
  alerts: number;
  uptime: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

export function AnalyticsCharts() {
  const [lineData, setLineData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);

  useEffect(() => {
    // Mock analytics data
    const mockLineData: ChartData[] = [
      { name: '00:00', detections: 12, alerts: 2, uptime: 99.8 },
      { name: '04:00', detections: 8, alerts: 1, uptime: 99.9 },
      { name: '08:00', detections: 25, alerts: 5, uptime: 99.7 },
      { name: '12:00', detections: 45, alerts: 8, uptime: 99.9 },
      { name: '16:00', detections: 38, alerts: 6, uptime: 99.8 },
      { name: '20:00', detections: 22, alerts: 3, uptime: 99.9 },
    ];

    const mockPieData: PieData[] = [
      { name: 'Person', value: 45, color: '#8884d8' },
      { name: 'Vehicle', value: 30, color: '#82ca9d' },
      { name: 'Animal', value: 15, color: '#ffc658' },
      { name: 'Other', value: 10, color: '#ff7300' },
    ];

    setLineData(mockLineData);
    setPieData(mockPieData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Detections Over Time */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Detections Over Time</CardTitle>
          <CardDescription className="text-slate-400">
            Hourly detection trends for the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Area
                type="monotone"
                dataKey="detections"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alert Types */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Detection Types</CardTitle>
          <CardDescription className="text-slate-400">
            Breakdown of detected object types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Performance */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">System Performance</CardTitle>
          <CardDescription className="text-slate-400">
            Uptime and alert metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Metric {
  type: string;
  payload: {
    name: string;
    at: number;
    server?: boolean;
  };
}

interface MetricsChartProps {
  data: Metric[];
}

export default function MetricsChart({ data }: MetricsChartProps) {
  const chartData = data.map((metric, index) => ({
    time: new Date(metric.payload.at).toLocaleTimeString(),
    value: index + 1, // Simple cumulative count
    type: metric.type,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

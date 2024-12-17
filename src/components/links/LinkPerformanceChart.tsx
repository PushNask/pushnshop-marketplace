import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface LinkPerformanceChartProps {
  linkId?: string | number;
}

export function LinkPerformanceChart({ linkId }: LinkPerformanceChartProps) {
  // Mock data - replace with real data from API
  const data = [
    { date: '2024-01-01', views: 100, clicks: 20 },
    { date: '2024-01-02', views: 150, clicks: 30 },
    { date: '2024-01-03', views: 120, clicks: 25 },
    { date: '2024-01-04', views: 200, clicks: 40 },
  ];

  return (
    <div className="h-64">
      <LineChart data={data} width={500} height={250}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="views" stroke="#8884d8" />
        <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
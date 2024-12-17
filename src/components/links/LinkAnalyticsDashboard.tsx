import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/links/MetricCard';
import { LinkPerformanceChart } from './LinkPerformanceChart';

export function LinkAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Top Performing Link"
          value="p12"
          subtitle="98% performance score"
        />
        <MetricCard
          title="Most Clicked Link"
          value="p45"
          subtitle="250 clicks today"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <LinkPerformanceChart />
        </CardContent>
      </Card>
    </div>
  );
}
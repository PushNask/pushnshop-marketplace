import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard } from '@/components/links/MetricCard';
import { LinkIcon, Clock, BarChart, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function OverviewSection() {
  const { data: metrics } = useQuery({
    queryKey: ['link-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select('status, performance_score, views_count')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const activeLinks = data.filter(l => l.status === 'active').length;
      const availableLinks = 120 - activeLinks;
      const avgPerformance = data.reduce((acc, curr) => acc + (curr.performance_score || 0), 0) / data.length;
      const todayViews = data.reduce((acc, curr) => acc + (curr.views_count || 0), 0);

      return {
        activeLinks,
        availableLinks,
        averagePerformance: avgPerformance.toFixed(1),
        todayViews,
      };
    }
  });

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <MetricCard
          title="Active Links"
          value={metrics?.activeLinks}
          icon={<LinkIcon />}
        />
        <MetricCard
          title="Available Links"
          value={metrics?.availableLinks}
          icon={<Clock />}
        />
        <MetricCard
          title="Average Performance"
          value={`${metrics?.averagePerformance}%`}
          icon={<BarChart />}
        />
        <MetricCard
          title="Total Views Today"
          value={metrics?.todayViews}
          icon={<Eye />}
        />
      </CardContent>
    </Card>
  );
}
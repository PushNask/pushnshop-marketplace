import { MetricCard } from '@/components/links/MetricCard';
import { Link as LinkIcon, Eye, ArrowUpDown, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LinksOverviewProps {
  metrics: {
    activeLinks: number;
    availableLinks: number;
    averagePerformance: number;
    todayViews: number;
    activeTrend?: number;
    performanceTrend?: number;
    viewsTrend?: number;
  };
}

export function LinksOverview({ metrics }: LinksOverviewProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title={language === "en" ? "Active Links" : "Liens actifs"}
        value={metrics?.activeLinks}
        icon={<LinkIcon />}
        trend={metrics?.activeTrend}
      />
      <MetricCard
        title={language === "en" ? "Available Links" : "Liens disponibles"}
        value={metrics?.availableLinks}
        icon={<Clock />}
      />
      <MetricCard
        title={language === "en" ? "Average Performance" : "Performance moyenne"}
        value={metrics?.averagePerformance}
        icon={<ArrowUpDown />}
        trend={metrics?.performanceTrend}
      />
      <MetricCard
        title={language === "en" ? "Total Views Today" : "Vues totales"}
        value={metrics?.todayViews}
        icon={<Eye />}
        trend={metrics?.viewsTrend}
      />
    </div>
  );
}
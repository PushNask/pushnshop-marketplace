import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: number;
  subtitle?: string;
}

export function MetricCard({ title, value, icon, trend, subtitle }: MetricCardProps) {
  const trendColor = trend && trend >= 0 ? 'text-green-600' : 'text-red-600';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">{title}</span>
          {icon && <span className="text-gray-400">{icon}</span>}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold">{value}</span>
          {trend !== undefined && (
            <span className={`text-sm ${trendColor}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend * 100).toFixed(1)}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
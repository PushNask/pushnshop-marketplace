import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: number;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  const trendColor = trend && trend >= 0 ? "text-green-600" : "text-red-600";
  const trendValue = trend ? `${(trend * 100).toFixed(1)}%` : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">{title}</span>
          <span className="text-gray-400">{icon}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold">{value}</span>
          {trendValue && (
            <span className={`text-sm ${trendColor}`}>
              {trend >= 0 ? "↑" : "↓"} {trendValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
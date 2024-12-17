import { ShoppingBag, BarChart, Bell } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface SellerMetrics {
  activeListings: number;
  totalViews: number;
  whatsappClicks: number;
  listingsTrend: number;
  viewsTrend: number;
  clicksTrend: number;
}

interface MetricsOverviewProps {
  metrics?: SellerMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Active Listings"
        value={metrics?.activeListings || 0}
        trend={metrics?.listingsTrend}
        icon={<ShoppingBag />}
      />
      <MetricCard
        title="Total Views"
        value={metrics?.totalViews || 0}
        trend={metrics?.viewsTrend}
        icon={<BarChart />}
      />
      <MetricCard
        title="WhatsApp Clicks"
        value={metrics?.whatsappClicks || 0}
        trend={metrics?.clicksTrend}
        icon={<Bell />}
      />
    </div>
  );
}
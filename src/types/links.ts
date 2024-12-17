export interface Link {
  id: number;
  path: string;
  product_id: string;
  status: 'available' | 'active';
  performance_score: number;
  views_count: number;
  whatsapp_clicks: number;
  facebook_shares: number;
  rotation_count: number;
  last_assigned: string;
  product?: {
    title: string;
    price: number;
    images: string[];
    description: string;
    seller: {
      name: string;
      whatsapp: string;
    };
  };
}

export interface LinkMetrics {
  activeLinks: number;
  availableLinks: number;
  averagePerformance: number;
  todayViews: number;
  activeTrend?: number;
  performanceTrend?: number;
  viewsTrend?: number;
}

export interface LinkFilters {
  status: 'all' | 'active' | 'available';
  sortBy: 'performance' | 'views' | 'clicks' | 'rotations';
  search: string;
}
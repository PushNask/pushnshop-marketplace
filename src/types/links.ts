export interface Link {
  id: string;
  path: string;
  product_id: string | null;
  status: 'available' | 'active';
  performance_score: number;
  views_count: number;
  whatsapp_clicks: number;
  rotation_count: number;
  last_assigned: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    title: string;
    price: number;
    images: string[];
    description: string;
    seller: {
      name: string;
      whatsapp_number: string;
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
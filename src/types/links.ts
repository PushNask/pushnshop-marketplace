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
  meta_title?: string;
  meta_description?: string;
  seo_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
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

import { DateRange } from "react-day-picker";

export interface LinkFilters {
  status: 'all' | 'active' | 'available';
  sortBy: 'performance' | 'views' | 'clicks' | 'rotations';
  search: string;
  dateRange: DateRange | null;
  page: number;
  perPage: number;
}

export interface LinkAnalytics {
  date: string;
  views: number;
  whatsapp_clicks: number;
  avg_time_on_page: number;
  performance_score: number;
}

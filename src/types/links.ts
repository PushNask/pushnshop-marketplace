import { Database } from '@/integrations/supabase/types';

export type Link = Database['public']['Tables']['permanent_links']['Row'] & {
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
};

export interface LinkMetrics {
  activeLinks: number;
  availableLinks: number;
  averagePerformance: number;
  todayViews: number;
  activeTrend: number;
  performanceTrend: number;
  viewsTrend: number;
}

export interface LinkFilters {
  status: 'all' | 'active' | 'available';
  sortBy: 'performance' | 'views' | 'clicks' | 'rotations';
  search: string;
}
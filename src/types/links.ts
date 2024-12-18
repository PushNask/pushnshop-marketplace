import { DateRange } from "react-day-picker";
import type { Json } from "@/integrations/supabase/types";

export interface Link {
  id: string;
  path: string;
  product_id: string | null;
  status: 'available' | 'active' | 'pending' | 'expired';
  performance_score: number | null;
  views_count: number | null;
  whatsapp_clicks: number | null;
  rotation_count: number | null;
  last_assigned: string | null;
  meta_title: string | null;
  meta_description: string | null;
  seo_data: Json | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  facebook_shares: number | null;
  historical_performance: Json | null;
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

export interface LinkFilters {
  status: 'all' | 'active' | 'available' | 'pending' | 'expired';
  sortBy: 'performance' | 'views' | 'clicks' | 'rotations';
  search: string;
  dateRange: DateRange | null;
  page: number;
  perPage: number;
}

export interface PageData {
  links: Link[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
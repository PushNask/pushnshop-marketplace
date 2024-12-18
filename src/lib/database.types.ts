// src/lib/database.types.ts
export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            role: 'admin' | 'seller';
            name: string | null;
            whatsapp_number: string | null;
            language: 'en' | 'fr';
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id: string;
            email: string;
            role: 'admin' | 'seller';
            name?: string | null;
            whatsapp_number?: string | null;
            language?: 'en' | 'fr';
          };
          Update: Partial<Omit<Database['public']['Tables']['users']['Insert'], 'id'>>;
        };
        products: {
          Row: {
            id: string;
            title: string;
            description: string;
            price: number;
            currency: string;
            status: 'draft' | 'pending' | 'active' | 'expired' | 'rejected';
            seller_id: string;
            images: string[];
            duration_hours: number;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['products']['Insert']>;
        };
        permanent_links: {
          Row: {
            id: number;
            path: string;
            product_id: string | null;
            status: 'available' | 'active' | 'maintenance';
            performance_score: number;
            views_count: number;
            whatsapp_clicks: number;
            facebook_shares: number;
            rotation_count: number;
            meta_title: string | null;
            meta_description: string | null;
            last_assigned: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['permanent_links']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['permanent_links']['Insert']>;
        };
        link_analytics_events: {
          Row: {
            id: string;
            link_id: number;
            event_type: 'view' | 'whatsapp_click' | 'facebook_share';
            metadata: Record<string, any> | null;
            created_at: string;
          };
          Insert: Omit<Database['public']['Tables']['link_analytics_events']['Row'], 'id' | 'created_at'>;
          Update: never;
        };
        notifications: {
          Row: {
            id: string;
            user_id: string;
            title: string;
            message: string;
            type: string;
            read: boolean;
            metadata: Record<string, any> | null;
            created_at: string;
          };
          Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
          Update: Partial<Omit<Database['public']['Tables']['notifications']['Insert'], 'user_id'>>;
        };
      };
      Functions: {
        get_seller_metrics: {
          Args: { seller_id: string };
          Returns: {
            total_products: number;
            active_products: number;
            total_views: number;
            total_clicks: number;
            average_performance: number;
          };
        };
      };
    };
  };
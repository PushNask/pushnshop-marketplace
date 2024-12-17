export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      link_analytics_events: {
        Row: {
          created_at: string | null
          duration: number | null
          event_type: string
          id: string
          ip_address: string | null
          link_id: string
          metadata: Json | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          event_type: string
          id?: string
          ip_address?: string | null
          link_id: string
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          event_type?: string
          id?: string
          ip_address?: string | null
          link_id?: string
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_analytics_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "permanent_links"
            referencedColumns: ["id"]
          },
        ]
      }
      link_assignments: {
        Row: {
          assigned_at: string | null
          expired_at: string | null
          id: string
          link_id: string
          performance_score: number | null
          product_id: string
          total_clicks: number | null
          total_shares: number | null
          total_views: number | null
        }
        Insert: {
          assigned_at?: string | null
          expired_at?: string | null
          id?: string
          link_id: string
          performance_score?: number | null
          product_id: string
          total_clicks?: number | null
          total_shares?: number | null
          total_views?: number | null
        }
        Update: {
          assigned_at?: string | null
          expired_at?: string | null
          id?: string
          link_id?: string
          performance_score?: number | null
          product_id?: string
          total_clicks?: number | null
          total_shares?: number | null
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_assignments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "permanent_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_assignments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      link_performance_history: {
        Row: {
          avg_time_on_page: number | null
          created_at: string | null
          date: string
          id: string
          link_id: string
          performance_score: number | null
          views: number | null
          whatsapp_clicks: number | null
        }
        Insert: {
          avg_time_on_page?: number | null
          created_at?: string | null
          date: string
          id?: string
          link_id: string
          performance_score?: number | null
          views?: number | null
          whatsapp_clicks?: number | null
        }
        Update: {
          avg_time_on_page?: number | null
          created_at?: string | null
          date?: string
          id?: string
          link_id?: string
          performance_score?: number | null
          views?: number | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_performance_history_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "permanent_links"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          product_id: string
          status: string
          updated_at: string | null
          verification_code: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          product_id: string
          status?: string
          updated_at?: string | null
          verification_code?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_links: {
        Row: {
          created_at: string | null
          expires_at: string | null
          facebook_shares: number | null
          historical_performance: Json | null
          id: string
          last_assigned: string | null
          meta_description: string | null
          meta_title: string | null
          path: string
          performance_score: number | null
          product_id: string | null
          rotation_count: number | null
          seo_data: Json | null
          status: string
          updated_at: string | null
          views_count: number | null
          whatsapp_clicks: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          facebook_shares?: number | null
          historical_performance?: Json | null
          id?: string
          last_assigned?: string | null
          meta_description?: string | null
          meta_title?: string | null
          path: string
          performance_score?: number | null
          product_id?: string | null
          rotation_count?: number | null
          seo_data?: Json | null
          status?: string
          updated_at?: string | null
          views_count?: number | null
          whatsapp_clicks?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          facebook_shares?: number | null
          historical_performance?: Json | null
          id?: string
          last_assigned?: string | null
          meta_description?: string | null
          meta_title?: string | null
          path?: string
          performance_score?: number | null
          product_id?: string | null
          rotation_count?: number | null
          seo_data?: Json | null
          status?: string
          updated_at?: string | null
          views_count?: number | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "permanent_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          price: number
          seller_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          price: number
          seller_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          price?: number
          seller_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_link_performance: {
        Args: {
          views: number
          clicks: number
          rotation_count: number
        }
        Returns: number
      }
      calculate_link_performance_score: {
        Args: {
          p_views: number
          p_clicks: number
          p_shares: number
          p_time_on_page: number
          p_bounce_rate: number
        }
        Returns: number
      }
      export_links_data: {
        Args: {
          format: string
          start_date: string
          end_date: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

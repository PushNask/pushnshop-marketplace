import { supabase } from '@/integrations/supabase/client';
import type { Link, LinkFilters, PageData } from '@/types/links';

export const linkService = {
  async getLinks({ page, perPage, status, search, sortBy = 'performance', sortDirection = 'desc', dateRange }: LinkFilters): Promise<PageData> {
    try {
      // Calculate the range for pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      let query = supabase
        .from('permanent_links')
        .select(`
          *,
          products!permanent_links_product_id_fkey (
            id,
            title,
            price,
            images,
            description,
            profiles!products_seller_id_fkey (
              name,
              whatsapp_number
            )
          )
        `, { count: 'exact' });

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Handle search using separate ilike conditions
      if (search) {
        query = query.or(
          `path.ilike.%${search}%`
        );
      }

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      // Apply sorting
      const sortColumn = {
        performance: 'performance_score',
        views: 'views_count',
        clicks: 'whatsapp_clicks',
        rotations: 'rotation_count'
      }[sortBy] || 'performance_score';

      query = query.order(sortColumn, { ascending: sortDirection === 'asc' });

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching links:', error);
        throw error;
      }

      return {
        links: data as Link[],
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / perPage)
      };
    } catch (error) {
      console.error('Error fetching links:', error);
      throw error;
    }
  },

  async getActivePermanentLinks() {
    try {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
          products!permanent_links_product_id_fkey (
            id,
            title,
            price,
            images,
            description,
            profiles!products_seller_id_fkey (
              name,
              whatsapp_number
            )
          )
        `)
        .eq('status', 'active')
        .order('performance_score', { ascending: false });

      if (error) throw error;
      return data as Link[] || [];
    } catch (error) {
      console.error('Error fetching active links:', error);
      throw error;
    }
  }
};
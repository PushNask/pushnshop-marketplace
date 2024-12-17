import { supabase } from '@/integrations/supabase/client';
import type { Link, LinkFilters } from '@/types/links';

export const linkService = {
  async getLinks(filters: LinkFilters) {
    try {
      let query = supabase
        .from('permanent_links')
        .select(`
          *,
          product:products (
            id,
            title,
            price,
            images,
            description,
            seller:profiles (
              name,
              whatsapp_number
            )
          )
        `, { count: 'exact' });

      // Apply status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter - using textSearch for better performance
      if (filters.search) {
        query = query.textSearch('path', filters.search);
      }

      // Apply date range filter if present
      if (filters.dateRange?.from && filters.dateRange?.to) {
        query = query
          .gte('created_at', filters.dateRange.from.toISOString())
          .lte('created_at', filters.dateRange.to.toISOString());
      }

      // Apply sorting
      const sortMapping = {
        performance: 'performance_score',
        views: 'views_count',
        clicks: 'whatsapp_clicks',
        rotations: 'rotation_count'
      };

      query = query.order(sortMapping[filters.sortBy], { ascending: false });

      // Execute query with pagination
      const { data, error, count } = await query
        .range((filters.page - 1) * filters.perPage, filters.page * filters.perPage - 1);

      if (error) {
        console.error('Error fetching links:', error);
        throw error;
      }

      return {
        links: data as Link[],
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Error in getLinks:', error);
      throw error;
    }
  },

  async updateLink(id: string, updates: Partial<Link>) {
    const { data, error } = await supabase
      .from('permanent_links')
      .update(updates)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};
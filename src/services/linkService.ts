import { supabase } from '@/integrations/supabase/client';
import type { Link, LinkFilters } from '@/types/links';

export const linkService = {
  async getLinks(filters: LinkFilters) {
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

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      // Fix the OR condition syntax for PostgREST
      query = query.or(`path.ilike.%${filters.search}%,products.title.ilike.%${filters.search}%`);
    }

    if (filters.dateRange) {
      query = query.gte('created_at', filters.dateRange.from.toISOString())
        .lte('created_at', filters.dateRange.to.toISOString());
    }

    const sortMapping = {
      performance: 'performance_score',
      views: 'views_count',
      clicks: 'whatsapp_clicks',
      rotations: 'rotation_count'
    };

    query = query.order(sortMapping[filters.sortBy], { ascending: false })
      .range(
        (filters.page - 1) * filters.perPage,
        filters.page * filters.perPage - 1
      );

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      links: data as Link[],
      totalCount: count || 0
    };
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
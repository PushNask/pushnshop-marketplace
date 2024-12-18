import { supabase } from '@/integrations/supabase/client';

export interface LinkFilters {
  page: number;
  perPage: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const linkService = {
  async getLinks({ page, perPage, status, search, sortBy = 'created_at', sortDirection = 'desc' }: LinkFilters) {
    try {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

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

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`path.ilike.%${search}%,product->title.ilike.%${search}%`);
      }

      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        links: data || [],
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
    const { data, error } = await supabase
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
      `)
      .eq('status', 'active')
      .order('performance_score', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
import { supabase } from '@/integrations/supabase/client';
import { Link, LinkMetrics } from '@/types/links';

export const linkService = {
  async getLinks(filters: LinkFilters) {
    let query = supabase
      .from('permanent_links')
      .select(`
        *,
        product:products (
          title,
          price,
          images,
          description,
          seller:profiles (
            name,
            whatsapp_number
          )
        )
      `);

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`
        path.ilike.%${filters.search}%,
        products.title.ilike.%${filters.search}%
      `);
    }

    switch (filters.sortBy) {
      case 'performance':
        query = query.order('performance_score', { ascending: false });
        break;
      case 'views':
        query = query.order('views_count', { ascending: false });
        break;
      case 'clicks':
        query = query.order('whatsapp_clicks', { ascending: false });
        break;
      case 'rotations':
        query = query.order('rotation_count', { ascending: false });
        break;
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Link[];
  },

  async getMetrics(): Promise<LinkMetrics> {
    const { data: links, error } = await supabase
      .from('permanent_links')
      .select('status, performance_score, views_count')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const activeLinks = links.filter(l => l.status === 'active').length;
    const availableLinks = 120 - activeLinks;
    const performances = links.map(l => l.performance_score || 0);
    const averagePerformance = performances.reduce((a, b) => a + b, 0) / performances.length;

    // Calculate today's views
    const today = new Date().toISOString().split('T')[0];
    const { data: todayStats, error: statsError } = await supabase
      .from('analytics_events')
      .select('count')
      .eq('event_type', 'link_view')
      .gte('created_at', today);

    if (statsError) throw statsError;

    return {
      activeLinks,
      availableLinks,
      averagePerformance,
      todayViews: todayStats?.length || 0,
      activeTrend: 0.05, // TODO: Calculate real trends
      performanceTrend: 0.12,
      viewsTrend: 0.08
    };
  }
};
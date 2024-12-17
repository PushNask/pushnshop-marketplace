import { supabase } from '@/integrations/supabase/client';

export const productService = {
  async getFilteredProducts({ status, dateRange }: { status: string, dateRange: string }) {
    const startDate = dateRange === '24h' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const query = supabase
      .from('products')
      .select(`
        *,
        seller:profiles(name, email)
      `)
      .gte('created_at', startDate);

    if (status !== 'all') {
      query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async approveProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .update({ status: 'approved' })
      .eq('id', productId);
    
    if (error) throw error;
  },

  async rejectProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .update({ status: 'rejected' })
      .eq('id', productId);
    
    if (error) throw error;
  }
};
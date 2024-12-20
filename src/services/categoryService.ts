import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  name_fr?: string;
  icon?: string;
  slug: string;
}

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
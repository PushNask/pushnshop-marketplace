import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  async getMetrics() {
    // In a real app, this would fetch from Supabase
    // For now, return mock data
    return {
      pendingProducts: 12,
      pendingPayments: 5,
      activeLinks: 98,
      revenue: 250000,
      pendingProductsTrend: 0.15,
      paymentsTrend: -0.05,
      linksTrend: 0.08,
      revenueTrend: 0.12,
      securityScore: 95,
      activeAlerts: 2
    };
  }
};
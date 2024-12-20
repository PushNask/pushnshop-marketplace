import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAnalytics() {
  const trackEvent = useCallback(async (
    eventType: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, []);

  const trackProductView = useCallback((productId: string) => {
    return trackEvent('product_view', { product_id: productId });
  }, [trackEvent]);

  const trackWhatsAppClick = useCallback((productId: string) => {
    return trackEvent('whatsapp_click', { product_id: productId });
  }, [trackEvent]);

  const trackLinkView = useCallback((linkId: string) => {
    return trackEvent('link_view', { link_id: linkId });
  }, [trackEvent]);

  return {
    trackEvent,
    trackProductView,
    trackWhatsAppClick,
    trackLinkView
  };
}
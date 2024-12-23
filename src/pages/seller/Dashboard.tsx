import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerNavLinks } from "@/components/seller/navigation/SellerNavLinks";
import { MetricsOverview } from "@/components/seller/MetricsOverview";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguage();

  // Fetch seller profile and metrics
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['seller-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, status, created_at')
        .eq('seller_id', user.id);

      if (productsError) throw productsError;

      const activeListings = products?.filter(p => p.status === 'active').length || 0;
      
      return {
        activeListings,
        totalViews: 0, // These will be implemented with analytics
        whatsappClicks: 0,
        listingsTrend: 0,
        viewsTrend: 0,
        clicksTrend: 0
      };
    }
  });

  if (profileLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader 
        profile={profile} 
        onMenuClick={() => setSidebarOpen(true)} 
      />

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full pt-16">
          <div className="flex-1 px-4 space-y-1 mt-4">
            <SellerNavLinks />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-6">
          {/* Create Listing Button */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Seller Dashboard' : 'Tableau de bord vendeur'}
            </h1>
            <Link to="/seller/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {language === 'en' ? 'Create Listing' : 'Créer une annonce'}
              </Button>
            </Link>
          </div>

          {/* Metrics Overview */}
          <ErrorBoundary>
            <MetricsOverview metrics={metrics} />
          </ErrorBoundary>

          {/* Dynamic Content */}
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
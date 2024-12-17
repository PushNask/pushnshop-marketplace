import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  BarChart, 
  User, 
  Bell,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { SellerHeader } from "@/components/seller/SellerHeader";
import { MetricsOverview } from "@/components/seller/MetricsOverview";
import { SidebarLink } from "@/components/seller/SidebarLink";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface SellerMetrics {
  activeListings: number;
  totalViews: number;
  whatsappClicks: number;
  listingsTrend: number;
  viewsTrend: number;
  clicksTrend: number;
}

interface SellerProfile {
  name: string;
  businessName: string;
  avatar: string | null;
}

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const { data: metrics } = useQuery({
    queryKey: ['seller-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: products } = await supabase
        .from('products')
        .select('id, status, analytics:analytics_events(views:views_count, clicks:whatsapp_clicks)')
        .eq('seller_id', user.id)
        .eq('status', 'active');

      if (!products) return null;

      const activeListings = products.length;
      const totalViews = products.reduce((sum, p) => sum + (p.analytics?.[0]?.views || 0), 0);
      const whatsappClicks = products.reduce((sum, p) => sum + (p.analytics?.[0]?.clicks || 0), 0);

      return {
        activeListings,
        totalViews,
        whatsappClicks,
        listingsTrend: 0.15,
        viewsTrend: 0.08,
        clicksTrend: 0.12
      } as SellerMetrics;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, whatsapp_number')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      return {
        name: profile.name || 'Seller',
        businessName: profile.name || 'Business',
        avatar: null
      } as SellerProfile;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader profile={profile} onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-full
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            <SidebarLink
              to="/seller/products"
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Products"
            />
            <SidebarLink
              to="/seller/analytics"
              icon={<BarChart className="h-5 w-5" />}
              label="Analytics"
            />
            <SidebarLink
              to="/seller/profile"
              icon={<User className="h-5 w-5" />}
              label="Profile"
            />
          </nav>

          <div className="p-4">
            <Button
              className="w-full"
              onClick={() => window.location.href = '/seller/products/new'}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-6">
          <MetricsOverview metrics={metrics} />
        </div>
      </main>
    </div>
  );
}

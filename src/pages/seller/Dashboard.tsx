import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerNavLinks } from "@/components/seller/navigation/SellerNavLinks";
import { MetricCard } from "@/components/seller/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, BarChart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile] = useState({ name: "Seller", avatar: null });
  const { language } = useLanguage();

  const { data: metrics } = useQuery({
    queryKey: ['seller-metrics'],
    queryFn: () => ({
      activeListings: 5,
      totalViews: 1250,
      whatsappClicks: 85,
      listingsTrend: 0.15,
      viewsTrend: 0.08,
      clicksTrend: 0.12
    })
  });

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
        aria-label="Seller navigation"
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
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title={language === 'en' ? "Active Listings" : "Annonces actives"}
              value={metrics?.activeListings}
              trend={metrics?.listingsTrend}
              icon={<ShoppingBag className="h-5 w-5" />}
            />
            <MetricCard
              title={language === 'en' ? "Total Views" : "Vues totales"}
              value={metrics?.totalViews}
              trend={metrics?.viewsTrend}
              icon={<BarChart className="h-5 w-5" />}
            />
            <MetricCard
              title={language === 'en' ? "WhatsApp Clicks" : "Clics WhatsApp"}
              value={metrics?.whatsappClicks}
              trend={metrics?.clicksTrend}
              icon={<MessageCircle className="h-5 w-5" />}
            />
          </div>

          {/* Dynamic Content */}
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
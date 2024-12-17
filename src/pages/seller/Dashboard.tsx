import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { X, ShoppingBag, BarChart, User, Plus } from "lucide-react";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { MetricsOverview } from "@/components/seller/MetricsOverview";
import { SidebarLink } from "@/components/seller/SidebarLink";
import { Button } from "@/components/ui/button";

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

  const { data: metrics } = useQuery<SellerMetrics>({
    queryKey: ["seller-metrics"],
    queryFn: () => ({
      activeListings: 5,
      totalViews: 1250,
      whatsappClicks: 85,
      listingsTrend: 0.15,
      viewsTrend: 0.08,
      clicksTrend: 0.12,
    })
  });

  const { data: profile } = useQuery<SellerProfile>({
    queryKey: ["seller-profile"],
    queryFn: () => ({
      name: "John Doe",
      businessName: "JD Electronics",
      avatar: null,
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
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
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
              onClick={() => window.location.href = "/seller/products/new"}
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
          <Outlet />
        </div>
      </main>
    </div>
  );
}
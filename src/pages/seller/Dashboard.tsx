import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/useLanguage";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/seller/MetricCard";
import { NotificationsDropdown } from "@/components/seller/NotificationsDropdown";
import { SidebarLink } from "@/components/seller/SidebarLink";

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/placeholder.svg"
                  alt="PushNshop"
                  className="h-8 w-8"
                />
                <span className="hidden lg:block font-semibold text-gray-900">
                  PushNshop Seller
                </span>
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                {language.toUpperCase()}
              </Button>

              <NotificationsDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profile?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/seller/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/seller/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

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
              onClick={() => navigate("/seller/products/new")}
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
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Active Listings"
              value={metrics?.activeListings || 0}
              trend={metrics?.listingsTrend}
              icon={<ShoppingBag />}
            />
            <MetricCard
              title="Total Views"
              value={metrics?.totalViews || 0}
              trend={metrics?.viewsTrend}
              icon={<BarChart />}
            />
            <MetricCard
              title="WhatsApp Clicks"
              value={metrics?.whatsappClicks || 0}
              trend={metrics?.clicksTrend}
              icon={<Bell />}
            />
          </div>

          {/* Dynamic Content */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
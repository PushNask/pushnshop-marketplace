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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['seller-metrics'],
    queryFn: async () => {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user?.id)
        .eq('status', 'active');

      if (productsError) throw productsError;

      const { data: views, error: viewsError } = await supabase
        .from('analytics_events')
        .select('id')
        .in('product_id', products?.map(p => p.id) || [])
        .eq('event_type', 'view');

      if (viewsError) throw viewsError;

      const { data: clicks, error: clicksError } = await supabase
        .from('analytics_events')
        .select('id')
        .in('product_id', products?.map(p => p.id) || [])
        .eq('event_type', 'whatsapp_click');

      if (clicksError) throw clicksError;

      return {
        activeListings: products?.length || 0,
        totalViews: views?.length || 0,
        whatsappClicks: clicks?.length || 0
      };
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, whatsapp_number')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

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
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
              >
                {language.toUpperCase()}
              </Button>
              
              <NotificationsDropdown />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profile?.name?.charAt(0) || user?.email?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/seller/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/seller/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
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
              label={language === 'en' ? 'Products' : 'Produits'}
            />
            <SidebarLink
              to="/seller/analytics"
              icon={<BarChart className="h-5 w-5" />}
              label={language === 'en' ? 'Analytics' : 'Analytique'}
            />
            <SidebarLink
              to="/seller/profile"
              icon={<User className="h-5 w-5" />}
              label={language === 'en' ? 'Profile' : 'Profil'}
            />
          </nav>

          <div className="p-4">
            <Button
              className="w-full"
              onClick={() => navigate('/seller/products/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'New Listing' : 'Nouvelle annonce'}
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
              title={language === 'en' ? 'Active Listings' : 'Annonces actives'}
              value={metrics?.activeListings}
              icon={<ShoppingBag />}
            />
            <MetricCard
              title={language === 'en' ? 'Total Views' : 'Vues totales'}
              value={metrics?.totalViews}
              icon={<BarChart />}
            />
            <MetricCard
              title={language === 'en' ? 'WhatsApp Clicks' : 'Clics WhatsApp'}
              value={metrics?.whatsappClicks}
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

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm
        ${isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon 
}: { 
  title: string; 
  value?: number; 
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">{title}</span>
          <span className="text-gray-400">{icon}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold">{value || 0}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsDropdown() {
  const { language } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 text-center text-gray-500">
          {language === 'en' ? 'No notifications' : 'Aucune notification'}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

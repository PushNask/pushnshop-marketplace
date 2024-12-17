import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SecurityMetrics } from '@/components/admin/SecurityMetrics';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onNotificationsClick: () => void;
  metrics: {
    securityScore?: number;
    activeAlerts?: number;
  };
}

export function AdminHeader({ 
  onMenuClick, 
  onNotificationsClick, 
  metrics 
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
          >
            {language.toUpperCase()}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="relative"
          >
            <Bell className="h-5 w-5 text-gray-500" />
            {metrics?.activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {metrics.activeAlerts}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/security')}>
                Security Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-gray-200">
        <div className="flex gap-4">
          <Input 
            placeholder={language === 'en' ? "Search..." : "Rechercher..."}
            className="max-w-md"
            startIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
          <SecurityMetrics 
            score={metrics?.securityScore}
            alerts={metrics?.activeAlerts}
          />
        </div>
      </div>
    </header>
  );
}
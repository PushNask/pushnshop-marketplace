import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings, Users, ShoppingBag, CreditCard, 
  BarChart, Link as LinkIcon, Shield, LogOut, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/admin/dashboard", icon: <BarChart />, label: "Dashboard" },
    { to: "/admin/products", icon: <ShoppingBag />, label: "Products" },
    { to: "/admin/payments", icon: <CreditCard />, label: "Payments" },
    { to: "/admin/links", icon: <LinkIcon />, label: "Links" },
    { to: "/admin/users", icon: <Users />, label: "Users" },
    { to: "/admin/security", icon: <Shield />, label: "Security" },
    { to: "/admin/settings", icon: <Settings />, label: "Settings" }
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 
      transform transition-transform duration-200 ease-in-out
      lg:translate-x-0 lg:static lg:h-full
      ${open ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/api/placeholder/32/32"
              alt="PushNshop Admin"
              className="h-8"
            />
            <span className="font-semibold text-gray-900">Admin Portal</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>{user?.email?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavLink({ to, icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm
        transition-colors duration-200
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
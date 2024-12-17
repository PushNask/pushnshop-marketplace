import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerNavLinks } from "@/components/seller/navigation/SellerNavLinks";

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile] = useState({ name: "Seller", avatar: null });

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader 
        profile={profile} 
        onMenuClick={() => setSidebarOpen(true)} 
      />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-full
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full pt-16">
          <div className="flex-1 px-4 space-y-1 mt-4">
            <SellerNavLinks />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-6">
          <Outlet />
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
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { NotificationCenter } from '@/components/admin/NotificationCenter';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminService.getMetrics,
    initialData: {
      pendingProducts: 12,
      pendingPayments: 5,
      activeLinks: 98,
      revenue: 250000,
      pendingProductsTrend: 0.15,
      paymentsTrend: -0.05,
      linksTrend: 0.08,
      revenueTrend: 0.12,
      securityScore: 95,
      activeAlerts: 2
    }
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsClick={() => setShowNotifications(true)}
          metrics={metrics}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      <NotificationCenter
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
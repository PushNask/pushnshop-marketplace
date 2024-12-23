import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigate } from 'react-router-dom';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { OtherListings } from '@/components/home/OtherListings';
import { linkService } from '@/services/linkService';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['active-products'],
    queryFn: () => linkService.getActivePermanentLinks(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Format currency helper
  const formatCurrency = (price: number, currency: string = 'XAF') => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'} replace />;
  }

  const FEATURED_COUNT = 12;
  const isAtFullCapacity = products && products.length >= 120;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Products Section */}
      <FeaturedProducts
        products={products?.slice(0, FEATURED_COUNT) || []}
        language={language}
        loadingProducts={loadingProducts}
        isAtFullCapacity={isAtFullCapacity}
        formatCurrency={formatCurrency}
      />

      {/* Other Listings Section */}
      <OtherListings
        products={products?.slice(FEATURED_COUNT) || []}
        language={language}
        featuredCount={FEATURED_COUNT}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}

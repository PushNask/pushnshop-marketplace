import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigate } from 'react-router-dom';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { linkService } from '@/services/linkService';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['active-products'],
    queryFn: () => linkService.getActivePermanentLinks(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching products:', error);
      }
    }
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
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
      {/* Categories Section */}
      <Categories
        language={language}
        isLoading={loadingProducts}
      />

      {/* Featured Products Section */}
      <FeaturedProducts
        products={products?.slice(0, FEATURED_COUNT) || []}
        language={language}
        loadingProducts={loadingProducts}
        isAtFullCapacity={isAtFullCapacity}
        formatCurrency={(price: number, currency: string = 'XAF') => {
          return new Intl.NumberFormat('fr-CM', {
            style: 'currency',
            currency: currency
          }).format(price);
        }}
      />
    </div>
  );
}
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useActivePermanentLinks } from '@/hooks/useActivePermanentLinks';
import { SafetyBanner } from '@/components/SafetyBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { OtherListings } from '@/components/home/OtherListings';
import { Categories } from '@/components/home/Categories';
import { HeroSection } from '@/components/home/HeroSection';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const formatCurrency = (price: number, currency: string = 'XAF') => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency
  }).format(price);
};

export default function Index() {
  const { language } = useLanguage();
  const { 
    data: productsData, 
    isLoading: productsLoading 
  } = useActivePermanentLinks();

  const MAX_CAPACITY = 120;
  const FEATURED_COUNT = 12;

  // Process products data
  const allProducts = productsData || [];
  const isAtFullCapacity = allProducts.length >= MAX_CAPACITY;

  const featuredProducts = allProducts.slice(0, FEATURED_COUNT);
  const otherProducts = allProducts.slice(FEATURED_COUNT);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <SafetyBanner />
        
        <HeroSection language={language} />
        
        <FeaturedProducts
          products={featuredProducts}
          language={language}
          loadingProducts={productsLoading}
          isAtFullCapacity={isAtFullCapacity}
          formatCurrency={formatCurrency}
        />

        <OtherListings
          products={otherProducts}
          language={language}
          featuredCount={FEATURED_COUNT}
          formatCurrency={formatCurrency}
        />

        <Categories
          categories={[]}
          language={language}
          isLoading={false}
        />
      </div>
    </ErrorBoundary>
  );
}
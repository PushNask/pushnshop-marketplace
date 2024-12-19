import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { PlaceholderCard } from '@/components/PlaceholderCard';

interface ProductGridProps {
  products: any[];
  placeholderCount: number;
  isLoading: boolean;
  language: string;
  formatCurrency: (price: number, currency: string) => string;
}

export function ProductGrid({ 
  products = [], 
  placeholderCount,
  isLoading,
  language,
  formatCurrency
}: ProductGridProps) {
  const filledProducts = [
    ...products,
    ...Array(Math.max(0, placeholderCount - products.length)).fill(null)
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-up">
        {Array(placeholderCount).fill(null).map((_, i) => (
          <PlaceholderCard key={i} language={language} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filledProducts.map((product, i) => (
        product ? (
          <ProductCard 
            key={`product-${i}`}
            product={product}
            language={language}
            formatCurrency={formatCurrency}
            linkNumber={i + 1}
          />
        ) : (
          <PlaceholderCard 
            key={`placeholder-${i}`} 
            language={language} 
          />
        )
      ))}
    </div>
  );
}
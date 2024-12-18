import React, { useState } from 'react';
import { FiltersSection } from '@/components/links/FiltersSection';
import { LinksOverview } from '@/components/links/LinksOverview';
import { LinksListWithErrorBoundary } from '@/components/links/LinksList';
import { useDebounce } from '@/hooks/useDebounce';
import type { LinkFilters } from '@/types/links';

export default function LinksManagement() {
  const [filters, setFilters] = useState<LinkFilters>({
    status: 'all',
    sortBy: 'performance',
    search: '',
    dateRange: null,
    page: 1,
    perPage: 20
  });

  const debouncedFilters = useDebounce(filters, 300);

  return (
    <div className="space-y-6">
      <LinksOverview 
        metrics={{
          activeLinks: 0,
          availableLinks: 0,
          averagePerformance: 0,
          todayViews: 0,
          activeTrend: 0,
          performanceTrend: 0,
          viewsTrend: 0
        }} 
      />
      
      <FiltersSection
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <LinksListWithErrorBoundary
        filters={debouncedFilters}
      />
    </div>
  );
}
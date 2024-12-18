import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinksOverview } from '@/components/links/LinksOverview';
import { LinksFilters } from '@/components/links/LinksFilters';
import { LinksList } from '@/components/links/LinksList';
import { supabase } from '@/integrations/supabase/client';
import type { Link } from '@/types/links';
import type { Database } from '@/integrations/supabase/types';

type PermanentLink = Database['public']['Tables']['permanent_links']['Row'] & {
  product?: Database['public']['Tables']['products']['Row'] & {
    seller: Database['public']['Tables']['profiles']['Row'];
  };
};

export default function LinksManagement() {
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "performance",
    search: ""
  });

  const { data: links, isLoading } = useQuery({
    queryKey: ["permanent-links", filters],
    queryFn: async () => {
      let query = supabase
        .from('permanent_links')
        .select(`
          *,
          product:products (
            *,
            seller:profiles (*)
          )
        `);

      if (filters.status !== "all") {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.ilike('path', `%${filters.search}%`);
      }

      const sortColumn = {
        performance: "performance_score",
        views: "views_count",
        clicks: "whatsapp_clicks",
        rotations: "rotation_count"
      }[filters.sortBy];

      if (sortColumn) {
        query = query.order(sortColumn, { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data as PermanentLink[]).map(link => ({
        ...link,
        status: link.status as Link['status'],
        product: link.product ? {
          id: link.product.id,
          title: link.product.title,
          price: link.product.price,
          images: link.product.images || [],
          description: link.product.description || '',
          seller: {
            name: link.product.seller.name || '',
            whatsapp_number: link.product.seller.whatsapp_number || ''
          }
        } : undefined
      })) as Link[];
    }
  });

  const { data: metrics } = useQuery({
    queryKey: ["links-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permanent_links")
        .select("status, performance_score, views_count");

      if (error) throw error;

      const active = data.filter(l => l.status === "active").length;
      const available = data.filter(l => l.status === "available").length;
      const avgPerformance = data.reduce((acc, curr) => acc + (curr.performance_score || 0), 0) / (data.length || 1);
      const totalViews = data.reduce((acc, curr) => acc + (curr.views_count || 0), 0);

      return {
        activeLinks: active,
        availableLinks: available,
        averagePerformance: Number(avgPerformance.toFixed(1)),
        todayViews: totalViews,
        activeTrend: 0,
        performanceTrend: 0,
        viewsTrend: 0
      };
    }
  });

  const defaultMetrics = {
    activeLinks: 0,
    availableLinks: 0,
    averagePerformance: 0,
    todayViews: 0,
    activeTrend: 0,
    performanceTrend: 0,
    viewsTrend: 0
  };

  return (
    <div className="space-y-6">
      <LinksOverview metrics={metrics || defaultMetrics} />

      <Card>
        <CardHeader>
          <CardTitle>Link Management</CardTitle>
        </CardHeader>
        <CardContent>
          <LinksFilters filters={filters} onFiltersChange={setFilters} />
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <LinksList 
              links={links || []}
              onView={(link) => console.log("View link", link)}
              onAssign={() => console.log("Assign link")}
              onUpdateSEO={() => console.log("Update SEO")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
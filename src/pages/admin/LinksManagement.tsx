import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiltersSection } from '@/components/links/FiltersSection';
import { LinksList } from '@/components/links/LinksList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LinkAnalyticsDashboard } from '@/components/links/LinkAnalyticsDashboard';
import { LinkPerformanceChart } from '@/components/links/LinkPerformanceChart';
import { linkService } from '@/services/linkService';
import { toast } from '@/hooks/use-toast';
import type { Link, LinkFilters } from '@/types/links';

export default function LinksManagement() {
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState<LinkFilters>({
    status: 'all',
    sortBy: 'performance',
    search: '',
    dateRange: null,
    page: 1,
    perPage: 120
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['links', filters],
    queryFn: () => linkService.getLinks(filters),
    meta: {
      errorMessage: "There was a problem loading the links. Please try again."
    }
  });

  // Handle error state with toast
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading links",
        description: "There was a problem loading the links. Please try again.",
        variant: "destructive"
      });
    }
  }, [error]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-600">Failed to load links</div>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Links Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Link Management</CardTitle>
            <Button onClick={() => setShowAnalytics(true)}>
              View Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <FiltersSection
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Links Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading links...</div>
          ) : (
            <LinksList 
              links={data?.links || []}
              onView={setSelectedLink}
            />
          )}
        </CardContent>
      </Card>

      {/* Link Details Modal */}
      <Dialog 
        open={!!selectedLink} 
        onOpenChange={() => setSelectedLink(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Link Details - {selectedLink?.path}</DialogTitle>
          </DialogHeader>
          {selectedLink && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Link Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Link Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className="font-medium">{selectedLink.status}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Performance Score</label>
                    <p className="font-medium">{selectedLink.performance_score}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Total Views</label>
                    <p className="font-medium">{selectedLink.views_count}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">WhatsApp Clicks</label>
                    <p className="font-medium">{selectedLink.whatsapp_clicks}</p>
                  </div>
                </div>
                
                {/* Performance Chart */}
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Performance History</h4>
                  <LinkPerformanceChart linkId={selectedLink.id} />
                </div>
              </div>

              {/* Product Details */}
              {selectedLink.product && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Product</h3>
                  <img
                    src={selectedLink.product.images[0] || "/placeholder.svg"}
                    alt=""
                    className="w-full rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium">{selectedLink.product.title}</h4>
                    <p className="text-sm text-gray-500">
                      {selectedLink.product.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog 
        open={showAnalytics} 
        onOpenChange={setShowAnalytics}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Links Analytics</DialogTitle>
          </DialogHeader>
          <LinkAnalyticsDashboard />
        </DialogContent>
      </Dialog>
    </div>
  );
}
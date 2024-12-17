import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Link as LinkIcon, 
  Copy, 
  BarChart, 
  Clock, 
  Eye,
  Share2,
  Search
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { MetricCard } from '@/components/links/MetricCard';
import { LinkCard } from '@/components/links/LinkCard';
import { LinkPerformanceChart } from '@/components/links/LinkPerformanceChart';
import { LinkAnalyticsDashboard } from '@/components/links/LinkAnalyticsDashboard';
import { linkService } from '@/services/linkService';
import { Link, LinkFilters } from '@/types/links';

export default function LinksManagement() {
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState<LinkFilters>({
    status: 'all',
    sortBy: 'performance',
    search: ''
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['link-metrics'],
    queryFn: linkService.getMetrics
  });

  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ['links', filters],
    queryFn: () => linkService.getLinks(filters)
  });

  const copyLink = async (path: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${path}`);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Links Overview</CardTitle>
          <CardDescription>
            Manage your 120 permanent links and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Links"
              value={metrics?.activeLinks ?? 0}
              icon={<LinkIcon />}
              trend={metrics?.activeTrend}
            />
            <MetricCard
              title="Available Links"
              value={metrics?.availableLinks ?? 0}
              icon={<Clock />}
            />
            <MetricCard
              title="Average Performance"
              value={`${(metrics?.averagePerformance ?? 0).toFixed(1)}%`}
              icon={<BarChart />}
              trend={metrics?.performanceTrend}
            />
            <MetricCard
              title="Total Views Today"
              value={metrics?.todayViews ?? 0}
              icon={<Eye />}
              trend={metrics?.viewsTrend}
            />
          </div>
        </CardContent>
      </Card>

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
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search links or products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="max-w-xs"
            />
            <Select
              value={filters.status}
              onValueChange={(value: LinkFilters['status']) => 
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="available">Available</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.sortBy}
              onValueChange={(value: LinkFilters['sortBy']) => 
                setFilters({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance Score</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="clicks">WhatsApp Clicks</SelectItem>
                <SelectItem value="rotations">Rotation Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Links Grid */}
          {linksLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading links...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {links?.map((link, i) => (
                <LinkCard
                  key={link.id}
                  linkNumber={i + 1}
                  link={link}
                  onView={setSelectedLink}
                />
              ))}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Link Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Link Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="font-medium">{selectedLink?.status}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Performance Score</label>
                  <p className="font-medium">{selectedLink?.performance_score}%</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Views</label>
                  <p className="font-medium">{selectedLink?.views_count}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">WhatsApp Clicks</label>
                  <p className="font-medium">{selectedLink?.whatsapp_clicks}</p>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="mt-6">
                <h4 className="font-medium mb-4">Performance History</h4>
                <LinkPerformanceChart linkId={selectedLink?.id} />
              </div>
            </div>

            {/* Product Details */}
            {selectedLink?.product && (
              <div className="space-y-4">
                <h3 className="font-semibold">Current Product</h3>
                <img
                  src={selectedLink.product.images[0] || "/api/placeholder/400/300"}
                  alt=""
                  className="w-full rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{selectedLink.product.title}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedLink.product.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Price</label>
                    <p className="font-medium">
                      {new Intl.NumberFormat('fr-CM', {
                        style: 'currency',
                        currency: 'XAF'
                      }).format(selectedLink.product.price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Seller</label>
                    <p className="font-medium">{selectedLink.product.seller.name}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${selectedLink.path}`);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </div>
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

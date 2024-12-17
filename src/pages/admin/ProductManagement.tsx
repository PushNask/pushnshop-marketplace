import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, X, Calendar, RefreshCcw, Eye, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { productService } from '@/services/productService';

export default function ProductManagement() {
  const [filters, setFilters] = useState({
    status: 'pending',
    dateRange: '24h'
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getFilteredProducts(filters)
  });

  const approveMutation = useMutation({
    mutationFn: (productId: string) => productService.approveProduct(productId),
    onSuccess: () => toast({ title: 'Product approved successfully' }),
    onError: () => toast({ title: 'Failed to approve product', variant: 'destructive' })
  });

  const rejectMutation = useMutation({
    mutationFn: (productId: string) => productService.rejectProduct(productId),
    onSuccess: () => toast({ title: 'Product rejected' }),
    onError: () => toast({ title: 'Failed to reject product', variant: 'destructive' })
  });

  return (
    <div className="space-y-6">
      <FiltersCard filters={filters} setFilters={setFilters} />
      <ProductListCard 
        products={products} 
        isLoading={isLoading}
        onApprove={approveMutation.mutate}
        onReject={rejectMutation.mutate}
      />
    </div>
  );
}

function FiltersCard({ filters, setFilters }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ status: 'pending', dateRange: '24h' })}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Tabs
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {filters.dateRange === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, dateRange: '24h' })}>
                Last 24 Hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, dateRange: '7d' })}>
                Last 7 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductListCard({ products, isLoading, onApprove, onReject }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading products...
                  </td>
                </tr>
              ) : products?.map((product) => (
                <ProductRow 
                  key={product.id} 
                  product={product}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductRow({ product, onApprove, onReject }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt=""
            className="h-10 w-10 rounded-md object-cover"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.title}
            </div>
            <div className="text-sm text-gray-500">
              {product.description?.substring(0, 50)}...
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.seller?.name}</div>
        <div className="text-sm text-gray-500">{product.seller?.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Intl.NumberFormat('fr-CM', {
            style: 'currency',
            currency: 'XAF'
          }).format(product.price)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(product.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* View details */}}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApprove(product.id)}
            className="text-green-600 hover:text-green-700"
            disabled={product.status !== 'pending'}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReject(product.id)}
            className="text-red-600 hover:text-red-700"
            disabled={product.status !== 'pending'}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Search } from 'lucide-react';
import type { LinkFilters } from '@/types/links';

interface FiltersSectionProps {
  filters: LinkFilters;
  onFiltersChange: (filters: LinkFilters) => void;
}

export function FiltersSection({ filters, onFiltersChange }: FiltersSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Input
          placeholder="Search links..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
          className="pl-10"
        />
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
      </div>
      
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value as LinkFilters['status'], page: 1 })}
      >
        <SelectTrigger>
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
        onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as LinkFilters['sortBy'], page: 1 })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="performance">Performance Score</SelectItem>
          <SelectItem value="views">Views</SelectItem>
          <SelectItem value="clicks">WhatsApp Clicks</SelectItem>
          <SelectItem value="rotations">Rotation Count</SelectItem>
        </SelectContent>
      </Select>

      <DateRangePicker
        value={filters.dateRange}
        onChange={(range) => onFiltersChange({ ...filters, dateRange: range, page: 1 })}
      />
    </div>
  );
}
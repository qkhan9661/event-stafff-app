'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icons';

interface ClientFiltersProps {
  onLoginAccessChange: (value: 'all' | 'with' | 'without') => void;
  onSortByChange: (column: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  loginAccess?: 'all' | 'with' | 'without';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function ClientFilters({
  onLoginAccessChange,
  onSortByChange,
  onSortOrderChange,
  loginAccess = 'all',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: ClientFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Login Access Filter */}
      <Select value={loginAccess} onValueChange={onLoginAccessChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          <SelectItem value="with">With Portal Access</SelectItem>
          <SelectItem value="without">Without Portal Access</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort By */}
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date Created</SelectItem>
          <SelectItem value="businessName">Business Name</SelectItem>
          <SelectItem value="lastName">Last Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Order */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="w-full sm:w-auto"
      >
        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
      </Button>
    </div>
  );
}

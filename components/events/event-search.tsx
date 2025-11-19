'use client';

import { SearchBar } from '@/components/common/search-bar';

interface EventSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EventSearch({ value, onChange, placeholder = 'Search events...' }: EventSearchProps) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

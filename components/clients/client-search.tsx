'use client';

import { Input } from '@/components/ui/input';
import { SearchIcon, XIcon } from '@/components/ui/icons';
import { useState, useEffect } from 'react';

interface ClientSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function ClientSearch({
  onSearch,
  placeholder = 'Search by business name, contact, or email...',
}: ClientSearchProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  const handleClear = () => {
    setSearch('');
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {search && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

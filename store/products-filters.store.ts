import { create } from 'zustand';

export type ProductActiveFilter = 'all' | 'active' | 'inactive';
export type ProductSortBy = 'title' | 'cost' | 'category' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

interface ProductsFiltersState {
  // Pagination
  page: number;
  limit: number;

  // Search & Filters
  search: string;
  active: ProductActiveFilter;
  category: string;

  // Sorting
  sortBy: ProductSortBy;
  sortOrder: SortOrder;

  // Actions - Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  // Actions - Search & Filters
  setSearch: (search: string) => void;
  setActive: (active: ProductActiveFilter) => void;
  setCategory: (category: string) => void;

  // Actions - Sorting
  setSortBy: (sortBy: ProductSortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;

  // Actions - Bulk
  resetFilters: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS = {
  search: '',
  active: 'all' as ProductActiveFilter,
  category: '',
};

const DEFAULT_STATE = {
  page: 1,
  limit: 10,
  ...DEFAULT_FILTERS,
  sortBy: 'title' as ProductSortBy,
  sortOrder: 'asc' as SortOrder,
};

export const useProductsFilters = create<ProductsFiltersState>((set) => ({
  ...DEFAULT_STATE,

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),

  setSearch: (search) => set({ search, page: 1 }),
  setActive: (active) => set({ active, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),

  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  resetFilters: () => set({ ...DEFAULT_FILTERS, page: 1 }),
  resetAll: () => set(DEFAULT_STATE),
}));


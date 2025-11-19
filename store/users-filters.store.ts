import { create } from "zustand";
import { UserRole } from "@prisma/client";

export type UserSortBy = "createdAt" | "updatedAt" | "firstName" | "lastName" | "email" | "role";
export type SortOrder = "asc" | "desc";

interface UsersFiltersState {
  // Pagination
  page: number;
  limit: number;

  // Search & Filters
  search: string;
  selectedRole: UserRole | "ALL";
  selectedStatus: boolean | "ALL";
  selectedEmailVerified: boolean | "ALL";
  selectedHasPhone: boolean | "ALL";
  createdFrom: string;
  createdTo: string;

  // Sorting
  sortBy: UserSortBy;
  sortOrder: SortOrder;

  // Actions - Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  // Actions - Search & Filters
  setSearch: (search: string) => void;
  setSelectedRole: (role: UserRole | "ALL") => void;
  setSelectedStatus: (status: boolean | "ALL") => void;
  setSelectedEmailVerified: (verified: boolean | "ALL") => void;
  setSelectedHasPhone: (hasPhone: boolean | "ALL") => void;
  setCreatedFrom: (date: string) => void;
  setCreatedTo: (date: string) => void;

  // Actions - Sorting
  setSortBy: (sortBy: UserSortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;

  // Actions - Bulk
  resetFilters: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS = {
  search: "",
  selectedRole: "ALL" as UserRole | "ALL",
  selectedStatus: "ALL" as boolean | "ALL",
  selectedEmailVerified: "ALL" as boolean | "ALL",
  selectedHasPhone: "ALL" as boolean | "ALL",
  createdFrom: "",
  createdTo: "",
};

const DEFAULT_STATE = {
  page: 1,
  limit: 10,
  ...DEFAULT_FILTERS,
  sortBy: "createdAt" as UserSortBy,
  sortOrder: "desc" as SortOrder,
};

export const useUsersFilters = create<UsersFiltersState>((set) => ({
  ...DEFAULT_STATE,

  // Pagination actions
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }), // Reset to page 1 when changing limit

  // Search & Filter actions
  setSearch: (search) => set({ search, page: 1 }), // Reset to page 1 when searching
  setSelectedRole: (selectedRole) => set({ selectedRole, page: 1 }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus, page: 1 }),
  setSelectedEmailVerified: (selectedEmailVerified) => set({ selectedEmailVerified, page: 1 }),
  setSelectedHasPhone: (selectedHasPhone) => set({ selectedHasPhone, page: 1 }),
  setCreatedFrom: (createdFrom) => set({ createdFrom, page: 1 }),
  setCreatedTo: (createdTo) => set({ createdTo, page: 1 }),

  // Sorting actions
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  // Bulk actions
  resetFilters: () => set({ ...DEFAULT_FILTERS, page: 1 }),
  resetAll: () => set(DEFAULT_STATE),
}));

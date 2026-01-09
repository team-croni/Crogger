import { create } from 'zustand';
import { Filters } from '@/types/log';
import { getDefaultFilters } from '@utils/filters';

interface FilterState {
  filters: Filters;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  setFilters: (filters: Filters) => void;
  updateFilter: (filterName: keyof Filters, value: any) => void;
  resetFilters: () => void;
  initializeFilters: (initialFilters: Filters) => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {
    level: [],
    category: [],
    search: '',
    method: [],
    statusCode: [],
    host: '',
    path: '',
    dateRange: {
      from: null,
      to: null,
    },
  },

  searchValue: '',
  setSearchValue: (searchValue) => set({ searchValue }),
  setFilters: (filters) => set({ filters }),

  updateFilter: (filterName, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filterName]: value,
      },
    })),

  resetFilters: () => {
    set({ filters: getDefaultFilters() });
  },

  initializeFilters: (initialFilters) => set({ filters: initialFilters }),
}));
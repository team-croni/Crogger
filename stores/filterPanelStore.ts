import { create } from 'zustand';
import { Filters } from '@/types/log';
import { getDefaultFilters } from '@utils/filters';

interface FilterPanelState {
  isOpen: boolean;
  pendingFilters: Filters;
  hasChanges: boolean;
  applyHasChanges: boolean;
  aplQuery: string;
  isAplCopied: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setPendingFilters: (filters: Filters) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setApplyHasChanges: (applyHasChanges: boolean) => void;
  setAplQuery: (query: string) => void;
  setIsAplCopied: (isAplCopied: boolean) => void;
  updatePendingFilter: (filterName: keyof Filters, value: any) => void;
  calculateHasChanges: (defaultFilters: Filters, currentPendingFilters: Filters) => boolean;
  calculateApplyHasChanges: (currentFilters: Filters, currentPendingFilters: Filters) => boolean;
}

export const useFilterPanelStore = create<FilterPanelState>((set, get) => ({
  isOpen: false,
  pendingFilters: getDefaultFilters(),
  hasChanges: false,
  applyHasChanges: false,
  aplQuery: '',
  isAplCopied: false,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),
  setPendingFilters: (pendingFilters) => set({ pendingFilters }),
  setHasChanges: (hasChanges) => set({ hasChanges }),
  setApplyHasChanges: (applyHasChanges) => set({ applyHasChanges }),
  setAplQuery: (query) => {
    if (get().aplQuery !== query) {
      set({ aplQuery: query });
    }
  },
  setIsAplCopied: (isAplCopied) => {
    if (get().isAplCopied !== isAplCopied) {
      set({ isAplCopied });
    }
  },
  updatePendingFilter: (filterName, value) => set((state) => ({
    pendingFilters: {
      ...state.pendingFilters,
      [filterName]: value,
    },
  })),
  calculateHasChanges: (defaultFilters, currentPendingFilters) => {
    return JSON.stringify(defaultFilters) !== JSON.stringify(currentPendingFilters);
  },
  calculateApplyHasChanges: (currentFilters, currentPendingFilters) => {
    return JSON.stringify(currentFilters) !== JSON.stringify(currentPendingFilters);
  },
}));
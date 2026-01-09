import { create } from 'zustand';
import { LogEntry } from '@/types/log';

interface LogState {
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  visibleTimeRange: { start: Date | null; end: Date | null };
  targetTimeRange: { start: Date | null; end: Date | null };
  isLiveMode: boolean;
  refreshInterval: number;
  currentPage: number;
  itemsPerPage: number;
  loadTime: number | null;
  setLogs: (logs: LogEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setVisibleTimeRange: (range: { start: Date | null; end: Date | null }) => void;
  setTargetTimeRange: (range: { start: Date | null; end: Date | null }) => void;
  setIsLiveMode: (isLive: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setLoadTime: (loadTime: number | null) => void;
  resetLogState: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  loading: true,
  error: null,
  visibleTimeRange: { start: null, end: null },
  targetTimeRange: { start: null, end: null },
  isLiveMode: false,
  refreshInterval: 5,
  currentPage: 1,
  itemsPerPage: 200,
  loadTime: null,

  setLogs: (logs) => set({ logs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setVisibleTimeRange: (range) => set({ visibleTimeRange: range }),
  setTargetTimeRange: (range) => set({ targetTimeRange: range }),
  setIsLiveMode: (isLive) => set({ isLiveMode: isLive }),
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLoadTime: (loadTime) => set({ loadTime }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
  resetLogState: () => set({
    logs: [],
    loading: false,
    error: null,
    visibleTimeRange: { start: null, end: null },
    targetTimeRange: { start: null, end: null },
    isLiveMode: false,
    refreshInterval: 5,
    currentPage: 1,
    itemsPerPage: 200,
    loadTime: null,
  }),
}));
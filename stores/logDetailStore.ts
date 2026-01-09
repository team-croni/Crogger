import { create } from 'zustand';
import { LogEntry } from '@/types/log';

interface LogDetailState {
  selectedLog: LogEntry | null;
  isOpen: boolean;
  openModal: (log: LogEntry) => void;
  closeModal: () => void;
}

export const useLogDetailStore = create<LogDetailState>((set) => ({
  selectedLog: null,
  isOpen: false,
  openModal: (log) => set({ selectedLog: log, isOpen: true }),
  closeModal: () => set({ selectedLog: null, isOpen: false }),
}));
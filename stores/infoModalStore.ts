import { create } from 'zustand';
import { LogEntry } from '@/types/log';

interface InfoModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useInfoModalStore = create<InfoModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
import { create } from 'zustand';
import { LogLevelData } from '@/types/log';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  dataPoint: LogLevelData | null;
  showTooltip: (x: number, y: number, dataPoint: LogLevelData) => void;
  hideTooltip: () => void;
  updatePosition: (x: number, y: number) => void;
  setDataPoint: (dataPoint: LogLevelData) => void;
}

export const useTooltipStore = create<TooltipState>((set) => ({
  visible: false,
  x: 0,
  y: 0,
  dataPoint: null,
  showTooltip: (x, y, dataPoint) => set({ visible: true, x, y, dataPoint }),
  hideTooltip: () => set({ visible: false }),
  updatePosition: (x, y) => set({ x, y }),
  setDataPoint: (dataPoint) => set({ dataPoint }),
}));
import { create } from 'zustand';
import { LogLevelData } from '@/types/log';

interface LogLevelChartState {
  chartData: LogLevelData[];
  chartWidth: number;
  labelFrequency: number;
  setChartData: (data: LogLevelData[]) => void;
  setChartWidth: (width: number) => void;
  setLabelFrequency: (frequency: number) => void;
  reset: () => void;
}

export const useLogLevelChartStore = create<LogLevelChartState>((set) => ({
  chartData: [],
  chartWidth: 0,
  labelFrequency: 1,
  setChartData: (data) => set({ chartData: data }),
  setChartWidth: (width) => set({ chartWidth: width }),
  setLabelFrequency: (frequency) => set({ labelFrequency: frequency }),
  reset: () => set({ chartData: [], chartWidth: 0, labelFrequency: 1 }),
}));
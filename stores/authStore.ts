import { create } from 'zustand';

interface AuthState {
  token: string;
  datasets: string[];
  selectedDataset: string;
  isDatasetListLoading: boolean;
  remember: boolean;
  isLoading: boolean;
  error: string | null;
  showToken: boolean;
  step: 'token' | 'datasets';
  tokenHistory: string[];
  autoSubmitToken: string | null;
  setToken: (token: string) => void;
  setDatasets: (datasets: string[]) => void;
  setSelectedDataset: (dataset: string) => void;
  setIsDatasetListLoading: (loading: boolean) => void;
  setRemember: (remember: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowToken: (show: boolean) => void;
  setStep: (step: 'token' | 'datasets') => void;
  setTokenHistory: (history: string[]) => void;
  setAutoSubmitToken: (token: string | null) => void;
  addTokenToHistory: (token: string) => void;
  removeTokenFromHistory: (token: string) => void;
  reset: () => void;
  setAuthInfo: (token: string, dataset: string) => void;
  clearAuthInfo: () => void;
  toggleRemember: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: '',
  datasets: [],
  selectedDataset: '',
  isDatasetListLoading: false,
  remember: false,
  isLoading: false,
  error: null,
  showToken: false,
  step: 'token',
  tokenHistory: [],
  autoSubmitToken: null,
  setToken: (token) => set({ token }),
  setDatasets: (datasets) => set({ datasets }),
  setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
  setIsDatasetListLoading: (loading) => set({ isDatasetListLoading: loading }),
  setRemember: (remember) => set({ remember }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setShowToken: (show) => set({ showToken: show }),
  setStep: (step) => set({ step }),
  setTokenHistory: (history) => set({ tokenHistory: history }),
  setAutoSubmitToken: (token) => set({ autoSubmitToken: token }),
  addTokenToHistory: (token) => {
    const currentHistory = get().tokenHistory;
    // 중복 토큰 제거
    const filteredHistory = currentHistory.filter(t => t !== token);
    // 최대 5개의 토큰만 유지
    const newHistory = [token, ...filteredHistory].slice(0, 5);
    set({ tokenHistory: newHistory });
  },
  removeTokenFromHistory: (token) => {
    const currentHistory = get().tokenHistory;
    const newHistory = currentHistory.filter(t => t !== token);
    set({ tokenHistory: newHistory });
  },
  toggleRemember: () => set((state) => ({ remember: !state.remember })),
  setAuthInfo: (token, dataset) => set({ token, selectedDataset: dataset }),
  clearAuthInfo: () => set({ token: '', selectedDataset: '' }),
  reset: () => set({
    token: '',
    datasets: [],
    selectedDataset: '',
    isDatasetListLoading: false,
    remember: false,
    isLoading: false,
    error: null,
    showToken: false,
    step: 'token',
    tokenHistory: [],
    autoSubmitToken: null,
  }),
}));
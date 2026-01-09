import { useState } from 'react';
import { useFilterStore } from '@stores/filterStore';
import { useLogStore } from '@stores/logStore';
import { Filters } from '@/types/log';
import { useLogData } from '@hooks/useLogData';

// 필터 관련 상태 및 로직을 관리하는 훅
export const useFilters = () => {
  const { filters, searchValue, setSearchValue, setFilters, resetFilters, initializeFilters } = useFilterStore();
  const { setCurrentPage } = useLogStore();
  const { fetchLogs } = useLogData();
  const [aplQuery, setAplQuery] = useState<string>('');

  const updateAplQuery = (query: string) => {
    setAplQuery(query);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // 필터가 변경되면 페이지를 1로 리셋
  };

  const handleSearch = (value?: string) => {
    handleFilterChange({ ...filters, search: value || searchValue });
  };

  const initialize = (initialFilters: Filters) => {
    initializeFilters(initialFilters);
  };

  const handleRefresh = async () => {
    await fetchLogs();
    // 로그 목록 스크롤을 최상단으로 이동
    const logListContainer = document.querySelector('.log-list-container') as HTMLElement;
    if (logListContainer) {
      logListContainer.scrollTop = 0;
    }
  };

  return {
    filters,
    searchValue,
    setSearchValue,
    handleFilterChange,
    handleSearch,
    resetFilters,
    initialize,
    aplQuery,
    updateAplQuery,
    handleRefresh,
  };
};


import { useEffect, useRef } from 'react';
import { useFilterStore } from '@stores/filterStore';
import { useLogStore } from '@stores/logStore';
import { useFilterPanelStore } from '@stores/filterPanelStore';
import { Filters } from '@/types/log';
import { getDefaultFilters, formatDateToLocal } from '@utils/filters';

// 필터 패널 관련 상태 및 로직을 관리하는 훅
export const useFilterPanel = () => {
  const { filters, setFilters } = useFilterStore();
  const { setCurrentPage } = useLogStore();
  const {
    pendingFilters,
    hasChanges,
    applyHasChanges,
    aplQuery,
    isAplCopied,
    isOpen,
    setPendingFilters,
    setHasChanges,
    setApplyHasChanges,
    setAplQuery,
    setIsAplCopied,
    updatePendingFilter,
    calculateHasChanges,
    calculateApplyHasChanges,
    togglePanel
  } = useFilterPanelStore();

  const defaultFilters: Filters = getDefaultFilters();

  // 초기 마운트 여부를 추적하는 ref
  const isInitialMount = useRef(true);

  useEffect(() => {
    setPendingFilters(filters);
  }, [filters, setPendingFilters]);

  useEffect(() => {
    // 초기 마운트 시에는 상태 계산만 수행하고 업데이트하지 않음
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Compare pending filters with default filters to determine if reset changes exist
    const newHasChanges = calculateHasChanges(defaultFilters, pendingFilters);
    if (newHasChanges !== hasChanges) {
      setHasChanges(newHasChanges);
    }

    // Compare pending filters with current filters to determine if apply changes exist
    const newApplyHasChanges = calculateApplyHasChanges(filters, pendingFilters);
    if (newApplyHasChanges !== applyHasChanges) {
      setApplyHasChanges(newApplyHasChanges);
    }
  }, [pendingFilters, defaultFilters, filters, hasChanges, applyHasChanges, setHasChanges, setApplyHasChanges, calculateHasChanges, calculateApplyHasChanges]);

  const updateAplQuery = (query: string) => {
    if (aplQuery !== query) {
      setAplQuery(query);
    }
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setCurrentPage(1); // 필터가 적용되면 페이지를 1로 리셋
  };

  const discardChanges = () => {
    setPendingFilters(filters);
  };

  const copyAplQuery = () => {
    if (aplQuery) {
      navigator.clipboard.writeText(aplQuery);
      setIsAplCopied(true);
      setTimeout(() => {
        setIsAplCopied(false);
      }, 2000);
    }
  };

  const handlePendingChange = (field: string, value: string | { from: string | null; to: string | null }) => {
    updatePendingFilter(field as keyof typeof pendingFilters, value);
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentValues = pendingFilters[field as keyof typeof pendingFilters] as string[] || [];
    let newValues: string[];

    if (checked) {
      // 체크된 경우 배열에 값 추가
      newValues = [...currentValues, value];
    } else {
      // 체크 해제된 경우 배열에서 값 제거
      newValues = currentValues.filter(v => v !== value);
    }

    updatePendingFilter(field as keyof typeof pendingFilters, newValues);
  };

  // 적용 버튼 핸들러
  const handleApplyFilters = () => {
    applyFilters();
  };

  // 날짜 범위 필터 변경 핸들러
  const handleDateRangeFilterChange = (rangeValue: string) => {
    // 현재 날짜를 사용자 로컬 시간대로 생성
    const now = new Date();
    let fromDate: Date;
    let toDate: Date;

    switch (rangeValue) {
      case 'today':
        // 오늘 날짜의 시작과 끝 설정
        fromDate = new Date(now);
        fromDate.setHours(0, 0, 0, 0);
        toDate = new Date(fromDate);
        toDate.setHours(23, 59, 59, 999);
        break;
      case '3days':
        // 오늘 포함 3일 전부터 오늘까지
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 2); // 3일 전부터 오늘까지 (3일 범위)
        fromDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        // 오늘 포함 7일 전부터 오늘까지
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 6); // 7일 전부터 오늘까지 (7일 범위)
        fromDate.setHours(0, 0, 0, 0);
        break;
      case '30days':
        // 오늘 포함 30일 전부터 오늘까지
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 29); // 30일 전부터 오늘까지 (30일 범위)
        fromDate.setHours(0, 0, 0, 0);
        break;
      default:
        // 기본값: 오늘 포함 7일 전부터 오늘까지
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 6);
        fromDate.setHours(0, 0, 0, 0);
    }

    const newDateRange = {
      from: formatDateToLocal(fromDate),
      to: formatDateToLocal(toDate)
    };

    updatePendingFilter('dateRange', newDateRange);
  };

  const handleReset = () => {
    updatePendingFilter('level', defaultFilters.level);
    updatePendingFilter('category', defaultFilters.category);
    updatePendingFilter('search', defaultFilters.search);
    updatePendingFilter('method', defaultFilters.method);
    updatePendingFilter('statusCode', defaultFilters.statusCode);
    updatePendingFilter('host', defaultFilters.host);
    updatePendingFilter('path', defaultFilters.path);
    updatePendingFilter('dateRange', defaultFilters.dateRange);
  };

  return {
    currentFilters: filters,
    pendingFilters,
    hasChanges,
    applyHasChanges,
    defaultFilters,
    updatePendingFilter,
    applyFilters,
    discardChanges,
    aplQuery,
    updateAplQuery,
    isAplCopied,
    copyAplQuery,
    handlePendingChange,
    handleCheckboxChange,
    handleApplyFilters,
    handleDateRangeFilterChange,
    handleReset,
    // 패널 상태 관련
    isFilterPanelOpen: isOpen,
    toggleFilterPanel: togglePanel,
  };
};
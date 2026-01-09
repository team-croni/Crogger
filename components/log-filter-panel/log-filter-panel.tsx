'use client';

import { useEffect } from 'react';
import { useFilterPanelStore } from '@stores/filterPanelStore';
import { useLogData } from '@hooks/useLogData';
import { getDefaultFilters } from '@utils/filters';
import { useFilterPanel } from '@hooks/useFilterPanel';
import { AplQueryDisplay, CategoryFilter, DateRangeFilter, FilterPanelHeader, HostFilter, LevelFilter, MethodFilter, PathFilter, StatusCodeFilter } from '@components/log-filter-panel';

const LogFilterPanel = () => {
  const { aplQuery: logAplQuery } = useLogData();
  const { isOpen } = useFilterPanelStore();
  const {
    currentFilters,
    updatePendingFilter,
    updateAplQuery,
  } = useFilterPanel();

  useEffect(() => {
    if (logAplQuery) {
      updateAplQuery(logAplQuery);
    }
  }, [logAplQuery, updateAplQuery]);

  useEffect(() => {
    if (!currentFilters.dateRange.from || !currentFilters.dateRange.to) {
      const defaultDateRange = {
        from: getDefaultFilters().dateRange.from,
        to: getDefaultFilters().dateRange.to
      };

      if (!currentFilters.dateRange.from || !currentFilters.dateRange.to ||
        currentFilters.dateRange.from !== defaultDateRange.from ||
        currentFilters.dateRange.to !== defaultDateRange.to) {
        updatePendingFilter('dateRange', defaultDateRange);
      }
    }
  }, [currentFilters, getDefaultFilters]);

  return (
    <div
      className={`w-86 h-full bg-sidebar border-r-2 border-sidebar-border/70 overflow-x-hidden slide-right ${isOpen ? 'visible' : 'hidden'
        }`}
      style={{ animationDuration: '100ms' }}
    >
      <FilterPanelHeader />
      <div className="w-full sidebar h-[calc(100%-3.4375rem)] overflow-y-auto overflow-x-hidden">
        <div className="p-4 space-y-8">
          <DateRangeFilter />
          <LevelFilter />
          <CategoryFilter />
          <MethodFilter />
          <StatusCodeFilter />
          <HostFilter />
          <PathFilter />
          <AplQueryDisplay />
        </div>
      </div>
    </div>
  );
}

export default LogFilterPanel;
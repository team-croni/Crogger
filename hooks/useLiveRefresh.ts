import { useEffect, useRef } from 'react';
import { useLogStore } from '@stores/logStore';
import { useLogData } from './useLogData';

// 실시간 새로고침 기능을 관리하는 훅
export const useLiveRefresh = () => {
  const { isLiveMode, refreshInterval } = useLogStore();
  const { fetchLogs } = useLogData();
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLiveMode) {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }

      refreshTimer.current = setInterval(() => {
        fetchLogs();
      }, refreshInterval * 1000);
    } else {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
        refreshTimer.current = null;
      }
    }

    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [isLiveMode, refreshInterval, fetchLogs]);

  return {
    refreshTimer
  };
};
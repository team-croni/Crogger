import { useEffect, useRef } from 'react';
import { LogEntry } from '@/types/log';
import { useLogStore } from '@stores/logStore';

interface UseScrollHandlerProps {
  scrollElementRef: React.RefObject<HTMLDivElement>;
  logs: LogEntry[];
  itemsPerPage: number;
  currentPage: number;
}

// 스크롤 이벤트를 처리하는 훅
export const useScrollHandler = ({
  scrollElementRef,
  logs,
  itemsPerPage,
  currentPage
}: UseScrollHandlerProps) => {
  const visibleItemsRef = useRef<{ startTime: Date | null; endTime: Date | null }>({
    startTime: null,
    endTime: null
  });

  useEffect(() => {
    const container = scrollElementRef.current;
    if (!container) return;

    // 시간 범위 계산을 메모이제이션하기 위한 변수들
    let lastStartIndex = -1;
    let lastEndIndex = -1;
    let lastStartTime: Date | null = null;
    let lastEndTime: Date | null = null;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;

      // 현재 페이지에 해당하는 로그 계산
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentLogs = logs.slice(startIndex, endIndex);

      // 로그가 없으면 처리 중단
      if (currentLogs.length === 0) {
        if (visibleItemsRef.current.startTime !== null || visibleItemsRef.current.endTime !== null) {
          visibleItemsRef.current = { startTime: null, endTime: null };
          useLogStore.getState().setVisibleTimeRange({ start: null, end: null });
        }
        return;
      }

      // 시작 및 종료 인덱스 계산
      const startVirtualIndex = Math.max(0, Math.floor(scrollTop / 36));
      const endVirtualIndex = Math.min(currentLogs.length - 1, Math.ceil((scrollTop + clientHeight) / 36));

      // 실제 로그 인덱스로 변환
      const startIndexAbsolute = startIndex + startVirtualIndex;
      const endIndexAbsolute = startIndex + endVirtualIndex;

      // 이전 계산 결과 재사용
      if (lastStartIndex === startIndexAbsolute && lastEndIndex === endIndexAbsolute) {
        // 인덱스가 동일하면 시간 계산도 동일하므로 이전 값을 재사용
        if (visibleItemsRef.current.startTime?.getTime() !== lastStartTime?.getTime() ||
          visibleItemsRef.current.endTime?.getTime() !== lastEndTime?.getTime()) {
          visibleItemsRef.current = { startTime: lastStartTime, endTime: lastEndTime };
          useLogStore.getState().setVisibleTimeRange({ start: lastStartTime, end: lastEndTime });
        }
        return;
      }

      // 새로운 인덱스이므로 시간 계산 수행
      let startTime: Date | null = null;
      let endTime: Date | null = null;

      const startLog = logs[startIndexAbsolute];
      const endLog = logs[endIndexAbsolute];

      if (startLog) {
        const startTimestamp = startLog._time || startLog.time;
        if (startTimestamp) {
          startTime = new Date(startTimestamp);
        }
      }

      if (endLog) {
        const endTimestamp = endLog._time || endLog.time;
        if (endTimestamp) {
          endTime = new Date(endTimestamp);
        }
      }

      // startTime이 endTime보다 큰 경우 교환
      if (startTime && endTime && startTime > endTime) {
        [startTime, endTime] = [endTime, startTime];
      }

      // 계산 결과 저장
      lastStartIndex = startIndexAbsolute;
      lastEndIndex = endIndexAbsolute;
      lastStartTime = startTime;
      lastEndTime = endTime;

      // 이전 값과 비교하여 변경된 경우에만 콜백 호출
      if (visibleItemsRef.current.startTime?.getTime() !== startTime?.getTime() ||
        visibleItemsRef.current.endTime?.getTime() !== endTime?.getTime()) {
        visibleItemsRef.current = { startTime, endTime };
        useLogStore.getState().setVisibleTimeRange({ start: startTime, end: endTime });
      }
    };

    container.addEventListener('scroll', handleScroll);
    // 초기 호출
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [logs, itemsPerPage, currentPage]);
};
import { useEffect, RefObject } from 'react';
import { LogEntry } from '@/types/log';
import { useLogStore } from '@stores/logStore';
import { useVirtualScroll } from './useVirtualScroll';

interface UseTargetTimeRangeScrollProps {
  logs: LogEntry[];
  rowVirtualizer: ReturnType<typeof useVirtualScroll>;
  startIndex: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isManualPageChange: boolean;
  hasAutoScrolled: boolean;
  setHasAutoScrolled: (scrolled: boolean) => void;
  scrollContainerRef: RefObject<HTMLDivElement>;
}

// 목표 시간 범위에 해당하는 로그로 스크롤하는 훅
export const useTargetTimeRangeScroll = ({
  logs,
  rowVirtualizer,
  startIndex,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  isManualPageChange,
  hasAutoScrolled,
  setHasAutoScrolled,
  scrollContainerRef
}: UseTargetTimeRangeScrollProps) => {
  const { targetTimeRange } = useLogStore();

  useEffect(() => {
    // 조건이 충족되지 않으면 리턴
    if (!targetTimeRange || !targetTimeRange.start || !targetTimeRange.end || !scrollContainerRef.current || isManualPageChange || hasAutoScrolled) return;

    // 목표 시간 범위 내에 있는 첫 번째 로그 인덱스 찾기
    let targetLogIndex = -1;
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      const logTime = log._time || log.time;
      if (!logTime) continue;

      const logDate = new Date(logTime);

      // 로그 시간이 목표 시간 범위 내에 있는지 확인
      if (logDate >= targetTimeRange.start! && logDate <= targetTimeRange.end!) {
        targetLogIndex = i;
        break;
      }

      // 목표 시간 범위 시작 이후의 첫 번째 로그 찾기
      if (logDate >= targetTimeRange.start! && targetLogIndex === -1) {
        targetLogIndex = i;
      }
    }

    if (targetLogIndex >= 0) {
      // 전체 로그에서 인덱스를 찾았으므로, 현재 페이지에서의 상대 인덱스를 계산
      const targetPageIndex = Math.floor(targetLogIndex / itemsPerPage) + 1; // 페이지는 1부터 시작

      if (targetPageIndex !== currentPage) {
        // 해당 로그가 현재 페이지에 없는 경우, 해당 페이지로 이동
        setCurrentPage(targetPageIndex);

        // 페이지 변경 후 다시 스크롤을 시도하기 위해 setTimeout 사용
        setTimeout(() => {
          const newStartIndex = (targetPageIndex - 1) * itemsPerPage;
          const newRelativeIndex = targetLogIndex - newStartIndex;
          rowVirtualizer.scrollToIndex(newRelativeIndex, { align: 'start' });
        }, 100);
      } else {
        // 해당 로그가 현재 페이지에 포함되어 있는 경우에만 스크롤
        const relativeIndex = targetLogIndex - (startIndex - 1);
        setTimeout(() => {
          rowVirtualizer.scrollToIndex(relativeIndex, { align: 'start' });
        }, 50);
      }

      // 자동 스크롤 실행 여부 업데이트
      setHasAutoScrolled(true);
    } else if (logs.length > 0) {
      // 로그가 있지만 해당 시간대의 로그를 찾지 못한 경우, 가장 가까운 로그로 이동
      const closestLogIndex = logs.findIndex(log => {
        const logTime = log._time || log.time;
        if (!logTime) return false;
        const logDate = new Date(logTime);
        return logDate >= targetTimeRange.start!;
      });

      // 만약 아직도 찾지 못했다면 마지막 로그로 이동
      const finalIndex = closestLogIndex >= 0 ? closestLogIndex : logs.length - 1;

      // 전체 로그에서 인덱스를 찾았으므로, 현재 페이지에서의 상대 인덱스를 계산
      const targetPageIndex = Math.floor(finalIndex / itemsPerPage) + 1; // 페이지는 1부터 시작

      if (targetPageIndex !== currentPage) {
        // 해당 로그가 현재 페이지에 없는 경우, 해당 페이지로 이동
        setCurrentPage(targetPageIndex);

        // 페이지 변경 후 다시 스크롤을 시도하기 위해 setTimeout 사용
        setTimeout(() => {
          const newStartIndex = (targetPageIndex - 1) * itemsPerPage;
          const newRelativeIndex = finalIndex - newStartIndex;
          rowVirtualizer.scrollToIndex(newRelativeIndex, { align: 'start' });
        }, 100);
      } else {
        // 해당 로그가 현재 페이지에 포함되어 있는 경우에만 스크롤
        const relativeIndex = finalIndex - (startIndex - 1);
        setTimeout(() => {
          rowVirtualizer.scrollToIndex(relativeIndex, { align: 'start' });
        }, 50);
      }

      // 자동 스크롤 실행 여부 업데이트
      setHasAutoScrolled(true);
    }
  }, [targetTimeRange, logs, rowVirtualizer, startIndex, itemsPerPage, currentPage, setCurrentPage, isManualPageChange, hasAutoScrolled, setHasAutoScrolled, scrollContainerRef]);

  return {};
};
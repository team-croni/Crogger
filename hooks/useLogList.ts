import { useRef, useEffect } from 'react';
import { LogEntry } from '@/types/log';
import { useLogStore } from '@stores/logStore';
import { useFilterStore } from '@stores/filterStore';
import { useLogDetailStore } from '@stores/logDetailStore';
import { usePageChangeHandler } from '@hooks/usePageChangeHandler';
import { usePagination } from '@hooks/usePagination';
import { useScrollHandler } from '@hooks/useScrollHandler';
import { useTargetTimeRangeScroll } from '@hooks/useTargetTimeRangeScroll';
import { useVirtualScroll } from '@hooks/useVirtualScroll';
import { getDummyLogs } from '@utils/dummyLogData';

// 로그 목록을 관리하는 훅
export const useLogList = () => {
  // 더미 모드일 경우 더미 데이터 사용 (pnpm dev:dummy 명령어 실행 시)
  const isDummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE === 'true';
  const { logs, loading, setCurrentPage, setLogs } = useLogStore();
  const { filters } = useFilterStore();

  // 더미 모드일 경우 더미 데이터 설정 - 렌더링 후에 실행되도록 useEffect 사용
  useEffect(() => {
    if (isDummyMode && logs.length === 0) {
      const dummyLogs = getDummyLogs(); // 기본값(1024개) 사용
      setLogs(dummyLogs);
    }
  }, [isDummyMode, logs.length, setLogs]);

  const { openModal } = useLogDetailStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const { currentPage, itemsPerPage, startIndex, endIndex, hasNextPage, hasPrevPage, goToNextPage, goToPrevPage } = usePagination();
  // startIndex is 1-indexed, so subtract 1 to get the array index
  const currentLogs = logs.slice(startIndex - 1, endIndex);

  // react-virtual을 사용한 가상 스크롤러 설정
  const rowVirtualizer = useVirtualScroll({
    count: currentLogs.length,
    scrollElementRef: scrollContentRef,
    itemSize: 36, // LogItem의 높이를 36px로 추정
    overscan: 10, // viewport 외부에 추가로 렌더링할 항목 수
  });

  const handleLogClick = (log: LogEntry) => {
    openModal(log);
  };

  const closeModal = () => {
    // 스토어를 통해 모달을 닫는 함수를 사용하므로 여기서는 따로 처리하지 않음
  };

  // 스크롤 이벤트 핸들러
  useScrollHandler({
    scrollElementRef: scrollContainerRef,
    logs,
    itemsPerPage,
    currentPage,
  });

  // 페이지 변경 핸들러
  const { isManualPageChange, hasAutoScrolled, setHasAutoScrolled } = usePageChangeHandler({
    currentPage,
  });

  // 타겟 시간 범위 스크롤
  useTargetTimeRangeScroll({
    logs,
    rowVirtualizer,
    startIndex,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    isManualPageChange,
    hasAutoScrolled,
    setHasAutoScrolled,
    scrollContainerRef,
  });

  return {
    // 상태
    logs,
    currentLogs,
    loading,
    isManualPageChange,
    hasAutoScrolled,
    filters,
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,

    // ref
    scrollContainerRef,
    scrollContentRef,

    // 가상 스크롤
    rowVirtualizer,

    // 함수
    handleLogClick,
    closeModal,
    goToNextPage,
    goToPrevPage,
  };
};
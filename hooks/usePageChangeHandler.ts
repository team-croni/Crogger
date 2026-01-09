import { useEffect, useState } from 'react';
import { useLogStore } from '@stores/logStore';

interface UsePageChangeHandlerProps {
  currentPage: number;
}

// 페이지 변경을 처리하는 훅
export const usePageChangeHandler = ({ currentPage }: UsePageChangeHandlerProps) => {
  const [isManualPageChange, setIsManualPageChange] = useState(false);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  useEffect(() => {
    setIsManualPageChange(true);
    setHasAutoScrolled(false); // 수동 페이지 변경 시 자동 스크롤 실행 여부 초기화

    // 수동 페이지 변경 시 targetTimeRange 초기화
    useLogStore.getState().setTargetTimeRange({ start: null, end: null });

    // 일정 시간 후에 수동 페이지 변경 상태를 해제하여 자동 스크롤이 다시 가능하도록 함
    const timer = setTimeout(() => {
      setIsManualPageChange(false);
    }, 1000); // 1초 후에 자동 스크롤 기능 다시 활성화

    return () => {
      clearTimeout(timer);
    };
  }, [currentPage]);

  return { isManualPageChange, hasAutoScrolled, setHasAutoScrolled };
};
import { useLogStore } from "@stores/logStore";

interface PaginationResult {
  logs: any[];
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setCurrentPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
  scrollToTop: () => void;
}

// 페이지네이션 기능을 관리하는 훅
export const usePagination = (): PaginationResult => {
  const { logs, itemsPerPage, currentPage, setCurrentPage: setStoreCurrentPage } = useLogStore();

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, logs.length);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setStoreCurrentPage(page);
      scrollToTop();
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  };

  const scrollToTop = () => {
    // 페이지 변경 시 로그 리스트 스크롤을 최상단으로 이동
    const logListContainer = document.querySelector('.log-list-container') as HTMLElement;
    if (logListContainer) {
      logListContainer.scrollTop = 0;
    }
  };

  return {
    logs,
    itemsPerPage,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    setCurrentPage: setStoreCurrentPage,
    goToNextPage,
    goToPrevPage,
    goToPage,
    scrollToTop
  };
};
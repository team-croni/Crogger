import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLogList } from '@hooks/useLogList';

const LogPaginationControls = () => {
  const { loading, currentLogs, hasNextPage, hasPrevPage, goToNextPage, goToPrevPage } = useLogList();

  if (loading || !currentLogs || currentLogs.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center py-6 mt-6 border-t">
      {hasNextPage ? (
        <div className='flex items-center gap-4 py-2'>
          <button
            onClick={goToPrevPage}
            className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted-foreground/7 dark:hover:bg-foreground/2 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
            disabled={!hasPrevPage}
          >
            <ChevronLeft className='w-4 h-4 mr-1.5 -ml-1' strokeWidth={1.5} />
            이전 페이지
          </button>
          <button
            onClick={goToNextPage}
            className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted-foreground/7 dark:hover:bg-foreground/2 rounded-lg"
          >
            다음 페이지
            <ChevronRight className='w-4 h-4 ml-1.5 -mr-1' strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div className="px-4 py-4.5 text-sm text-muted-foreground/50">
          마지막 페이지입니다.
        </div>
      )}
    </div>
  );
}

export default LogPaginationControls;
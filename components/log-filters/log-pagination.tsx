'use client';

import { usePagination } from "@hooks/usePagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LogPagination = () => {
  const {
    logs,
    startIndex,
    endIndex,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
  } = usePagination();

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      {logs && logs.length > 0 &&
        <div className="text-sm text-muted-foreground/70 whitespace-nowrap">
          {startIndex} - {endIndex}
        </div>
      }
      <div className="flex items-center bg-input border border-input-border rounded-lg p-1">
        <button
          type="button"
          className="flex items-center bg-input px-1.5 py-1.5 text-foreground text-sm rounded-md hover:bg-muted-foreground/8 dark:hover:bg-muted-foreground/6 disabled:pointer-events-none disabled:opacity-20"
          onClick={() => goToPrevPage()}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="w-4.5 h-4.5 -m-px" strokeWidth={1.5} />
        </button>

        <div className={`min-w-14 px-1 text-sm text-center text-foreground`}>
          {currentPage}<span className="text-xs text-muted-foreground/70 ml-1.5">of {logs && logs.length > 0 ? totalPages : 1}</span>
        </div>

        <button
          type="button"
          className="flex items-center bg-input px-1.5 py-1.5 text-foreground text-sm rounded-md hover:bg-muted-foreground/8 dark:hover:bg-muted-foreground/6 disabled:pointer-events-none disabled:opacity-20"
          onClick={() => goToNextPage()}
          disabled={!hasNextPage}
        >
          <ChevronRight className="w-4.5 h-4.5 -m-px" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default LogPagination;
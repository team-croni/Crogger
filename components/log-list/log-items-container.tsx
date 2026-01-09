import { LogEmptyMessage, LogItem, LogPaginationControls } from "@components/log-list";
import { useLogList } from "@hooks/useLogList";
import { useLogDetailStore } from "@stores/logDetailStore";
import { Ring } from "ldrs/react";
import { memo } from "react";

const MemoizedLogItem = memo(LogItem, (prevProps, nextProps) => {
  return (
    prevProps.log === nextProps.log &&
    prevProps.index === nextProps.index &&
    prevProps.searchTerm === nextProps.searchTerm
  );
});

const LogItemsContainer = () => {
  const { currentLogs, loading, filters, rowVirtualizer, scrollContentRef } = useLogList();
  const { openModal } = useLogDetailStore();

  const handleLogClick = (log: any) => {
    openModal(log);
  };

  return (
    <div ref={scrollContentRef} className="min-w-352 flex-1 flex flex-col relative">
      {loading ? (
        <div className='h-full flex items-center justify-center'>
          <Ring
            size="28"
            speed="2"
            stroke={3}
            color="var(--color-foreground)"
            bgOpacity={0.2}
          />
        </div>
      ) : (!currentLogs || currentLogs.length === 0) ? (
        <LogEmptyMessage />
      ) : (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const log = currentLogs[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <MemoizedLogItem
                  log={log}
                  index={virtualItem.index}
                  onClick={() => handleLogClick(log)}
                  searchTerm={filters.search}
                />
              </div>
            );
          })}
        </div>
      )}
      <LogPaginationControls />
    </div>
  );
};

export default LogItemsContainer;
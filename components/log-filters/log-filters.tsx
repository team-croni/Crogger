import { DownloadButton, FilterPanelToggle, LiveModeControl, LogPagination, RefreshButton, ResetButton, SearchFilter } from "@components/log-filters";

const LogFilters = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center">
        <div className="w-full flex justify-between gap-3 py-0.5 -mb-0.5 overflow-x-auto overflow-y-visible scrollbar-invisible">
          {/* 왼쪽 끝 버튼 그룹 */}
          <div className='flex gap-3'>
            <FilterPanelToggle />
            <SearchFilter />
            <ResetButton />
          </div>

          {/* 오른쪽 끝 버튼 그룹 */}
          <div className="ml-auto pl-5 flex gap-3">
            <LogPagination />
            <div className="border-l border-input-border mx-1 my-1" />
            <LiveModeControl />
            <div className="border-l border-input-border mx-1 my-1" />
            <RefreshButton />
            <DownloadButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogFilters;
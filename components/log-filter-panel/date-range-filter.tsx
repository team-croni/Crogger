import { DATE_RANGE_FILTERS } from '@constants/logFilterPanel';
import { useFilterPanel } from '@hooks/useFilterPanel';

const DateRangeFilter = () => {
  const { pendingFilters, handlePendingChange, handleDateRangeFilterChange } = useFilterPanel();

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs text-foreground/70 mb-1">시작일</label>
          <input
            type="date"
            value={pendingFilters.dateRange.from || ''}
            onChange={(e) => handlePendingChange('dateRange', {
              ...pendingFilters.dateRange,
              from: e.target.value
            })}
            className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-foreground text-sm hover:border-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-foreground/70 mb-1">종료일</label>
          <input
            type="date"
            value={pendingFilters.dateRange.to || ''}
            onChange={(e) => handlePendingChange('dateRange', {
              ...pendingFilters.dateRange,
              to: e.target.value
            })}
            className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-foreground text-sm hover:border-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {DATE_RANGE_FILTERS.map((range, index) => {
          let isRangeMatch = false;
          if (pendingFilters.dateRange.from && pendingFilters.dateRange.to) {
            const fromDate = new Date(pendingFilters.dateRange.from);
            const toDate = new Date(pendingFilters.dateRange.to);
            const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            switch (range.value) {
              case 'today':
                isRangeMatch = (diffDays === 0 && fromDate.toDateString() === toDate.toDateString());
                break;
              case '3days':
                isRangeMatch = (diffDays === 2 && toDate.getDate() === new Date().getDate());
                break;
              case '7days':
                isRangeMatch = (diffDays === 6 && toDate.getDate() === new Date().getDate());
                break;
              case '30days':
                isRangeMatch = (diffDays === 29 && toDate.getDate() === new Date().getDate());
                break;
              default:
                isRangeMatch = false;
            }
          }

          return (
            <button
              key={index}
              type="button"
              className={`flex items-center justify-center py-2 text-xs rounded-lg border ${isRangeMatch
                ? 'bg-input text-foreground border-primary'
                : 'bg-input border-input-border hover:border-muted-foreground/50'
                }`}
              onClick={() => handleDateRangeFilterChange(range.value)}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateRangeFilter;
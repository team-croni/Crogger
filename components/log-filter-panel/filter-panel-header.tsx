import { useFilterPanel } from '@hooks/useFilterPanel';
import { Check } from 'lucide-react';

const FilterPanelHeader = () => {
  const { hasChanges, applyHasChanges, handleApplyFilters, handleReset } = useFilterPanel();

  return (
    <div className="w-86 flex items-center justify-between px-4 p-3 bg-sidebar border-b border-sidebar-border">
      <div className="flex items-center">
        <h2 className="text-base font-semibold text-foreground whitespace-nowrap">Filters</h2>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className={`flex items-center text-sm ${hasChanges
            ? 'text-foreground hover:text-foreground/70 dark:hover:text-foreground/80'
            : 'text-foreground/50 cursor-default'
            }`}
        >
          초기화
        </button>
        <button
          onClick={handleApplyFilters}
          disabled={!applyHasChanges}
          className={`flex items-center text-sm px-2 py-1 border rounded ${applyHasChanges
            ? 'text-foreground bg-muted-foreground/0 hover:bg-muted-foreground/5 dark:bg-muted-foreground/10 border-muted-foreground/20 dark:hover:bg-muted-foreground/15'
            : 'text-foreground/50 cursor-default'
            }`}
        >
          <Check className="w-3 h-3 mr-1" />
          적용
        </button>
      </div>
    </div>
  );
};

export default FilterPanelHeader;
import { Filter } from 'lucide-react';
import { useFilterPanel } from '@hooks/useFilterPanel';

const FilterPanelToggle = () => {
  const { toggleFilterPanel, isFilterPanelOpen } = useFilterPanel();

  return (
    <button
      type="button"
      className={`flex items-center bg-input px-2.5 py-2.5 border text-foreground text-sm rounded-lg ${isFilterPanelOpen ? 'border-primary' : 'border-input-border hover:border-muted-foreground/50'}`}
      onClick={toggleFilterPanel}
    >
      <Filter className="w-4 h-4" />
    </button>
  );
};

export default FilterPanelToggle;
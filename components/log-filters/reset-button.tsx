import { Undo2 } from 'lucide-react';
import { useFilters } from '@hooks/useFilters';

const ResetButton = () => {
  const { resetFilters } = useFilters();

  const handleReset = () => {
    resetFilters();
  };

  return (
    <button
      type="button"
      className="flex items-center bg-input px-3 py-2 border border-input-border hover:border-muted-foreground/50 text-foreground text-sm rounded-lg whitespace-nowrap"
      onClick={handleReset}
    >
      <Undo2 className="w-4 h-4 mr-2" />
      초기화
    </button>
  );
};

export default ResetButton;
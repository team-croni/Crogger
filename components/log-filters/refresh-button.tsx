import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useFilters } from '@hooks/useFilters';
import { Ring } from 'ldrs/react';

const RefreshButton = () => {
  const { handleRefresh } = useFilters();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await handleRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      className="flex items-center bg-input px-2.5 py-2.5 border border-input-border hover:border-muted-foreground/50 text-foreground text-sm rounded-lg disabled:pointer-events-none disabled:opacity-70"
      onClick={handleRefreshClick}
      disabled={isRefreshing}
    >
      {isRefreshing ?
        <div className='w-4 h-4 flex items-center justify-center'>
          <Ring
            size="16"
            speed="2"
            stroke={2}
            color="var(--color-foreground)"
            bgOpacity={0.2}
          />
        </div>
        :
        <RefreshCw className="w-4 h-4 fade-in" />
      }
    </button>
  );
};

export default RefreshButton;
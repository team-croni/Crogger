import { SearchAlert, OctagonX } from 'lucide-react';
import { useFilterStore } from '@stores/filterStore';

const LogEmptyMessage = () => {
  const { filters } = useFilterStore();

  return (
    <div className="h-full flex items-center justify-center fade-in">
      <div className="flex flex-col items-center">
        {filters.search ?
          <>
            <SearchAlert className="w-10 h-10 mb-3 text-muted-foreground opacity-50" strokeWidth={1.5} />
            <p className='text-sm font-medium text-muted-foreground/70'>검색 결과가 없습니다.</p>
          </>
          :
          <>
            <OctagonX className="w-10 h-10 mb-3 text-muted-foreground opacity-50" strokeWidth={1.5} />
            <p className='text-sm font-medium text-muted-foreground/70'>표시할 로그가 없습니다.</p>
          </>
        }
      </div>
    </div>
  );
}

export default LogEmptyMessage;
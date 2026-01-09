import { useFilterPanel } from '@hooks/useFilterPanel';
import { Check, Copy } from 'lucide-react';

const AplQueryDisplay = () => {
  const { aplQuery, isAplCopied, copyAplQuery } = useFilterPanel();

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between pb-2">
        <label className="block text-sm font-medium text-muted-foreground">APL QUERY</label>
        <button
          onClick={copyAplQuery}
          className="p-1 text-muted-foreground hover:text-foreground rounded"
          title="APL 쿼리 복사"
        >
          {isAplCopied ? <Check className="w-3.5 h-3.5 text-green-500 slide-up" /> : <Copy className="w-3.5 h-3.5 fade-in" />}
        </button>
      </div>
      <div className="rounded-lg text-sm text-foreground opacity-40 hover:opacity-100 whitespace-pre-wrap wrap-break-word font-mono transition-opacity">
        {aplQuery || '쿼리가 없습니다.'}
      </div>
    </div>
  );
};

export default AplQueryDisplay;
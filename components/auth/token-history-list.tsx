import { useAuthStore } from '@stores/authStore';
import { renderMaskedToken } from '@utils/tokenSetting';
import { X } from 'lucide-react';

const TokenHistoryList = () => {
  const {
    tokenHistory,
    showToken,
    isLoading,
    setToken,
    setShowToken,
    removeTokenFromHistory,
    setAutoSubmitToken,
  } = useAuthStore();

  const handleTokenSelect = (historyToken: string) => {
    setToken(historyToken);
    setShowToken(false); // 토큰을 선택하면 가리도록 설정
    setAutoSubmitToken(historyToken); // 토큰 선택 후 자동 제출
  };

  const handleRemoveToken = (historyToken: string) => {
    removeTokenFromHistory(historyToken);
  };

  if (tokenHistory.length === 0) {
    return null;
  }

  return (
    <div className={`-mt-1.5 pt-3.5 pb-2 px-1.5 bg-background border-l border-r border-b border-input-border rounded-b-lg ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="max-h-21 overflow-y-auto scrollbar-thin">
        {tokenHistory.map((historyToken, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-2 py-1 hover:bg-muted-foreground/5 rounded-sm cursor-pointer group"
            onClick={() => handleTokenSelect(historyToken)}
          >
            <span className="text-xs text-muted-foreground group-hover:text-foreground truncate">
              {showToken ? historyToken : renderMaskedToken(historyToken)}
            </span>
            <button
              type="button"
              className="text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveToken(historyToken);
              }}
              aria-label="히스토리에서 토큰 제거"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenHistoryList;
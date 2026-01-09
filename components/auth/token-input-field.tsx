'use client';

import { EyeIcon, EyeOffIcon, KeySquare } from 'lucide-react';
import { useAuthStore } from '@stores/authStore';

const TokenInputField = () => {
  const {
    token,
    showToken,
    error,
    isLoading,
    setToken,
    setShowToken,
  } = useAuthStore();

  const toggleShowToken = () => setShowToken(!showToken);
  return (
    <div className="space-y-2 slide-up">
      <label htmlFor="token" className="block text-sm font-medium text-foreground">
        Axiom 토큰
      </label>
      <div className={`relative ${error ? 'shake' : ''}`}>
        <input
          id="token"
          type={showToken ? "text" : "password"}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Axiom API 토큰을 입력하세요"
          className={`w-full px-4 py-3.5 pl-16 pr-14 bg-input border ${error ? 'border-red-500' : 'border-input-border'} rounded-lg`}
          required
          aria-describedby="token-error"
          disabled={isLoading}
        />
        <KeySquare strokeWidth={1.5} className='w-8.5 h-7 absolute top-1/2 left-0 -translate-y-1/2 border-r border-input-border py-0.5 ml-4 pr-3 flex items-center text-yellow-700 dark:text-yellow-600 opacity-70' />
        <button
          type="button"
          onClick={toggleShowToken}
          className="input-button absolute inset-y-0 right-0 mr-5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          {showToken ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default TokenInputField;
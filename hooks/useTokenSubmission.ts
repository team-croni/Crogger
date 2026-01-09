import { useEffect, useRef, useState } from 'react';

interface UseTokenSubmissionProps {
  step: string;
  fetchDatasets: () => void;
  setIsLoading: (loading: boolean) => void;
}

// 토큰 제출 관련 상태 및 로직을 관리하는 훅
export function useTokenSubmission({ step, fetchDatasets, setIsLoading }: UseTokenSubmissionProps) {
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const [autoSubmitToken, setAutoSubmitToken] = useState<string | null>(null);

  // 토큰 입력 필드에 포커스
  useEffect(() => {
    if (step === 'token' && tokenInputRef.current) {
      tokenInputRef.current.focus();
    }
  }, [step]);

  // autoSubmitToken이 변경될 때 제출 처리
  useEffect(() => {
    if (autoSubmitToken) {
      setIsLoading(true);
      fetchDatasets();
      setAutoSubmitToken(null); // 제출 후 초기화
    }
  }, [autoSubmitToken, fetchDatasets, setIsLoading]);

  return {
    tokenInputRef,
    autoSubmitToken,
    setAutoSubmitToken
  };
}
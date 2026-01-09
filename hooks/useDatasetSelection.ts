import { useRouter } from 'next/navigation';
import { useAuthStore } from '@stores/authStore';

// 데이터셋 선택 관련 로직을 관리하는 훅
export const useDatasetSelection = () => {
  const router = useRouter();
  const {
    setStep,
    setToken,
    setAuthInfo,
    token,
    remember,
    setIsLoading,
    setError,
  } = useAuthStore();

  const handleDatasetSelect = async (dataset: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const isValid = true;

      if (!isValid) {
        setError('선택한 데이터셋에 접근할 수 없습니다. 다시 선택해주세요.');
        setIsLoading(false);
        return;
      }

      if (remember) {
        localStorage.setItem('axiom_token', token.trim());
        localStorage.setItem('axiom_dataset', dataset);
        localStorage.setItem('remember_settings', 'true');
      } else {
        localStorage.removeItem('axiom_token');
        localStorage.removeItem('axiom_dataset');
        localStorage.removeItem('remember_settings');
      }

      setAuthInfo(token.trim(), dataset);

      router.replace('/logs');
    } catch (err) {
      setError('설정 저장 중 오류가 발생했습니다.');
      console.error('설정 저장 오류:', err);
      setIsLoading(false);
    }
  };

  const handleBackToToken = () => {
    setStep('token');
    setToken('');
  };

  return {
    handleDatasetSelect,
    handleBackToToken
  };
};
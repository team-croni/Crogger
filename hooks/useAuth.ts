import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAxiomDatasets, useValidateAxiomCredentials } from '@/lib/axiom/axiom';
import { useAuthStore } from '@stores/authStore';

// 인증 관련 상태 및 로직을 관리하는 훅
export const useAuth = () => {
  const router = useRouter();
  const {
    token,
    datasets,
    selectedDataset,
    remember,
    isLoading,
    error,
    showToken,
    step,
    tokenHistory,
    autoSubmitToken,
    setToken,
    setDatasets,
    setSelectedDataset,
    setIsDatasetListLoading,
    setIsLoading,
    setError,
    setShowToken,
    setStep,
    setTokenHistory,
    addTokenToHistory,
    removeTokenFromHistory,
    setAuthInfo,
    reset,
    toggleRemember,
    setAutoSubmitToken
  } = useAuthStore();

  const validateCredentialsMutation = useValidateAxiomCredentials();

  // 컴포넌트 마운트 시 로컬 스토리지에서 설정 정보 확인
  useEffect(() => {
    const savedRemember = localStorage.getItem('remember_settings') === 'true';

    if (savedRemember) {
      const savedToken = localStorage.getItem('axiom_token');
      const savedDataset = localStorage.getItem('axiom_dataset');

      if (savedToken && savedDataset) {
        // 기억하기가 체크되어 있고 저장된 설정이 있다면 로그 페이지로 이동
        router.replace('/logs');
      }
    }

    // 로컬 스토리지에서 토큰 히스토리 가져오기
    const savedTokenHistory = localStorage.getItem('axiom_token_history');
    if (savedTokenHistory) {
      try {
        const parsedHistory = JSON.parse(savedTokenHistory);
        if (Array.isArray(parsedHistory)) {
          setTokenHistory(parsedHistory);
        }
      } catch (e) {
        console.error('토큰 히스토리 파싱 오류:', e);
      }
    }
  }, [router, setTokenHistory]);

  // TanStack Query를 사용한 데이터셋 목록 쿼리 - 자동 실행 비활성화
  const { data: datasetList, isLoading: isDatasetsLoading, error: datasetsError, refetch: refetchDatasets } = useAxiomDatasets(token, false); // enabled 옵션을 false로 설정하여 자동 실행 방지

  // 쿼리 결과에 따라 로컬 상태 업데이트 - useEffect를 사용하여 무한 루프 방지
  useEffect(() => {
    if (datasetList && datasetList !== undefined) {
      setDatasets(datasetList);
    }
  }, [datasetList, setDatasets]);

  useEffect(() => {
    setIsDatasetListLoading(isDatasetsLoading);
  }, [isDatasetsLoading, setIsDatasetListLoading]);

  useEffect(() => {
    if (datasetsError) {
      if (datasetsError instanceof Error) {
        if (datasetsError.message.includes('401') || datasetsError.message.toLowerCase().includes('unauthorized')) {
          setError('토큰이 유효하지 않습니다. 다시 확인해주세요.');
        } else if (datasetsError.message.includes('403') || datasetsError.message.toLowerCase().includes('forbidden')) {
          setError('토큰이 유효하지 않거나 토큰에 필요한 권한이 없습니다.');
        } else {
          setError('데이터셋 목록을 가져오는데 실패했습니다. 토큰을 확인해주세요.');
        }
      } else {
        setError('데이터셋 목록을 가져오는데 실패했습니다. 토큰을 확인해주세요.');
      }
      console.error('데이터셋 목록 조회 오류:', datasetsError);
      setDatasets([]);
    } else {
      setError(null);
    }
  }, [datasetsError, setError, setDatasets]);

  const fetchDatasets = async () => {
    if (!token.trim()) {
      setError('Axiom 토큰을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // useQuery를 통해 데이터셋 목록 가져오기
      const result = await refetchDatasets();
      const datasetList = result.data;

      if (datasetList && datasetList.length === 0) {
        setError('사용 가능한 데이터셋이 없습니다.');
      } else if (datasetList) {
        // 데이터셋 목록이 성공적으로 불러와지면 다음 단계로 이동
        setStep('datasets');
        return datasetList;
      }

    } catch (err) {
      console.error('데이터셋 목록 조회 오류:', err);
      setDatasets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await fetchDatasets();

    // 토큰 히스토리에 현재 토큰 추가
    if (result && token.trim()) {
      addTokenToHistory(token.trim());

      // 히스토리 업데이트를 로컬 스토리지에 저장
      const currentHistory = useAuthStore.getState().tokenHistory;
      localStorage.setItem('axiom_token_history', JSON.stringify(currentHistory));
    }

    setIsLoading(false);
  };

  // autoSubmitToken이 변경될 때 제출 처리
  useEffect(() => {
    if (autoSubmitToken) {
      setIsLoading(true);
      fetchDatasets();
      setAutoSubmitToken(null); // 제출 후 초기화
    }
  }, [autoSubmitToken, fetchDatasets, setIsLoading, setAutoSubmitToken]);

  const handleTokenReset = () => {
    useAuthStore.getState().reset();

    localStorage.removeItem('axiom_token');
    localStorage.removeItem('axiom_dataset');
    localStorage.removeItem('remember_settings');

    router.push('/');
  };

  const handleDatasetSelect = async (dataset: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 뮤테이션을 사용한 자격 증명 검증
      const isValid = await validateCredentialsMutation.mutateAsync({
        token: token.trim(),
        dataset
      });

      if (!isValid) {
        setError('선택한 데이터셋에 접근할 수 없습니다. 다시 선택해주세요.');
        setIsLoading(false);
        return;
      }

      // 기억하기 체크 여부 저장
      if (remember) {
        // 기억하기 체크 시에만 설정 정보를 localStorage에 저장
        localStorage.setItem('axiom_token', token.trim());
        localStorage.setItem('axiom_dataset', dataset);
        localStorage.setItem('remember_settings', 'true');
      } else {
        // 기억하기 체크 해제 시 로컬 스토리지의 설정 정보 삭제
        localStorage.removeItem('axiom_token');
        localStorage.removeItem('axiom_dataset');
        localStorage.removeItem('remember_settings');
      }

      // 전역 상태에 인증 정보 저장
      setAuthInfo(token.trim(), dataset);

      // 로그 페이지로 이동
      router.replace('/logs');
    } catch (err) {
      setError('설정 저장 중 오류가 발생했습니다.');
      console.error('설정 저장 오류:', err);
      setIsLoading(false);
    }
  };

  const handleBackToToken = () => {
    setStep('token');
  };

  const toggleShowToken = () => {
    setShowToken(!showToken);
  };

  return {
    token,
    datasets: datasetList || datasets,
    selectedDataset,
    isDatasetListLoading: isDatasetsLoading,
    remember,
    isLoading,
    error,
    showToken,
    step,
    tokenHistory,
    setToken,
    setDatasets,
    setSelectedDataset,
    setIsDatasetListLoading,
    setIsLoading,
    setError,
    setShowToken,
    setStep,
    reset,
    fetchDatasets,
    handleTokenSubmit,
    handleTokenReset,
    handleDatasetSelect,
    handleBackToToken,
    toggleRemember,
    toggleShowToken,
    addTokenToHistory,
    removeTokenFromHistory,
  };
};
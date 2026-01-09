import { Axiom } from '@axiomhq/js';
import { useQuery, useMutation } from '@tanstack/react-query';

// 토큰과 데이터셋 이름의 유효성을 검사하는 함수
export const validateAxiomCredentials = async (token: string, dataset: string): Promise<boolean> => {
  try {
    // 새로운 Axiom 클라이언트 인스턴스 생성
    const client = new Axiom({ token });

    // 간단한 쿼리를 실행하여 토큰의 유효성을 확인
    await client.datasets.get(dataset);
    return true;
  } catch (error) {
    console.error('Axiom credentials validation failed:', error);
    return false;
  }
};

// 토큰을 사용하여 데이터셋 목록을 가져오는 함수
export const getAxiomDatasets = async (token: string): Promise<string[]> => {
  try {
    // 새로운 Axiom 클라이언트 인스턴스 생성
    const client = new Axiom({ token });

    // 데이터셋 목록 조회
    const datasets = await client.datasets.list();

    // 데이터셋 이름만 추출하여 반환
    return datasets.map(dataset => dataset.name);
  } catch (error) {
    console.error('Axiom datasets fetch failed:', error);
    throw error;
  }
};

// TanStack Query를 사용한 데이터셋 목록 조회 커스텀 훅
export const useAxiomDatasets = (token: string, enabled: boolean = !!token) => {
  return useQuery({
    queryKey: ['axiomDatasets', token],
    queryFn: () => getAxiomDatasets(token),
    enabled: enabled,
    staleTime: 1000 * 60, // 1분 동안은 캐시된 데이터 사용
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    refetchOnWindowFocus: false, // 창 포커스 시 자동 리패치 비활성화
    retry: 0,
  });
};

// TanStack Query를 사용한 자격 증명 유효성 검사 커스텀 훅
export const useValidateAxiomCredentials = () => {
  return useMutation({
    mutationFn: ({ token, dataset }: { token: string; dataset: string }) =>
      validateAxiomCredentials(token, dataset),
  });
};
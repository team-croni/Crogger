import { useLogStore } from '@stores/logStore';
import { useAuthStore } from '@stores/authStore';
import { useFilterStore } from '@stores/filterStore';
import { useRouter } from 'next/navigation';
import { Filters, LogEntry } from '@/types/log';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// 로그 데이터를 관리하는 훅
// API에서 로그를 가져오는 함수
const fetchLogsFromAPI = async (filters: Filters, token: string, selectedDataset: string): Promise<{ rows: LogEntry[], aplQuery?: string, metadata?: { totalRows: number } }> => {
  const queryParams = new URLSearchParams();

  // 배열 필터를 처리 - 배열이 비어있지 않으면 각 요소를 추가
  if (filters.level && filters.level.length > 0) {
    filters.level.forEach(level => queryParams.append('level', level));
  }
  if (filters.category && filters.category.length > 0) {
    filters.category.forEach(category => queryParams.append('category', category));
  }
  if (filters.method && filters.method.length > 0) {
    filters.method.forEach(method => queryParams.append('method', method));
  }
  if (filters.statusCode && filters.statusCode.length > 0) {
    filters.statusCode.forEach(statusCode => queryParams.append('statusCode', statusCode));
  }

  // 일반 필터 추가
  if (filters.search) {
    queryParams.append('search', filters.search);
  }
  if (filters.host) {
    queryParams.append('host', filters.host);
  }
  if (filters.path) {
    queryParams.append('path', filters.path);
  }
  if (filters.dateRange.from) {
    queryParams.append('dateFrom', filters.dateRange.from);
  }
  if (filters.dateRange.to) {
    queryParams.append('dateTo', filters.dateRange.to);
  }

  // 설정 정보를 쿼리 파라미터로 전달
  queryParams.append('dataset', selectedDataset);

  const response = await fetch(`/api/logs?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('로그를 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return {
    rows: data.rows || [],
    aplQuery: data.aplQuery,
    metadata: data.metadata
  };
};

interface UseLogDataReturn {
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => void;
  aplQuery: string;
}

export const useLogData = (): UseLogDataReturn => {
  const router = useRouter();
  const { token, selectedDataset } = useAuthStore();
  const { filters: filtersStore } = useFilterStore();
  const { setLogs, setLoading, setError, setLoadTime } = useLogStore();

  const filters = filtersStore;

  const { data: logsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['logs', filters, selectedDataset],
    queryFn: async () => {
      if (!token || !selectedDataset) {
        router.push('/');
        throw new Error('인증 정보가 없습니다.');
      }

      const startTime = performance.now();
      try {
        const result = await fetchLogsFromAPI(filters, token, selectedDataset);
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        setLoadTime(loadTime);
        return result;
      } catch (err) {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        setLoadTime(loadTime);
        throw err;
      }
    },
    enabled: !!token && !!selectedDataset, // 토큰과 데이터셋이 있을 때만 쿼리 활성화
    staleTime: 1000 * 30, // 30초 동안은 캐시된 데이터 사용
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 유지 (v5에서 cacheTime 대신 gcTime 사용)
    refetchOnWindowFocus: false, // 창 포커스 시 자동 리패치 비활성화
    retry: 1,
  });

  const logs = logsResponse?.rows || [];
  const aplQuery = logsResponse?.aplQuery || '';

  // 쿼리 결과에 따라 로컬 상태 업데이트 - useEffect를 사용하여 무한 루프 방지
  useEffect(() => {
    if (logsResponse && logsResponse.rows) {
      setLogs(logsResponse.rows);
    }
  }, [logsResponse, setLogs]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(error.message || '로그를 불러오는데 실패했습니다.');
    } else {
      setError(null);
    }
  }, [error, setError]);

  return {
    logs: logs || [],
    loading: isLoading,
    error: error ? error.message || '로그를 불러오는데 실패했습니다.' : null,
    fetchLogs: () => refetch(),
    aplQuery
  };
};
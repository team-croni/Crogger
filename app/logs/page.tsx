'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogList from '@components/log-list/log-list';
import LogLevelChart from '@components/log-level-chart/log-level-chart';
import LogStatusBar from '@components/log-status-bar/log-status-bar';
import { useFilters } from '@hooks/useFilters';
import { useAuthStore } from '@stores/authStore';
import { useAxiomDatasets } from '@lib/axiom/axiom';
import { useLiveRefresh } from '@hooks/useLiveRefresh';
import ErrorToast from '@components/log-filters/erorr-toast';
import Header from '@components/header/header';
import { getDefaultFilters } from '@utils/filters';
import LogFilterPanel from '@components/log-filter-panel/log-filter-panel';
import LogFilters from '@components/log-filters/log-filters';
import InfoModal from '@components/header/info-modal';

export default function Home() {
  const router = useRouter();
  const [authInitialized, setAuthInitialized] = useState(false);
  const { initialize } = useFilters();
  const { selectedDataset, token, setAuthInfo, setRemember, setDatasets } = useAuthStore();
  const { data: datasetList } = useAxiomDatasets(token || '');

  // 더미 모드 여부 확인
  const isDummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE === 'true';

  useLiveRefresh();

  // 데이터셋 목록이 변경되었을 때 스토어 업데이트
  useEffect(() => {
    if (datasetList) {
      setDatasets(datasetList);
    }
  }, [datasetList, setDatasets]);

  useEffect(() => {
    const savedRemember = localStorage.getItem('remember_settings') === 'true';
    const savedToken = localStorage.getItem('axiom_token');
    const savedDataset = localStorage.getItem('axiom_dataset');

    if (savedRemember && savedToken && savedDataset && (!token || !selectedDataset)) {
      setAuthInfo(savedToken, savedDataset);
      setRemember(true);
    } else {
    }

    setAuthInitialized(true);
  }, [token, selectedDataset, setAuthInfo, setRemember]);

  useEffect(() => {
    if (authInitialized) {
      // 더미 모드일 경우에는 토큰 검증을 우회
      if (!isDummyMode && !token && !selectedDataset) {
        router.push('/');
      }
    }
  }, [token, selectedDataset, router, authInitialized, isDummyMode]);

  useEffect(() => {
    const initialFilters = getDefaultFilters();

    initialize(initialFilters);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <header className="flex flex-col justify-end gap-2.5 px-3 py-3 border-b-2 border-sidebar-border bg-background">
        <Header />
        <LogFilters />
      </header>

      <div className='h-[calc(100%-7.125rem)] flex flex-col'>
        <ErrorToast />
        <div className="relative flex-1 overflow-hidden flex">
          <LogFilterPanel />
          <div className="flex-1 flex flex-col overflow-hidden">
            <LogLevelChart />
            <LogList />
          </div>
        </div>

        <LogStatusBar />
      </div>
      <InfoModal />
    </div>
  );
}
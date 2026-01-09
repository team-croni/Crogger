'use client';

import { LogDetailModal, LogHeader, LogItemsContainer } from '@components/log-list';
import { useLogList } from '@hooks/useLogList';

const LogList = () => {
  const { scrollContainerRef } = useLogList();

  return (
    <div ref={scrollContainerRef} className='log-list-container h-[calc(100%-5rem)] flex flex-col overflow-auto'>
      <LogHeader />
      <LogItemsContainer />
      <LogDetailModal />
    </div >
  );
}

export default LogList;
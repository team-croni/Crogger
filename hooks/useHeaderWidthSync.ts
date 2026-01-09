import { useEffect, RefObject } from 'react';

interface UseHeaderWidthSyncProps {
  headerRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
}

// 헤더 너비와 콘텐츠 너비를 동기화하는 훅
export const useHeaderWidthSync = ({ headerRef, contentRef }: UseHeaderWidthSyncProps) => {
  useEffect(() => {
    const header = headerRef.current;
    const content = contentRef.current;

    if (!header || !content) return;

    // 초기 너비 설정
    header.style.width = `${content.offsetWidth}px`;

    // ResizeObserver를 사용하여 content의 너비 변화를 감지
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === content) {
          header.style.width = `${content.offsetWidth}px`;
        }
      }
    });

    resizeObserver.observe(content);

    // cleanup function
    return () => {
      resizeObserver.disconnect();
    };
  }, [headerRef, contentRef]);
};
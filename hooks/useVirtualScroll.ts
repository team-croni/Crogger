import { useVirtualizer } from '@tanstack/react-virtual';
import { RefObject } from 'react';

interface UseVirtualScrollProps {
  count: number;
  scrollElementRef: RefObject<HTMLElement>;
  itemSize?: number;
  overscan?: number;
}

// 가상 스크롤 기능을 제공하는 훅
export const useVirtualScroll = ({
  count,
  scrollElementRef,
  itemSize = 36,
  overscan = 10
}: UseVirtualScrollProps) => {
  return useVirtualizer({
    count,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => itemSize,
    overscan,
    measureElement: (el) => {
      return el.getBoundingClientRect().height;
    },
  });
};
import { useMemo } from 'react';
import { useTooltipStore } from '@stores/tooltipStore';

// 툴팁 관련 상태 및 로직을 관리하는 훅
export const useTooltip = () => {
  const { visible, x, y, dataPoint, showTooltip, hideTooltip, updatePosition, setDataPoint } = useTooltipStore();

  const tooltipDisplayData = useMemo(() => {
    if (!dataPoint) return { tooltipData: [], totalLogs: 0 };

    const levels = ['trace', 'debug', 'info', 'success', 'warn', 'error', 'fatal'] as const;
    const totalLogs = levels.reduce((sum, level) => sum + dataPoint[level], 0);

    const tooltipData = levels
      .filter((level) => dataPoint[level] > 0)
      .map((level) => {
        const count = dataPoint[level];
        const percentage = totalLogs > 0 ? (count / totalLogs) * 100 : 0;
        return { level, count, percentage: percentage.toFixed(1) };
      });

    return { tooltipData, totalLogs };
  }, [dataPoint]);

  const adjustedPosition = useMemo(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };

    const adjustedX = Math.max(10, Math.min(x - 95, window.innerWidth - 210));
    const adjustedY = y - 6;

    return { x: adjustedX, y: adjustedY };
  }, [x, y]);

  return {
    visible,
    x,
    y,
    dataPoint,
    showTooltip,
    hideTooltip,
    updatePosition,
    setDataPoint,
    tooltipDisplayData,
    adjustedPosition
  };
};
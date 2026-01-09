'use client';

import Portal from '@components/ui/portal';
import { levelColors } from '@constants/logLevelColors';
import { useTooltip } from '@hooks/useTooltip';

const CustomTooltip = () => {
  const {
    visible,
    dataPoint,
    hideTooltip,
    tooltipDisplayData,
    adjustedPosition
  } = useTooltip();

  if (!visible || !dataPoint) return null;

  const { tooltipData, totalLogs } = tooltipDisplayData;

  return (
    <Portal selector="body">
      <div
        className="fixed z-1000 bg-popover text-popover-foreground border border-popover-border rounded-xl shadow-xl/8 p-3 text-xs 
                   fade-in transition-all duration-50"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          minWidth: '190px',
        }}
        onMouseLeave={hideTooltip}
      >
        {/* 개선된 말풍선 화살표 (삼각형) */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                     bg-popover border-t border-l border border-popover-border"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }}
        />

        <div className="relative z-10">
          <div className="font-semibold mb-3 pb-3 border-b border-popover-border">
            <div className="flex items-center mb-1">
              <span className="font-normal text-muted-foreground min-w-8 mr-1">Start</span>
              <span>
                {dataPoint.start.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-normal text-muted-foreground min-w-8 mr-1">End</span>
              <span>
                {dataPoint.end.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            {tooltipData.map((item) => (
              <div key={item.level} className="flex justify-between items-center group">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 border border-foreground/20 ${levelColors[item.level as keyof typeof levelColors]}`} />
                  <span className="font-medium uppercase">{item.level}</span>
                </div>
                <span className="font-mono">
                  <span className="font-bold">{item.count}</span>
                  <span className="text-muted-foreground ml-1.5 min-w-12 inline-block text-right">({item.percentage}%)</span>
                </span>
              </div>
            ))}
            {tooltipData.length === 0 && (
              <div className="py-2 text-center text-muted-foreground italic">데이터 없음</div>
            )}
            <div className="mt-3 text-muted-foreground">
              Total: {totalLogs}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default CustomTooltip;
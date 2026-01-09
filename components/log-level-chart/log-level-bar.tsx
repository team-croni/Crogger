import React, { memo } from 'react';
import { LogLevelData } from '@/types/log';
import { levelColors } from '@constants/logLevelColors';
import { getSortedLevelsByCount } from '@hooks/useLogLevelChart';

interface LogLevelBarProps {
  dataPoint: LogLevelData;
  index: number;
  barProps: {
    showLabel: boolean;
    isHighlighted: boolean;
    isHighlightStart: boolean;
    isHighlightEnd: boolean;
    showDateChangeLine: boolean;
    totalLogs: number;
    barHeight: number;
    maxLogsInTimeRange: number;
  };
  onShowTooltip: (e: React.MouseEvent, dataPoint: LogLevelData) => void;
  onHideTooltip: () => void;
}

const LogLevelBar: React.FC<LogLevelBarProps> = ({
  dataPoint,
  index,
  barProps,
  onShowTooltip,
  onHideTooltip
}) => {
  return (
    <div
      key={`dataPoint-${index}`}
      className={`flex-1 flex flex-col items-center justify-end relative fade-in ${barProps.isHighlighted
        ? 'bg-primary/10 dark:bg-muted/50'
        : barProps.totalLogs > 0 ? 'hover:bg-muted-foreground/7 dark:hover:bg-foreground/2' : ''
        }`}
      style={{ minWidth: '20px' }} // 최소 너비 설정
      onMouseEnter={(e) => barProps.totalLogs > 0 && onShowTooltip(e, dataPoint)}
      onMouseLeave={onHideTooltip}
    >
      {/* 날짜/월 변경 지점 세로선 */}
      {barProps.showDateChangeLine && (
        <div
          className="absolute left-0 top-0 bottom-0 border-l border-dashed border-border/70"
        />
      )}
      {/* 하이라이트 시작 경계선 */}
      {barProps.isHighlightStart && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/50 pointer-events-none" />
      )}
      {/* 하이라이트 끝 경계선 */}
      {barProps.isHighlightEnd && (
        <div className="absolute right-0 top-0 bottom-0 w-px bg-primary/50 pointer-events-none" />
      )}
      {/* 막대 그래프 - 로그 수에 비례한 높이로 수정 */}
      <div
        className={`flex flex-col items-center justify-end pt-4 w-full max-w-5 transition-transform duration-400 ease-out origin-bottom ${barProps.totalLogs > 0 ? 'scale-y-100' : 'scale-y-0'}`}
        style={{ height: `${barProps.barHeight}px` }}
      >
        {barProps.totalLogs > 0 && (
          getSortedLevelsByCount(dataPoint).map(level => {
            const count = dataPoint[level as keyof Omit<LogLevelData, 'label' | 'start' | 'end'>];
            if (count === 0) return null;

            const percentage = (count / barProps.totalLogs) * 100;
            return (
              <div
                key={`${level}-${index}`}
                className={`w-1/2 min-w-2.5 ${levelColors[level as keyof typeof levelColors]}`}
                style={{
                  height: `${percentage}%`,
                  minHeight: percentage > 0 ? '2px' : '0' // 너무 작은 값은 최소 높이 설정
                }}
              />
            );
          }).reverse() // 아래에서 위로 쌓이도록 역순으로 표시
        )}
      </div>
      {/* 시간 레이블 */}
      {barProps.showLabel && <div className={`absolute bottom-7.5 w-px h-1.5 bg-border`} />}
      <div className={`w-full border-t text-[0.625rem] text-center pt-2 pb-3 whitespace-nowrap select-none ${barProps.isHighlighted ? 'text-foreground cursor-default' : 'text-muted-foreground'}`}>
        <span className={`${barProps.showLabel ? 'visible' : 'invisible'}`}>{dataPoint.label}</span>
      </div>
    </div>
  );
};

export default memo(LogLevelBar);
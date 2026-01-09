'use client';

import { useFilterStore } from '@stores/filterStore';
import { useLogStore } from '@stores/logStore';
import { getLevelTextStyle } from '@utils/logLevelUtils';
import { Calendar, Check } from 'lucide-react';

const LogStatusBar = () => {
  const { logs, loadTime } = useLogStore();
  const { filters } = useFilterStore();

  // 로그 레벨별 개수를 계산하는 함수
  const getLogLevelStats = () => {
    const levelCounts: Record<string, number> = {
      trace: 0,
      debug: 0,
      info: 0,
      success: 0,
      warn: 0,
      error: 0,
      fatal: 0
    };

    logs.forEach(log => {
      const level = (log.level || 'info').toString().toLowerCase();
      if (level in levelCounts) {
        levelCounts[level]++;
      } else {
        levelCounts.info++;
      }
    });

    return levelCounts;
  };

  // 레벨별 통계 가져오기
  const levelStats = getLogLevelStats();

  return (
    <div className="flex px-4 h-9 text-xs text-muted-foreground bg-sidebar border-t">
      <div className="h-full flex-1 flex justify-between gap-4">
        <div className="flex items-center h-full">
          <div className='shrink-0 flex items-center h-full pr-4 border-r border-sidebar-border'>
            <Check className='w-3.5 h-3.5 mr-1.5 text-yellow-700 dark:text-yellow-500' />
            <span className="font-medium text-foreground"><span className='font-bold'>총 {logs.length}</span>개의 결과</span>
            {loadTime !== null && (
              <span className="ml-2.5 text-muted-foreground">
                {loadTime.toFixed(0)}ms
              </span>
            )}
          </div>

          {/* 레벨별 통계 요약 표시 */}
          <div className="h-full flex items-center pl-2 overflow-hidden">
            {Object.entries(levelStats).map(([level, count]) => {
              if (count === 0) return null;
              return (
                <span
                  key={level}
                  className={`flex items-center h-full px-2 text-xs text-muted-foreground`}
                >
                  {level.toUpperCase()}<span className={`flex justify-center items-center font-semibold px-1.5 min-w-5 h-5 ml-1.5 rounded-full bg-muted-foreground/8 dark:bg-muted-foreground/15 ${getLevelTextStyle(level)}`}>{count}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 whitespace-nowrap overflow-hidden">
          {filters.level && filters.level.length > 0 && (
            <span>
              필터 - 레벨: <span className="font-medium text-foreground">{filters.level.join(', ').toUpperCase()}</span>
            </span>
          )}
          {filters.category && filters.category.length > 0 && (
            <span>
              카테고리: <span className="font-medium text-foreground">{filters.category.join(', ')}</span>
            </span>
          )}
          {filters.search && (
            <span>
              검색어: <span className="font-medium text-foreground">{filters.search}</span>
            </span>
          )}
          <div className='shrink-0 flex items-center'>
            <Calendar className='w-3 h-3 mr-1.5' />
            <span>
              {filters.dateRange.from === filters.dateRange.to
                ? filters.dateRange.from
                : `${filters.dateRange.from} ~ ${filters.dateRange.to}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogStatusBar;
import { useEffect, useRef } from 'react';
import { useFilterStore } from '@stores/filterStore';
import { useLogStore } from '@stores/logStore';
import { useLogLevelChartStore } from '@stores/logLevelChartStore';
import { useTooltip } from '@hooks/useTooltip';
import { LogLevelData, TimeRange } from '@/types/log';

// 로그 레벨 차트를 관리하는 훅
// 날짜 범위에 따라 적절한 시간 간격을 결정하는 함수
const getIntervalUnit = (startDate: Date, endDate: Date): { unit: string; interval: number } => {
  // 항상 45개의 막대를 만들기 때문에 실제 간격은 동적으로 결정됨
  const totalDuration = endDate.getTime() - startDate.getTime();
  const segmentDuration = totalDuration / 45; // 45개의 세그먼트로 나눔

  // 각 단위의 밀리초 수
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;

  if (segmentDuration < minuteMs) {
    // 분 미만: 분 단위 (간격은 실제 계산에 따름)
    return { unit: 'minute', interval: Math.floor(segmentDuration / minuteMs) || 1 };
  } else if (segmentDuration < hourMs) {
    // 시간 미만: 분 단위
    return { unit: 'minute', interval: Math.floor(segmentDuration / minuteMs) || 1 };
  } else if (segmentDuration < dayMs / 3) {
    // 일 미만: 시간 단위
    return { unit: 'hour', interval: Math.floor(segmentDuration / hourMs) || 1 };
  } else if (segmentDuration < weekMs) {
    // 주 미만: 일 단위
    return { unit: 'day', interval: Math.floor(segmentDuration / dayMs) || 1 };
  } else {
    // 주 이상: 주 단위 또는 월 단위
    const monthMs = 30 * dayMs; // 평균적인 월 길이
    if (segmentDuration < monthMs) {
      return { unit: 'week', interval: Math.floor(segmentDuration / weekMs) || 1 };
    } else {
      return { unit: 'month', interval: Math.floor(segmentDuration / monthMs) || 1 };
    }
  }
};

// 날짜 포맷 함수
const formatDateLabel = (date: Date, unit: string): string => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  switch (unit) {
    case 'minute':
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    case 'hour':
      return `${date.getHours().toString().padStart(2, '0')}:00`;
    case 'day':
      return `${date.getDate()}일`;
    case 'week':
      // 월 내에서 몇 번째 주인지 계산
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const firstDayWeekday = firstDayOfMonth.getDay(); // 일요일: 0, 월요일: 1, ...
      const currentDay = date.getDate();
      // 월의 첫 번째 주를 결정 (첫 주가 1일부터 시작하지 않을 수 있음)
      const weekNumber = Math.ceil((currentDay + firstDayWeekday) / 7);
      return `${months[date.getMonth()]} ${weekNumber}주`;
    case 'month':
      return `${months[date.getMonth()]} ${date.getDate()}일`;
    default:
      return `${months[date.getMonth()]} ${date.getDate()}일`;
  }
};

// 주어진 시간 범위가 다른 시간 범위와 겹치는지 확인하는 함수
const isRangeOverlapping = (range1Start: Date, range1End: Date, range2Start: Date, range2End: Date): boolean => {
  return range1Start <= range2End && range1End >= range2Start;
};

// 시간 범위 생성 함수
const generateTimeRanges = (dateRange: { from?: string; to?: string }): TimeRange[] => {
  // 기본적으로 오늘 날짜 기준 24시간 범위 생성
  if (!dateRange || !dateRange.from || !dateRange.to) {
    const ranges: TimeRange[] = [];
    const now = new Date();
    // 현재 시간부터 23시간 전까지의 24개 시간대 생성 (1시간 단위)
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now);
      hour.setHours(now.getHours() - i, 0, 0, 0);
      const end = new Date(hour);
      end.setHours(hour.getHours() + 1, 0, 0, 0);

      ranges.push({
        label: formatDateLabel(hour, 'hour'),
        start: hour,
        end: end
      });
    }
    return ranges;
  }

  // 사용자 로컬 시간대로 날짜 생성
  let startDate = new Date(dateRange.from);
  let endDate = new Date(dateRange.to);

  // 시작 날짜는 00:00:00으로 설정
  startDate.setHours(0, 0, 0, 0);

  // 종료 날짜는 23:59:59로 설정
  endDate.setHours(23, 59, 59, 999);

  // endDate가 startDate보다 작으면 조정
  if (endDate < startDate) {
    endDate.setDate(startDate.getDate() + 1);
  }

  // 항상 45개의 막대를 생성하도록 수정
  const targetBarCount = 45;
  const totalDuration = endDate.getTime() - startDate.getTime();
  const segmentDuration = totalDuration / targetBarCount; // 각 막대가 나타내는 시간(밀리초)

  const ranges: TimeRange[] = [];

  // 고정된 45개의 막대 생성
  for (let i = 0; i < targetBarCount; i++) {
    const start = new Date(startDate.getTime() + i * segmentDuration);
    const end = new Date(startDate.getTime() + (i + 1) * segmentDuration);

    // 마지막 막대는 endDate와 정확히 일치하도록 조정
    if (i === targetBarCount - 1) {
      ranges.push({
        label: formatDateLabel(start, getIntervalUnit(startDate, endDate).unit),
        start,
        end: endDate
      });
    } else {
      ranges.push({
        label: formatDateLabel(start, getIntervalUnit(startDate, endDate).unit),
        start,
        end
      });
    }
  }

  return ranges;
};

// 로그 데이터 집계 함수
const aggregateLogData = (logs: any[], timeRanges: TimeRange[], initialData: LogLevelData[]): LogLevelData[] => {
  if (!logs || logs.length === 0) {
    return initialData;
  }

  const timeData = [...initialData];

  logs.forEach(log => {
    // 시간 정보 추출 (ISO 형식)
    const timestamp = log._time || log.time;
    if (!timestamp) return;

    const logDate = new Date(timestamp);

    // 로그가 속하는 시간대 찾기
    for (let i = 0; i < timeRanges.length; i++) {
      const range = timeRanges[i];
      if (logDate >= range.start && logDate <= range.end) {
        // 레벨별 카운트 증가
        const level = (log.level || '').toString().toLowerCase();
        if (level in timeData[i]) {
          timeData[i][level as keyof Omit<LogLevelData, 'label' | 'start' | 'end'>]++;
        } else {
          // 알 수 없는 레벨은 info로 처리
          timeData[i].info++;
        }
        break;
      }
    }
  });

  return timeData;
};

// 로그 수가 많은 순서로 레벨을 정렬하는 함수
export const getSortedLevelsByCount = (dataPoint: LogLevelData) => {
  const levels = ['trace', 'debug', 'info', 'success', 'warn', 'error', 'fatal'] as const;

  return levels
    .map(level => ({
      level,
      count: dataPoint[level]
    }))
    .sort((a, b) => b.count - a.count) // 로그 수가 많은 순서로 정렬
    .map(item => item.level);
};

// 각 막대의 높이를 계산하는 함수 (픽셀 단위)
export const calculateBarHeight = (totalLogs: number, maxLogsInTimeRange: number) => {
  if (maxLogsInTimeRange === 0) return 20; // 기본 높이
  // 로그 수에 비례하여 높이 계산 (최소 20px ~ 최대 44px)
  const minHeight = 20;
  const maxHeight = 44; // 최대 높이를 44px로 제한
  const ratio = totalLogs / maxLogsInTimeRange;
  return minHeight + (maxHeight - minHeight) * ratio;
};

export const useLogLevelChart = () => {
  const { filters: { dateRange } } = useFilterStore();
  const { logs, visibleTimeRange } = useLogStore();
  const { chartData, chartWidth, labelFrequency, setChartData, setChartWidth, setLabelFrequency } = useLogLevelChartStore();
  const { showTooltip: storeShowTooltip, hideTooltip: storeHideTooltip, setDataPoint } = useTooltip();

  // 툴팁 표시 함수
  const showTooltip = (e: React.MouseEvent, dataPoint: any) => {
    const chartRect = chartRef.current?.getBoundingClientRect();
    const targetRect = (e.target as HTMLElement).getBoundingClientRect();

    if (chartRect) {
      setDataPoint(dataPoint);
      storeShowTooltip(
        targetRect.left + targetRect.width / 2, // 대상 요소의 중앙
        chartRect.bottom + 10, // 차트 아래에 표시
        dataPoint
      );
    }
  };

  // 툴팁 숨김 함수
  const hideTooltip = () => {
    storeHideTooltip();
  };

  // 업데이트된 차트 데이터 관련 함수들
  const updateChartData = () => {
    const timeRanges = generateTimeRanges(dateRange);

    // 초기 데이터 생성 (모든 시간대에 대해 0으로 초기화)
    const initialData: LogLevelData[] = timeRanges.map(range => ({
      label: range.label,
      trace: 0,
      debug: 0,
      info: 0,
      success: 0,
      warn: 0,
      error: 0,
      fatal: 0,
      start: range.start,
      end: range.end
    }));

    const aggregatedData = aggregateLogData(logs, timeRanges, initialData);
    setChartData(aggregatedData);
  };

  // 차트 너비에 따라 레이블 빈도 계산
  const updateLabelFrequency = (width: number) => {
    if (width > 0 && chartData.length > 0) {
      // 차트 너비에 따라 레이블 표시 빈도 결정
      let frequency = 1;

      // 실제 차트에 표시되는 시간 범위에 따라 다른 빈도 적용
      if (chartData.length > 0) {
        const actualStartDate = chartData[0].start;
        const actualEndDate = chartData[chartData.length - 1].end;
        const actualDiffInHours = (actualEndDate.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60);
        const actualDiffInDays = actualDiffInHours / 24;

        if (actualDiffInHours <= 24) {
          // 짧은 시간 범위 (24시간 이하)
          if (width >= 1400) frequency = 1;    // 모든 레이블 표시
          else if (width >= 1200) frequency = 2; // 절반 표시
          else if (width >= 800) frequency = 3;  // 3개 중 1개 표시
          else if (width >= 600) frequency = 4;  // 4개 중 1개 표시
          else if (width >= 400) frequency = 6;  // 6개 중 1개 표시
          else frequency = 8;                    // 8개 중 1개 표시
        } else if (actualDiffInHours <= 168) { // 7일 이하
          // 중간 시간 범위 (7일 이하)
          if (width >= 1400) frequency = 1;
          else if (width >= 1200) frequency = 2;
          else if (width >= 800) frequency = 3;
          else if (width >= 600) frequency = 4;
          else if (width >= 400) frequency = 6;
          else frequency = 12;
        } else if (actualDiffInDays <= 30) { // 30일 이하
          // 30일 이하 범위
          if (width >= 1400) frequency = 1;
          else if (width >= 1200) frequency = 2;
          else if (width >= 1000) frequency = 3;
          else if (width >= 800) frequency = 4;
          else if (width >= 600) frequency = 6;
          else if (width >= 400) frequency = 8;
          else frequency = 12;
        } else {
          // 긴 시간 범위 (30일 이상)
          if (width >= 1400) frequency = 1;
          else if (width >= 1200) frequency = 2;
          else if (width >= 1000) frequency = 3;
          else if (width >= 800) frequency = 4;
          else if (width >= 600) frequency = 6;
          else if (width >= 400) frequency = 8;
          else frequency = 16;
        }
      }

      setLabelFrequency(frequency);
    }
  };

  // 바 데이터 포인트 렌더링을 위한 함수
  const renderBarForDataPoint = (dataPoint: LogLevelData, index: number, chartData: LogLevelData[], dateRange: { from?: string; to?: string }) => {
    // 레이블 표시 빈도에 따라 레이블 표시 여부 결정
    const showLabel = index % labelFrequency === 0;

    // 현재 데이터 포인트가 보이는 시간 범위와 겹치는지 확인
    const isHighlighted = visibleTimeRange.start && visibleTimeRange.end &&
      isRangeOverlapping(dataPoint.start, dataPoint.end, visibleTimeRange.start, visibleTimeRange.end);

    // 하이라이트된 연속된 영역의 시작과 끝 확인
    const isHighlightStart = isHighlighted &&
      (index === 0 || !(visibleTimeRange.start && visibleTimeRange.end &&
        isRangeOverlapping(chartData[index - 1].start, chartData[index - 1].end, visibleTimeRange.start, visibleTimeRange.end)));

    const isHighlightEnd = isHighlighted &&
      (index === chartData.length - 1 || !(visibleTimeRange.start && visibleTimeRange.end &&
        isRangeOverlapping(chartData[index + 1].start, chartData[index + 1].end, visibleTimeRange.start, visibleTimeRange.end)));

    // 날짜가 변경되는 지점 확인
    const isDateChange = index > 0 && dataPoint.start.getDate() !== chartData[index - 1].start.getDate();
    // 월이 변경되는 지점 확인
    const isMonthChange = index > 0 && (dataPoint.start.getMonth() !== chartData[index - 1].start.getMonth() || dataPoint.start.getFullYear() !== chartData[index - 1].start.getFullYear());
    // 주가 변경되는 지점 확인
    const isWeekChange = index > 0 && dataPoint.start.getDate() - dataPoint.start.getDay() !== chartData[index - 1].start.getDate() - chartData[index - 1].start.getDay();
    // 년도가 변경되는 지점 확인
    const isYearChange = index > 0 && dataPoint.start.getFullYear() !== chartData[index - 1].start.getFullYear();

    const { unit } = getIntervalUnit(new Date(dateRange?.from || new Date()), new Date(dateRange?.to || new Date()));
    let showDateChangeLine = false;
    switch (unit) {
      case 'minute':
      case 'hour':
        // 시간 단위일 경우 날짜 변경 지점에 세로선 표시
        showDateChangeLine = isDateChange;
        break;
      case 'day':
        // 일 단위일 경우 주 변경 지점에 세로선 표시
        showDateChangeLine = isMonthChange;
        break;
      case 'week':
        // 주 단위일 경우 월 변경 지점에 세로선 표시
        showDateChangeLine = isMonthChange;
        break;
      case 'month':
        // 월 단위일 경우 년 변경 지점에 세로선 표시
        showDateChangeLine = isYearChange;
        break;
      default:
        showDateChangeLine = isDateChange;
        break;
    }

    // 로그 데이터가 있는지 확인 (모든 레벨의 합계가 0보다 큰지 확인)
    const totalLogs = Object.entries(dataPoint)
      .filter(([key]) => !['label', 'start', 'end'].includes(key))
      .reduce((sum, [_, count]) => sum + count, 0);

    // 해당 시간대의 최대 로그 수 계산 (모든 레벨의 합계 중 최대값)
    const maxLogsInTimeRange = Math.max(
      1, // 최소값을 1로 설정하여 0으로 나누는 경우를 방지
      ...chartData.map(d =>
        Object.entries(d)
          .filter(([key]) => !['label', 'start', 'end'].includes(key))
          .reduce((sum, [_, count]) => sum + count, 0)
      )
    );

    // 막대 높이 계산
    const barHeight = calculateBarHeight(totalLogs, maxLogsInTimeRange);

    return {
      showLabel,
      isHighlighted,
      isHighlightStart,
      isHighlightEnd,
      showDateChangeLine,
      totalLogs,
      barHeight,
      maxLogsInTimeRange
    };
  };

  // 차트 리사이즈를 위한 ref
  const chartRef = useRef<HTMLDivElement>(null);

  // 차트 너비 감지를 위한 effect
  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        const newWidth = chartRef.current.offsetWidth;
        if (newWidth !== chartWidth) {
          setChartWidth(newWidth);
          updateLabelFrequency(newWidth);
        }
      }
    };

    // 초기 너비 설정
    updateWidth();

    // ResizeObserver를 사용하여 너비 변화 감지
    if (chartRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        // entries 배열의 첫 번째 요소에서 컨텐츠 박스 크기 가져오기
        const entry = entries[0];
        if (entry && entry.contentBoxSize) {
          const newWidth = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0].inlineSize
            : (entry.contentBoxSize as any).inlineSize;

          if (newWidth !== chartWidth) {
            setChartWidth(newWidth);
            updateLabelFrequency(newWidth);
          }
        } else {
          // fallback: contentRect 사용
          const newWidth = entry.contentRect.width;
          if (newWidth !== chartWidth) {
            setChartWidth(newWidth);
            updateLabelFrequency(newWidth);
          }
        }
      });

      resizeObserver.observe(chartRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [chartWidth, setChartWidth, updateLabelFrequency]);

  // 로그 데이터 변경 시 차트 데이터 업데이트
  useEffect(() => {
    updateChartData();
  }, [logs, dateRange]);

  // 차트 너비 변경 시 레이블 빈도 업데이트
  useEffect(() => {
    updateLabelFrequency(chartWidth);
  }, [chartWidth, chartData]);

  return {
    chartData,
    chartWidth,
    labelFrequency,
    setChartWidth,
    renderBarForDataPoint,
    chartRef,
    visibleTimeRange,
    dateRange,
    logs,
    showTooltip,
    hideTooltip
  };
};
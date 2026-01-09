export interface LogEntry {
  [key: string]: any;
}

// 필터 타입 정의
export interface Filters {
  level: string[];
  category: string[];
  search: string;
  method: string[];
  statusCode: string[];
  host: string;
  path: string;
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

// 로그 레벨 차트 데이터 타입 정의
export interface LogLevelData {
  label: string;
  trace: number;
  debug: number;
  info: number;
  success: number;
  warn: number;
  error: number;
  fatal: number;
  start: Date;
  end: Date;
}

export interface TimeRange {
  label: string;
  start: Date;
  end: Date;
}

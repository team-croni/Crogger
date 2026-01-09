'use client';

import { LogEntry } from '@/types/log';
import { LOG_COLUMN_WIDTHS } from '@constants/logColumnWidths';
import { getLevelStyle, highlightSearchTerm } from '@utils/logLevelUtils';
import { useMemo } from 'react';

interface LogItemProps {
  log: LogEntry;
  index?: number;
  onClick?: () => void;
  searchTerm?: string;
}

// 필요한 필드들만 추출 (로그 테이블 렌더링용 필드 선별 규칙 준수)
export const getExtractedLog = (log: LogEntry) => {
  if (!log) return null;

  return {
    level: String(log.level || log.message?.split(' ')[0] || 'info'),
    time: log._time || log.time || '',
    category: log['fields.category'] || log.category || log.source || log['platform.source'] || 'unknown',
    message: log.message || log.msg || '',
    method: log['fields.request.method'] || log['request.method'],
    statusCode: log['fields.statusCode'] || log['fields.response.statusCode'] || log['fields.error.statusCode'] || log['fields.request.statusCode'] || log['request.statusCode'],
    path: log['fields.path'] || log['fields.request.path'] || log['fields.request.url'],
    host: log['fields.host'] || log['fields.request.origin'] || log['fields.request.headers.host'] || log['request.host'],
    userAgent: log['fields.request.userAgent'] || log['fields.request.headers.userAgent'] || log['request.userAgent'] || log['fields.request.headers["user-agent"]'],
    ip: log['fields.request.ip'] || log['request.ip'],
    environment: log['fields.request.environment'] || log['platform.environment']
  };
}

// HTTP 상태 코드별 색상 설정
const getStatusCodeColor = (statusCode: number | string) => {
  const code = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;

  if (isNaN(code)) return 'muted-foreground';

  if (code >= 200 && code < 300) return 'green-400';
  if (code >= 300 && code < 400) return 'blue-400';
  if (code >= 400 && code < 500) return 'yellow-400';
  if (code >= 500) return 'red-600';

  return 'muted-foreground';
};

// HTTP 메서드별 색상 설정
const getMethodColor = (method: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'text-green-600';
    case 'POST':
      return 'text-blue-600';
    case 'PUT':
      return 'text-green-700';
    case 'DELETE':
      return 'text-red-500';
    case 'PATCH':
      return 'text-purple-500';
    default:
      return 'text-muted-foreground';
  }
};

const LogItem = ({ log, index, onClick, searchTerm = '' }: LogItemProps) => {
  const extractedLog = getExtractedLog(log);

  // 하이라이트된 메시지를 메모이제이션
  const highlightedMessage = useMemo(() => {
    if (!searchTerm) return extractedLog.message;
    return highlightSearchTerm(extractedLog.message, searchTerm);
  }, [extractedLog.message, searchTerm]);

  // 시간 포맷팅
  const formatTime = (time: string) => {
    try {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return time;
    }
  };

  // User Agent를 간단하게 표시
  const formatUserAgent = (userAgent?: string) => {
    if (!userAgent) return '';

    // 브라우저 이름 추출
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';

    // 기본적으로 앞부분 20자만 표시
    return userAgent.substring(0, 20) + (userAgent.length > 20 ? '...' : '');
  };

  // 디바이스 정보 추출
  const getDeviceType = (userAgent?: string) => {
    if (!userAgent) return '';

    if (/mobile|android|iphone|ipod|opera mini/i.test(userAgent)) return '📱';
    if (/tablet|ipad/i.test(userAgent)) return '💻';
    return '🖥️';
  };

  return (
    <div
      className="flex items-center hover:bg-muted/50 cursor-pointer font-medium"
      onClick={onClick}
    >
      <div className={`shrink-0 px-6 py-2 whitespace-nowrap text-xs text-foreground truncate ${LOG_COLUMN_WIDTHS.time}`}>
        {formatTime(extractedLog.time)}
      </div>
      <div className={`flex items-center shrink-0 px-6 whitespace-nowrap ${LOG_COLUMN_WIDTHS.level}`}>
        <div className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium uppercase ${getLevelStyle(extractedLog.level)}`}>
          {extractedLog.level}
        </div>
      </div>
      <div className={`flex items-center shrink-0 px-6 whitespace-nowrap ${LOG_COLUMN_WIDTHS.category}`}>
        <span className="text-xs font-medium text-muted-foreground bg-inverse/40 px-2 py-0.5 rounded">
          {extractedLog.category}
        </span>
      </div>
      <div className={`shrink-0 px-6 py-2 text-xs font-medium text-muted-foreground ${LOG_COLUMN_WIDTHS.userAgent}`}>
        <div className="wrap-break-word max-w-lg truncate">
          {formatUserAgent(extractedLog.userAgent)} <span className='ml-1'>{getDeviceType(extractedLog.userAgent)}</span>
        </div>
      </div>
      <div className={`shrink-0 px-6 py-2 text-xs font-medium text-foreground ${LOG_COLUMN_WIDTHS.host}`}>
        <div className="wrap-break-word max-w-lg truncate">
          {extractedLog.host || ''}
        </div>
      </div>
      <div className={`shrink-0 px-6 py-2 whitespace-nowrap text-sm ${LOG_COLUMN_WIDTHS.status} text-${getStatusCodeColor(extractedLog.statusCode || '200')}`}>
        <span className={`font-mono text-xs text-center truncate px-2 py-0.5`}>
          {extractedLog.statusCode || '200'}
        </span>
      </div>
      <div className={`shrink-0 px-6 py-2 text-xs font-medium text-foreground ${LOG_COLUMN_WIDTHS.path}`}>
        <div className="wrap-break-word max-w-lg truncate">
          <span className={`mr-1.5 ${getMethodColor(extractedLog.method || '')}`}>{extractedLog.method || ''}</span> {extractedLog.path || ''}
        </div>
      </div>
      <div className={`shrink-0 px-6 py-2 text-xs font-medium text-foreground ${LOG_COLUMN_WIDTHS.message}`}>
        <div className="wrap-break-word max-w-lg truncate" dangerouslySetInnerHTML={{ __html: highlightedMessage }} />
      </div>
    </div>
  );
}

export default LogItem;
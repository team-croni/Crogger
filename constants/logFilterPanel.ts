export const LOG_LEVELS = [
  { value: 'trace', label: 'TRACE' },
  { value: 'debug', label: 'DEBUG' },
  { value: 'info', label: 'INFO' },
  { value: 'success', label: 'SUCCESS' },
  { value: 'warn', label: 'WARN' },
  { value: 'error', label: 'ERROR' },
  { value: 'fatal', label: 'FATAL' },
];

export const LOG_CATEGORIES = [
  { value: 'APP', label: 'App' },
  { value: 'SERVER', label: 'Server' },
  { value: 'DATABASE', label: 'Database' },
  { value: 'SOCKET', label: 'Socket' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'SCHEDULER', label: 'Scheduler' },
];

export const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
];

export const STATUS_CODE_RANGES = [
  { value: '2xx', label: '2xx success' },
  { value: '3xx', label: '3xx redirect' },
  { value: '4xx', label: '4xx client error' },
  { value: '5xx', label: '5xx server error' },
];

// 날짜 범위 필터 옵션
export const DATE_RANGE_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: '3 Days', value: '3days' },
  { label: '7 Days', value: '7days' },
  { label: '30 Days', value: '30days' },
];
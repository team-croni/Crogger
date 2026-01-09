import { LogEntry } from '@/types/log';

const CATEGORIES = ['auth', 'payment', 'user-management', 'order', 'inventory', 'notification', 'analytics', 'file-storage'];
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const HOSTS = [
  'api.crogger.io', 'auth.crogger.io', 'payment.crogger.io',
  'files.crogger.io', 'notifications.crogger.io', 'admin.crogger.io'
];
const PATHS = [
  '/api/v1/users', '/api/v1/login', '/api/v1/logout', '/api/v1/register',
  '/api/v1/products', '/api/v1/orders', '/api/v1/payment/process',
  '/api/v1/payment/webhook', '/api/v1/auth/refresh', '/api/v1/files/upload',
  '/api/v1/files/download', '/api/v1/notifications', '/api/v1/settings',
  '/api/v1/profile', '/api/v1/health', '/api/v1/analytics/dashboard', '/api/v1/inventory/check'
];
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0'
];
const MESSAGES = [
  'User authenticated successfully', 'Payment processed successfully', 'Order created successfully',
  'File uploaded successfully', 'Notification sent successfully', 'Failed to connect to payment gateway',
  'User registration completed', 'Password reset initiated', 'Two-factor authentication enabled',
  'Account suspended for security reasons', 'API rate limit exceeded', 'Invalid request parameters',
  'Resource not found', 'Internal server error occurred', 'Database connection timeout',
  'Cache miss detected', 'Session expired', 'Security violation detected', 'Database query executed',
  'Background job started', 'Configuration updated', 'Health check passed', 'Memory usage high',
  'Disk space low', 'Connection pool exhausted', 'Third-party service unavailable',
  'SSL certificate renewal required', 'Backup completed successfully', 'Scheduled maintenance started',
  'User profile updated'
];

const generateIP = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');

/**
 * 타임스탬프를 생성하여 최신순 정렬을 보장하는 함수입니다.
 *
 * @param {number} index - 현재 로그의 인덱스
 * @param {number} total - 전체 로그 개수
 * @returns {string} ISO 형식의 타임스탬프 문자열
 */
const generateSortedRandomTime = (index: number, total: number) => {
  const now = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  // 1. 인덱스에 따라 시간을 선형적으로 배분 (index 0일수록 현재에 가깝게)
  // 정렬 순서를 엄격히 지키기 위해 index 비중을 먼저 계산합니다.
  const timeOffset = (index / total) * SEVEN_DAYS_MS;
  let logTime = new Date(now.getTime() - timeOffset);

  // 2. 낮 시간대(09~18시) 가중치 부여
  // 시간이 만약 밤 시간대라면 60% 확률로 낮 시간대로 살짝 조정 (단, 정렬 순서 유지를 위해 미세 조정)
  const hour = logTime.getHours();
  if ((hour < 9 || hour > 18) && Math.random() < 0.6) {
    // 순서 역전을 방지하기 위해 해당 날짜의 낮 시간 범위 내에서만 무작위 조정
    logTime.setHours(Math.floor(Math.random() * 10) + 9);
  }

  // 3. 미세 지터(Jitter) 추가 (로그 간의 겹침 방지, 평균 간격의 50% 이내)
  const averageInterval = SEVEN_DAYS_MS / total;
  const jitter = (Math.random() - 0.5) * (averageInterval * 0.5);

  return new Date(logTime.getTime() + jitter).toISOString();
};

/**
 * 더미 로그 항목을 생성하는 함수입니다.
 *
 * @param {number} index - 현재 로그의 인덱스
 * @param {number} total - 전체 로그 개수
 * @returns {LogEntry} 생성된 로그 항목
 */
export const generateDummyLog = (index: number, total: number): LogEntry => {
  const getRandomLogLevel = () => {
    const rand = Math.random();
    if (rand < 0.7) return 'info';
    if (rand < 0.9) return 'warn';
    return 'error';
  };

  const getStatusCodeByLevel = (logLevel: string) => {
    if (logLevel === 'info') return [200, 201, 204, 301, 302][Math.floor(Math.random() * 5)];
    if (logLevel === 'warn') return [400, 401, 403, 404, 422][Math.floor(Math.random() * 5)];
    return [400, 401, 403, 404, 422, 500, 502, 503][Math.floor(Math.random() * 8)];
  };

  const level = getRandomLogLevel();
  const statusCode = getStatusCodeByLevel(level);

  return {
    _time: generateSortedRandomTime(index, total),
    level,
    message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    'fields.category': CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    'fields.request.method': HTTP_METHODS[Math.floor(Math.random() * HTTP_METHODS.length)],
    'fields.statusCode': statusCode,
    'fields.request.path': PATHS[Math.floor(Math.random() * PATHS.length)],
    'fields.host': HOSTS[Math.floor(Math.random() * HOSTS.length)],
    'fields.request.userAgent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    'fields.request.ip': generateIP(),
    'request.id': `req-${Math.random().toString(36).substring(2, 15)}`,
    'user.id': Math.floor(Math.random() * 10000),
    duration: Math.floor(Math.random() * 1000),
    ...(level === 'error' ? { 'fields.error.message': 'An error occurred' } : {}),
    ...(level === 'warn' ? { 'fields.warning.message': 'Warning message' } : {}),
  };
};

/**
 * 지정된 개수만큼 더미 로그 배열을 생성하는 함수입니다.
 *
 * @param {number} count - 생성할 로그 개수
 * @returns {LogEntry[]} 생성된 로그 항목 배열
 */
export const generateDummyLogs = (count: number): LogEntry[] => {
  const logs = Array.from({ length: count }, (_, index) => generateDummyLog(index, count));

  // 최종적으로 타임스탬프 기준 내림차순(최신순) 정렬 보장
  return logs.sort((a, b) => new Date(b._time).getTime() - new Date(a._time).getTime());
};

/**
 * 지정된 개수만큼 더미 로그를 가져오는 함수입니다. 기본값은 1024개입니다.
 *
 * @param {number} count - 생성할 로그 개수 (기본값: 1024)
 * @returns {LogEntry[]} 생성된 로그 항목 배열
 */
export const getDummyLogs = (count: number = 1024): LogEntry[] => {
  return generateDummyLogs(count);
};
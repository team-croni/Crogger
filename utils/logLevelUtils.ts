/**
 * 로그 레벨에 따라 적절한 CSS 클래스 스타일을 반환하는 함수입니다.
 *
 * @param {string} level - 로그 레벨
 * @returns {string} CSS 클래스 문자열
 */
export const getLevelStyle = (level: string) => {
  switch (level.toLowerCase()) {
    case 'trace':
      return 'bg-gray-300 dark:bg-gray-500 text-white';
    case 'debug':
      return 'bg-gray-400 dark:bg-gray-400 text-white';
    case 'info':
      return 'bg-blue-500 dark:bg-blue-900 text-white';
    case 'success':
      return 'bg-green-600 dark:bg-green-500 text-white';
    case 'warn':
      return 'bg-yellow-300 dark:bg-yellow-500 text-black';
    case 'error':
      return 'bg-red-500 dark:bg-red-900 text-white';
    case 'fatal':
      return 'bg-orange-600 dark:bg-red-700 text-white';
    default:
      return 'dark:bg-gray-300 text-black';
  }
};

/**
 * 로그 레벨에 따라 텍스트 전용 CSS 클래스 스타일을 반환하는 함수입니다.
 *
 * @param {string} level - 로그 레벨
 * @returns {string} 텍스트 스타일 CSS 클래스 문자열
 */
export const getLevelTextStyle = (level: string) => {
  switch (level.toLowerCase()) {
    case 'trace':
      return 'text-gray-600 dark:text-gray-500';
    case 'debug':
      return 'text-gray-600 dark:text-gray-400';
    case 'info':
      return 'text-blue-500 dark:text-blue-300';
    case 'success':
      return 'text-green-600 dark:text-green-500';
    case 'warn':
      return 'text-yellow-600 dark:text-yellow-500';
    case 'error':
      return 'text-red-500 dark:text-red-500';
    case 'fatal':
      return 'text-red-700 dark:text-red-500';
    default:
      return 'text-gray-600 dark:text-gray-500';
  }
};

/**
 * 텍스트에서 검색어를 찾아 하이라이트 처리하는 함수입니다.
 *
 * @param {string} text - 하이라이트를 적용할 원본 텍스트
 * @param {string} searchTerm - 하이라이트할 검색어
 * @returns {string} 하이라이트 처리된 HTML 문자열
 */
export const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;

  // 검색어를 포함하는 부분을 하이라이트 처리
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ?
      `<mark class="bg-yellow-200 dark:bg-yellow-700">${part}</mark>` :
      part
  ).join('');
};

/**
 * 로그 레벨에 따라 적절한 이모지를 반환하는 함수입니다.
 *
 * @param {string} level - 로그 레벨
 * @returns {string} 로그 레벨에 해당하는 이모지
 */
export const getLevelEmoji = (level: string) => {
  switch (level.toLowerCase()) {
    case 'trace':
      return '🔍';
    case 'debug':
      return '🐛';
    case 'info':
      return '💡';
    case 'success':
      return '✅';
    case 'warn':
      return '⚠️';
    case 'error':
      return '❌';
    case 'fatal':
      return '💀';
    default:
      return '📝';
  }
};
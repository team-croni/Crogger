/**
 * 사용자 에이전트 문자열을 기반으로 디바이스 유형을 식별하는 함수입니다.
 *
 * @param {string} userAgent - 사용자 에이전트 문자열
 * @returns {string} 디바이스 유형 (Mobile, Tablet, Desktop 중 하나)
 */
export const getDeviceType = (userAgent: string) => {
  if (!userAgent) return '-';

  if (/mobile|android|iphone|ipod|opera mini/i.test(userAgent)) return '📱 Mobile';
  if (/tablet|ipad/i.test(userAgent)) return '💻 Tablet';
  return '🖥️ Desktop';
};

/**
 * 값이 null 또는 undefined인지 확인하는 함수입니다.
 *
 * @param {*} value - 확인할 값
 * @returns {boolean} 값이 null 또는 undefined이면 true, 그렇지 않으면 false
 */
export const isNullish = (value: any): boolean => {
  return value === null || value === undefined;
};

/**
 * 주어진 키-값 쌍 배열을 키의 첫 번째 부분을 기준으로 그룹화하는 함수입니다.
 * 키가 '.'으로 구분된 경우 첫 번째 부분을 그룹 이름으로 사용합니다.
 *
 * @param {[string, any][]} entries - 키-값 쌍 배열
 * @returns {Record<string, [string, any][]>} 그룹화된 키-값 쌍 객체
 */
export const groupFields = (entries: [string, any][]): Record<string, [string, any][]> => {
  const groups: Record<string, [string, any][]> = {};

  entries.forEach(([key, value]) => {
    // 키를 '.' 기준으로 분리하여 그룹 결정
    const parts = key.split('.');
    const group = parts.length > 1 ? parts[0] : 'root';

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push([key, value]);
  });

  return groups;
};
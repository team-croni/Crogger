import { Filters } from "@/types/log";

/**
 * 주어진 날짜를 로컬 날짜 형식(YYYY-MM-DD)으로 포맷팅하는 함수입니다.
 *
 * @param {Date} date - 포맷팅할 날짜 객체
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const formatDateToLocal = (date: Date): string => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
};

/**
 * 기본 필터 값을 생성하는 함수입니다.
 * 오늘 날짜 범위와 모든 필터 옵션이 초기 상태로 설정됩니다.
 *
 * @returns {Filters} 기본 필터 설정 객체
 */
export const getDefaultFilters = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const defaultFilters: Filters = {
    level: [],
    category: [],
    search: '',
    method: [],
    statusCode: [],
    host: '',
    path: '',
    dateRange: {
      from: formatDateToLocal(today),
      to: formatDateToLocal(endOfDay)
    }
  };

  return defaultFilters;
};

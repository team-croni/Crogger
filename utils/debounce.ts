/**
 * 주어진 함수의 실행을 지정된 지연 시간 동안 지연시키는 디바운싱 함수입니다.
 * 일정 시간 동안 함수 호출이 없을 때에만 실제 함수가 실행됩니다.
 *
 * @template T - 디바운스할 함수의 타입
 * @param {T} func - 디바운스할 함수
 * @param {number} delay - 디바운스 지연 시간 (밀리초)
 * @returns {(...args: Parameters<T>) => void} 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
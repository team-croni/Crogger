import { LogEntry } from '@/types/log';
import { getExtractedLog } from '@components/log-list/log-item';

/**
 * 로그 데이터를 CSV 형식의 문자열로 변환하는 함수입니다.
 *
 * @param {LogEntry[]} logs - 변환할 로그 항목 배열
 * @returns {string} CSV 형식의 문자열
 */
export const convertToCSV = (logs: LogEntry[]): string => {
  if (logs.length === 0) return '';

  // CSV 헤더 생성
  const headers = ['Timestamp', 'Level', 'Category', 'Message', 'Method', 'Status Code', 'Host', 'User Agent'];
  let csvContent = headers.join(',') + '\n';

  // 로그 데이터를 CSV 형식으로 변환
  logs.forEach(log => {
    const extractedLog = getExtractedLog(log);

    const row = [
      `"${extractedLog.time}"`,
      `"${extractedLog.level}"`,
      `"${extractedLog.category}"`,
      extractedLog.userAgent ? `"${extractedLog.userAgent.replace(/"/g, '""')}"` : '""',
      `"${extractedLog.host}"`,
      `"${extractedLog.statusCode}"`,
      `"${extractedLog.method}"`,
      `"${extractedLog.path}"`,
      `"${extractedLog.message.replace(/"/g, '""')}"`,
    ].join(',');

    csvContent += row + '\n';
  });

  return csvContent;
};

/**
 * 로그 데이터를 JSON 형식의 문자열로 변환하는 함수입니다.
 *
 * @param {LogEntry[]} logs - 변환할 로그 항목 배열
 * @returns {string} JSON 형식의 문자열
 */
export const convertToJSON = (logs: LogEntry[]): string => {
  return JSON.stringify(logs, null, 2);
};

/**
 * 지정된 내용과 파일 이름으로 로그 데이터를 다운로드하는 함수입니다.
 *
 * @param {string} content - 다운로드할 내용
 * @param {string} filename - 다운로드할 파일 이름
 * @param {string} mimeType - 파일의 MIME 타입
 */
export const downloadLogs = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
import { useState } from 'react';
import { LogEntry } from '@/types/log';
import { convertToCSV, convertToJSON, downloadLogs } from '@utils/logExportUtils';

// 로그 내보내기 기능을 관리하는 훅
// 파일 이름 생성 함수
const generateFileName = (format: 'csv' | 'json'): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  return `logs_${timestamp}.${format}`;
};

export const useLogExport = (logs: LogEntry[]) => {
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  const handleDownload = (format: 'csv' | 'json') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      content = convertToCSV(logs);
      filename = generateFileName('csv');
      mimeType = 'text/csv;charset=utf-8;';
    } else if (format === 'json') {
      content = convertToJSON(logs);
      filename = generateFileName('json');
      mimeType = 'application/json;charset=utf-8;';
    }

    downloadLogs(content, filename, mimeType);
  };

  return {
    isDownloadDropdownOpen,
    setIsDownloadDropdownOpen,
    handleDownload
  };
};
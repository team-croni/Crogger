import { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useLogExport } from '@hooks/useLogExport';
import { useLogStore } from '@stores/logStore';
import Portal from '@components/ui/portal';

const DownloadButton = () => {
  const { logs } = useLogStore();
  const { isDownloadDropdownOpen, setIsDownloadDropdownOpen, handleDownload } = useLogExport(logs);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDownloadDropdownOpen && menuRef.current && downloadDropdownRef.current) {
      const triggerRect = downloadDropdownRef.current.getBoundingClientRect();
      const menu = menuRef.current;

      // 위치 계산: 오른쪽 하단에 배치
      const top = triggerRect.bottom;
      const left = triggerRect.right - menu.offsetWidth;

      // 포지셔닝 적용
      menu.style.position = 'fixed';
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;

      // 뷰포트 경계 체크 및 조정
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 왼쪽으로 벗어나는 경우 왼쪽 정렬
      if (left < 0) {
        menu.style.left = `${triggerRect.left}px`;
      }

      // 오른쪽으로 벗어나는 경우 오른쪽 정렬
      if (triggerRect.right > viewportWidth) {
        menu.style.left = `${triggerRect.right - menu.offsetWidth}px`;
      }

      // 아래로 벗어나는 경우 위쪽 배치
      if (top + menu.offsetHeight > viewportHeight) {
        menu.style.top = `${triggerRect.top - menu.offsetHeight}px`;
      }
    }
  }, [isDownloadDropdownOpen]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsDownloadDropdownOpen]);

  return (
    <div className="relative" ref={downloadDropdownRef}>
      <button
        type="button"
        className={`flex items-center bg-input px-2.5 py-2.5 border text-foreground text-sm rounded-lg ${isDownloadDropdownOpen ? 'border-primary' : 'border-input-border hover:border-muted-foreground/50'}`}
        onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
      >
        <Download className="w-4 h-4" />
      </button>

      <Portal selector="body">
        <div
          ref={menuRef}
          className={`flex flex-col gap-1 absolute right-0 mt-1.5 w-42 p-1.5 bg-input border border-input-border rounded-xl shadow-xl/8 z-50 transition-all ${isDownloadDropdownOpen ? '' : 'translate-y-1.5 opacity-0 pointer-events-none'}`}
        >
          <button
            onClick={() => {
              handleDownload('csv');
              setIsDownloadDropdownOpen(false);
            }}
            className="px-3 py-2 text-sm rounded whitespace-nowrap text-foreground text-left hover:bg-primary/8 dark:hover:bg-muted-foreground/10"
          >
            <span className='font-medium'>CSV</span>로 다운로드
          </button>
          <button
            onClick={() => {
              handleDownload('json');
              setIsDownloadDropdownOpen(false);
            }}
            className="px-3 py-2 text-sm rounded whitespace-nowrap text-foreground text-left hover:bg-primary/8 dark:hover:bg-muted-foreground/10"
          >
            <span className='font-medium'>JSON</span>으로 다운로드
          </button>
        </div>
      </Portal>
    </div>
  );
};

export default DownloadButton;
'use client';

import { getLevelStyle } from '@utils/logLevelUtils';
import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { useLogDetailStore } from '@stores/logDetailStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getDeviceType, groupFields } from '@utils/logDetailModal';
import { getExtractedLog } from '@components/log-list/log-item';
import { LogJsonRenderer } from '@components/log-list';

const LogDetailModal = () => {
  const { selectedLog, isOpen, closeModal } = useLogDetailStore();

  const [viewMode, setViewMode] = useState<"structured" | "json">("structured");
  const [isCopied, setIsCopied] = useState(false);

  // 로그가 이미 선택된 상태이므로 이 조건문은 삭제
  const extractedLog = getExtractedLog(selectedLog);

  // 컴포넌트가 열려있지 않거나 선택된 로그가 없으면 아무것도 렌더링하지 않음
  if (!isOpen || !selectedLog) return null;

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

  // 로그 데이터에서 필드 그룹화
  const logEntries = Object.entries(selectedLog);
  const groupedFields = groupFields(logEntries);

  // JSON 데이터 복사 기능
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs fade-in" onClick={closeModal}>
      <div className="bg-background rounded-2xl border shadow-lg w-full max-w-xl h-[85vh] overflow-hidden flex flex-col slide-up" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-border">
          <h3 className="font-medium text-foreground">로그 상세 정보</h3>
          <button
            onClick={closeModal}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 뷰 모드 전환 탭 */}
        <div className="flex border-b border-border">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${viewMode === 'structured'
              ? 'text-foreground border-b-2 border-muted-foreground/50'
              : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
              }`}
            onClick={() => setViewMode('structured')}
          >
            구조화 보기
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${viewMode === 'json'
              ? 'text-foreground border-b-2 border-muted-foreground/50'
              : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
              }`}
            onClick={() => setViewMode('json')}
          >
            JSON 보기
          </button>
        </div>

        {/* 모달 본문 */}
        {viewMode === 'structured' ? (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className='flex flex-col items-start'>
                <label className="text-xs font-medium text-muted-foreground uppercase">LEVEL</label>
                <div className={`mt-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase ${getLevelStyle(extractedLog.level)}`}>
                  {extractedLog.level}
                </div>
              </div>
              <div className='flex flex-col items-start'>
                <label className="text-xs font-medium text-muted-foreground uppercase">CATEGORY</label>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {extractedLog.category}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">TIME</label>
                <div className="mt-1 text-sm text-foreground">
                  {formatTime(extractedLog.time)}
                </div>
              </div>
              {extractedLog.method && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">METHOD</label>
                  <div className="mt-1 text-sm text-foreground font-mono">
                    {extractedLog.method}
                  </div>
                </div>
              )}
              {extractedLog.path && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">PATH</label>
                  <div className="mt-1 text-sm text-foreground font-mono wrap-break-word">
                    {extractedLog.path}
                  </div>
                </div>
              )}
              {extractedLog.statusCode && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">STATUS CODE</label>
                  <div className="mt-1 text-sm text-foreground font-mono">
                    {extractedLog.statusCode}
                  </div>
                </div>
              )}
              {extractedLog.ip && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">IP</label>
                  <div className="mt-1 text-sm text-foreground">
                    {extractedLog.ip}
                  </div>
                </div>
              )}
              {extractedLog.host && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">HOST</label>
                  <div className="mt-1 text-sm text-foreground">
                    {extractedLog.host}
                  </div>
                </div>
              )}
              {extractedLog.userAgent && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">DEVICE</label>
                  <div className="mt-1 text-sm text-foreground">
                    {getDeviceType(extractedLog.userAgent)}
                  </div>
                </div>
              )}
              {extractedLog.userAgent && (
                <div className="col-span-3">
                  <label className="text-xs font-medium text-muted-foreground uppercase">USER AGENT</label>
                  <div className="mt-1 text-sm text-foreground wrap-break-word">
                    {extractedLog.userAgent}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium text-muted-foreground uppercase">MESSAGE</label>
              <div className="mt-1 px-3 py-2 bg-foreground/4 dark:bg-inverse/20 rounded-lg text-sm text-foreground wrap-break-word">
                {extractedLog.message}
              </div>
            </div>

            {/* 추가 데이터 섹션 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase">ADDITIONAL DATA</label>
              <div className="mt-2 space-y-4">
                {Object.entries(groupedFields).map(([groupName, fields]) => {
                  // 기본 그룹(root)은 제외하고 표시
                  if (groupName === 'root') return null;

                  if (fields.length === 0) return null;

                  return (
                    <div key={groupName} className="border-l-2 border-muted pl-3">
                      <h4 className="text-sm font-medium text-foreground capitalize mb-2">{groupName}</h4>
                      <div className="space-y-2">
                        {fields.map(([key, value]) => {
                          // 키에서 그룹명 제거
                          const displayName = key.startsWith(`${groupName}.`) ? key.substring(`${groupName}.`.length) : key;

                          return (
                            <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-3 px-3 py-2 bg-foreground/4 dark:bg-inverse/20 rounded-lg text-sm">
                              <span className="shrink-0 font-medium text-muted-foreground min-w-30">{displayName}</span>
                              <div className="flex-1 text-foreground break-all">
                                <LogJsonRenderer data={value} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* root 그룹 (그룹화되지 않은 필드들) */}
                {groupedFields.root && (
                  <div className="space-y-2">
                    {groupedFields.root.map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-3 px-3 py-2 bg-foreground/4 dark:bg-inverse/20 rounded-lg text-sm">
                        <span className="shrink-0 font-medium text-muted-foreground min-w-30">{key}</span>
                        <div className="flex-1 text-foreground break-all">
                          <LogJsonRenderer data={value} />
                        </div>
                      </div>
                    ))
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex-1">
            <button
              onClick={copyJsonToClipboard}
              className="absolute top-2 right-5 p-2 text-inverse/70 hover:text-inverse hover:bg-inverse/10 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted-foreground/5 rounded"
              title="복사하기"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-500 fade-in" /> : <Copy className="w-4 h-4 slide-up" />}
            </button>
            <div className="json-container h-[calc(85vh-6.25rem)] p-4 overflow-y-scroll bg-foreground/95 dark:bg-transparent">
              <SyntaxHighlighter
                language="json"
                style={oneDark}
                customStyle={{
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem',
                  padding: 0,
                  margin: 0,
                  textShadow: 'none'
                }}
                codeTagProps={{
                  style: {
                    backgroundColor: 'transparent',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }
                }}
              >
                {JSON.stringify(selectedLog, null, 2)}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogDetailModal;
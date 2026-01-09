import { isNullish } from "@utils/logDetailModal";
import { useState } from "react";

// JSON 데이터를 재귀적으로 렌더링하는 컴포넌트
const LogJsonRenderer = ({ data, level = 0 }: { data: any; level?: number }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // 원시 타입인 경우 직접 반환
  if (data === null || data === undefined || typeof data !== 'object') {
    return <span>{String(data)}</span>;
  }

  // 배열인 경우
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span>[]</span>;
    }

    return (
      <div className="ml-4">
        <div className="cursor-pointer inline-flex items-center" onClick={toggleExpanded}>
          <span className="mr-1 text-xs">{expanded ? '▼' : '▶'}</span>
          <span>[{data.length}]</span>
        </div>
        {expanded && (
          <div className="mt-1">
            {data.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground">[{index}]</span>
                <div className="flex-1">
                  <LogJsonRenderer data={item} level={level + 1} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 객체인 경우
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <span>{"{}"}</span>;
  }

  // nullish 값과 그렇지 않은 값 분리
  const nonNullishEntries = entries.filter(([_, value]) => !isNullish(value));
  const nullishEntries = entries.filter(([_, value]) => isNullish(value));

  // 모든 항목을 정렬 (nullish 값은 마지막으로)
  const sortedEntries = [...nonNullishEntries, ...nullishEntries];

  return (
    <div className="ml-4">
      <div className="cursor-pointer inline-flex items-center" onClick={toggleExpanded}>
        <span className="mr-1">{expanded ? '▼' : '▶'}</span>
        <span>{"{}"}</span>
      </div>
      {expanded && (
        <div className="mt-1 space-y-1">
          {sortedEntries.map(([key, value]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">{key}:</span>
              <div className="flex-1">
                <LogJsonRenderer data={value} level={level + 1} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogJsonRenderer;
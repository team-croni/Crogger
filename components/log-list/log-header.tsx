import { LOG_COLUMN_WIDTHS } from '@constants/logColumnWidths';

const LogHeader = () => {
  return (
    <div className="min-w-352 flex text-xs bg-background font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 z-10 border-b">
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.time}`}>
        TIMESTAMP
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.level}`}>
        LEVEL
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.category}`}>
        CATEGORY
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.userAgent}`}>
        USER AGENT
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.host}`}>
        HOST
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.status}`}>
        STATUS
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.path}`}>
        REQUEST
      </div>
      <div className={`px-6 py-3 shrink-0 ${LOG_COLUMN_WIDTHS.message}`}>
        MESSAGE
      </div>
    </div>
  );
}

export default LogHeader;
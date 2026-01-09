import { STATUS_CODE_RANGES } from '@constants/logFilterPanel';
import { useFilterPanel } from '@hooks/useFilterPanel';

const StatusCodeFilter = () => {
  const { pendingFilters, handleCheckboxChange } = useFilterPanel();

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-3">STATUS CODE</label>
      <div className="grid grid-cols-2 gap-2">
        {STATUS_CODE_RANGES.map((status) => (
          <div key={status.value} className="flex items-center">
            <input
              type="checkbox"
              id={`status-${status.value}`}
              checked={pendingFilters.statusCode.includes(status.value)}
              onChange={(e) => handleCheckboxChange('statusCode', status.value, e.target.checked)}
              className="w-5 h-5 focus:outline-none"
            />
            <label htmlFor={`status-${status.value}`} className="pl-2 text-sm text-foreground cursor-pointer">
              {status.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusCodeFilter;
import { HTTP_METHODS } from '@constants/logFilterPanel';
import { useFilterPanel } from '@hooks/useFilterPanel';

const MethodFilter = () => {
  const { pendingFilters, handleCheckboxChange } = useFilterPanel();

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-3">METHOD</label>
      <div className="grid grid-cols-2 gap-2">
        {HTTP_METHODS.map((method) => (
          <div key={method.value} className="flex items-center">
            <input
              type="checkbox"
              id={`method-${method.value}`}
              checked={pendingFilters.method.includes(method.value)}
              onChange={(e) => handleCheckboxChange('method', method.value, e.target.checked)}
              className="w-5 h-5 focus:outline-none"
            />
            <label htmlFor={`method-${method.value}`} className="pl-2 text-sm text-foreground cursor-pointer">
              {method.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MethodFilter;
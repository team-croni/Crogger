import { LOG_LEVELS } from '@constants/logFilterPanel';
import { useFilterPanel } from '@hooks/useFilterPanel';

const LevelFilter = () => {
  const { pendingFilters, handleCheckboxChange } = useFilterPanel();

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-3">LEVEL</label>
      <div className="grid grid-cols-2 gap-2">
        {LOG_LEVELS.map((level) => (
          <div key={level.value} className="flex items-center">
            <input
              type="checkbox"
              id={`level-${level.value}`}
              checked={pendingFilters.level.includes(level.value)}
              onChange={(e) => handleCheckboxChange('level', level.value, e.target.checked)}
              className="w-5 h-5 focus:outline-none"
            />
            <label htmlFor={`level-${level.value}`} className="pl-2 text-sm text-foreground cursor-pointer">
              {level.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelFilter;
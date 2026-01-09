import { LOG_CATEGORIES } from '@constants/logFilterPanel';
import { useFilterPanel } from '@hooks/useFilterPanel';

const CategoryFilter = () => {
  const { pendingFilters, handleCheckboxChange } = useFilterPanel();

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-3">CATEGORY</label>
      <div className="grid grid-cols-2 gap-2">
        {LOG_CATEGORIES.map((category) => (
          <div key={category.value} className="flex items-center">
            <input
              type="checkbox"
              id={`category-${category.value}`}
              checked={pendingFilters.category.includes(category.value)}
              onChange={(e) => handleCheckboxChange('category', category.value, e.target.checked)}
              className="w-5 h-5 focus:outline-none"
            />
            <label htmlFor={`category-${category.value}`} className="pl-2 text-sm text-foreground cursor-pointer">
              {category.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
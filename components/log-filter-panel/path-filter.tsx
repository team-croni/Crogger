import { useFilterPanel } from "@hooks/useFilterPanel";

const PathFilter = () => {
  const { pendingFilters, handlePendingChange } = useFilterPanel();

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">REQUEST PATH</label>
      <input
        type="text"
        value={pendingFilters.path}
        onChange={(e) => handlePendingChange('path', e.target.value)}
        placeholder="REQUEST PATH 입력..."
        className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-foreground text-sm"
      />
    </div>
  );
};

export default PathFilter;
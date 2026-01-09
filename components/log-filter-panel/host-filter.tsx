import { useFilterPanel } from "@hooks/useFilterPanel";

const HostFilter = () => {
  const { pendingFilters, handlePendingChange } = useFilterPanel();

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">HOST</label>
      <input
        type="text"
        value={pendingFilters.host}
        onChange={(e) => handlePendingChange('host', e.target.value)}
        placeholder="HOST 입력..."
        className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-foreground text-sm"
      />
    </div>
  );
};

export default HostFilter;
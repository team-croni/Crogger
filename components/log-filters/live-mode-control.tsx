import Dropdown from '@components/ui/dropdown';
import { useLogStore } from '@stores/logStore';

const LiveModeControl = () => {
  const { isLiveMode, refreshInterval, setIsLiveMode, setRefreshInterval } = useLogStore();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setIsLiveMode(!isLiveMode)}
        className={`px-3.5 py-2 text-sm rounded-lg flex items-center bg-input ${isLiveMode ? 'border border-destructive/50 hover:border-destructive/70 text-white' : 'border border-input-border hover:border-muted-foreground/50 text-foreground'}`}
      >
        <div className={`w-1.5 h-1.5 mr-2.5 rounded-full ${isLiveMode ? 'bg-destructive' : 'bg-foreground/30'}`}></div>
        Live
      </button>

      {/* Refresh Interval Dropdown */}
      <div className="w-18">
        <Dropdown
          options={[
            { value: '3', label: '3s' },
            { value: '5', label: '5s' },
            { value: '10', label: '10s' },
            { value: '30', label: '30s' },
          ]}
          value={refreshInterval.toString()}
          onChange={(value) => {
            setRefreshInterval(Number(value));
          }}
          placeholder="간격"
          usePortal={true}
          position="bottom-start"
        />
      </div>
    </div>
  );
};

export default LiveModeControl;
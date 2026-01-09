import { useAuthStore } from '@stores/authStore';

interface DatasetListProps {
  onDatasetSelect: (dataset: string) => void;
}

const DatasetList = ({ onDatasetSelect }: DatasetListProps) => {
  const { datasets } = useAuthStore();

  return (
    <div className="bg-background space-y-2 max-h-64 overflow-y-auto pr-2 rounded-lg border border-input-border p-2">
      {datasets.map((dataset) => (
        <div
          key={dataset}
          onClick={() => onDatasetSelect(dataset)}
          className="px-4 py-3 rounded-lg hover:bg-muted-foreground/5 hover:text-foreground cursor-pointer text-left"
        >
          {dataset}
        </div>
      ))}
    </div>
  );
}

export default DatasetList;
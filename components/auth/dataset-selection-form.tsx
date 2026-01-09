'use client';

import { ArrowLeft } from 'lucide-react';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { useAuthStore } from '@stores/authStore';

interface DatasetSelectionFormProps {
  onDatasetSelect: (dataset: string) => void;
}

const DatasetSelectionForm = ({
  onDatasetSelect
}: DatasetSelectionFormProps) => {
  const {
    datasets,
    isDatasetListLoading,
    setStep,
    setToken,
  } = useAuthStore();

  const handleBackToToken = () => {
    setStep('token');
    setToken(''); // 토큰 입력 필드 초기화
  };

  return (
    <div className="fade-in slide-up space-y-4">
      <div className='mb-6'>
        <h3 className="text-xl font-semibold text-foreground mb-2">데이터셋 선택</h3>
        <p className="text-sm text-muted-foreground">접속할 데이터셋을 선택해주세요</p>
      </div>

      {isDatasetListLoading ? (
        <div className="flex justify-center items-center py-10">
          <Ring size={40} color="var(--foreground)" />
        </div>
      ) : datasets.length > 0 ? (
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
      ) : (
        <div className="text-center py-8 text-muted-foreground rounded-lg border border-border/50 p-6">
          사용 가능한 데이터셋이 없습니다.
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={handleBackToToken}
          className="w-full bg-input text-foreground py-3 px-4 rounded-lg border border-input-border hover:border-muted-foreground/50 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Axiom 토큰 재입력
        </button>
      </div>
    </div>
  );
}

export default DatasetSelectionForm;
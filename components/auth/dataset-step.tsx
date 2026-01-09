'use client';

import { useAuthStore } from '@stores/authStore';
import { useAuth } from '@hooks/useAuth';
import { DatasetSelectionForm, LoadingOverlay } from '@components/auth';

const DatasetStep = () => {
  const { step } = useAuthStore();
  const { handleDatasetSelect } = useAuth();

  if (step !== 'datasets') {
    return null;
  }

  return (
    <>
      <DatasetSelectionForm
        onDatasetSelect={handleDatasetSelect}
      />
      <LoadingOverlay forStep="datasets" />
    </>
  );
}

export default DatasetStep;
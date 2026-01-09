'use client'

import { useAuth } from '@hooks/useAuth';
import { TokenStep, DatasetStep } from '@components/auth';

const AuthForm = () => {
  const {
    handleTokenSubmit,
  } = useAuth();

  return (
    <div className="relative bg-sidebar rounded-xl border border-sidebar-border p-8 mt-auto w-full max-w-md shadow-xl/5 dark:shadow-2xl/10 overflow-hidden">
      <form onSubmit={handleTokenSubmit}>
        <TokenStep />
        <DatasetStep />
      </form>
    </div>
  );
}

export default AuthForm;
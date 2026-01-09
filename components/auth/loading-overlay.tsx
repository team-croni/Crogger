import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { useAuthStore } from '@stores/authStore';

interface LoadingOverlayProps {
  size?: number;
  speed?: number;
  stroke?: number;
  message?: string;
  showBackground?: boolean;
  forStep?: 'token' | 'datasets';
}

const LoadingOverlay = ({
  size = 32,
  speed = 2,
  stroke = 3,
  message,
  showBackground = true,
  forStep = 'datasets'
}: LoadingOverlayProps) => {
  const { isLoading, step } = useAuthStore();

  // Show loading indicator only when the current step matches the target step
  const showLoading = isLoading && step === forStep;

  if (!showLoading) {
    return null;
  }

  return (
    <div className={`${showBackground ? 'absolute inset-0 flex items-center justify-center bg-background/70 dark:bg-black/50 fade-in' : 'flex items-center justify-center'}`}>
      <div className="flex flex-col items-center">
        <Ring
          size={size}
          speed={speed}
          stroke={stroke}
          color="var(--color-foreground)"
          bgOpacity={0.2}
        />
        {message && <p className="mt-2 text-sm text-foreground">{message}</p>}
      </div>
    </div>
  );
}

export default LoadingOverlay;
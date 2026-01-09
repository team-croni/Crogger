import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { useAuthStore } from '@stores/authStore';

interface SubmitButtonProps {
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}

const SubmitButton = ({
  buttonText = '확인',
  className = "w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg border border-transparent hover:border-primary disabled:cursor-default slide-up",
  disabled = false
}: SubmitButtonProps) => {
  const { isLoading, selectedDataset } = useAuthStore();

  return (
    <button
      type="submit"
      disabled={disabled || isLoading || !!selectedDataset}
      className={className}
    >
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <Ring
            size="24"
            speed="2"
            stroke={2.5}
            color="var(--color-primary-foreground)"
            bgOpacity={0.2} />
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
}

export default SubmitButton;
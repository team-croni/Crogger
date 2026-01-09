import { useAuthStore } from '@stores/authStore';

interface ErrorMessageProps {
  isVisible?: boolean;
}

const ErrorMessage = ({ isVisible = true }: ErrorMessageProps) => {
  const { error } = useAuthStore();

  if (!error || !isVisible) {
    return null;
  }

  return (
    <p id="token-error" className="-mb-3.5 mt-3.5 text-xs text-center text-destructive slide-up">
      {error}
    </p>
  );
}

export default ErrorMessage;
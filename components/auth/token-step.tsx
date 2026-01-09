import { ErrorMessage, LogoHeader, SubmitButton, TokenInputForm } from '@components/auth';
import { useAuthStore } from '@stores/authStore';

const TokenStep = () => {
  const { step } = useAuthStore();

  if (step !== 'token') {
    return null;
  }

  return (
    <>
      <LogoHeader />
      <TokenInputForm />
      <ErrorMessage />
      <SubmitButton buttonText="확인" />
      <p className="mt-8 text-xs text-center text-muted-foreground/80 font-medium slide-up">
        Axiom API 토큰은{' '}
        <a
          href="https://axiom.co/docs/reference/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 dark:text-blue-500 hover:underline"
        >
          여기
        </a>
        에서 확인할 수 있습니다.
      </p>
    </>
  );
}

export default TokenStep;
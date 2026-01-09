import { AuthForm, Footer } from '@components/auth';
import InfoButton from '@components/header/info-button';
import InfoModal from '@components/header/info-modal';
import ThemeToggle from '@components/header/theme-toggle';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className='flex gap-2 absolute top-4 right-4'>
        <InfoButton />
        <ThemeToggle />
      </div>
      <AuthForm />
      <Footer />
      <InfoModal />
    </div>
  );
}

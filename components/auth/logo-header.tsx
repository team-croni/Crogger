import LogoSymbolSvg from "@svgs/logo.svg";

interface LogoHeaderProps {
  isVisible?: boolean;
}

const LogoHeader = ({ isVisible = true }: LogoHeaderProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center mb-7 slide-up">
      <div className='flex items-center gap-4 pointer-events-none select-none'>
        <LogoSymbolSvg className='h-10 w-10 text-primary' />
        <h1 className="text-[2.5rem] font-semibold font-baloo text-foreground">Crogger</h1>
      </div>
    </div>
  );
}

export default LogoHeader;
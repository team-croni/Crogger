import LogoSymbolSvg from "@svgs/logo.svg";

interface LogoComponentProps {
  className?: string;
}

const LogoComponent = ({ className = 'h-10 w-10 text-primary' }: LogoComponentProps) => {
  return <LogoSymbolSvg className={className} />;
}

export default LogoComponent;
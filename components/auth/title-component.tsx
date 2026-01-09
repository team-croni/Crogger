interface TitleComponentProps {
  className?: string;
}

const TitleComponent = ({ className = "text-[2.5rem] font-semibold font-baloo text-foreground" }: TitleComponentProps) => {
  return <h1 className={className}>Crogger</h1>;
}

export default TitleComponent;
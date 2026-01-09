import { useLogData } from "@hooks/useLogData";

const ErrorToast = () => {
  const { error } = useLogData();

  return (
    <div className={`absolute bottom-20 left-1/2 transform translate-x-[-50%] bg-destructive/80 backdrop-blur-2xl rounded-lg shadow-lg/20 p-4 py-3 z-100 transition-all ${error ? '' : 'translate-y-1.5 opacity-0 pointer-events-none'}`}>
      <p className="text-destructive-foreground">{error}</p>
    </div>
  );
}

export default ErrorToast;
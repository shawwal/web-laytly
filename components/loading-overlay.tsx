import { Loader2 } from 'lucide-react'; // Or another spinner icon from lucide-react

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <Loader2 className="animate-spin text-white w-16 h-16" />
    </div>
  );
};

export default LoadingOverlay;

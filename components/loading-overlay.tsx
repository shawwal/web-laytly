const LoadingOverlay = () => {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default LoadingOverlay;
  
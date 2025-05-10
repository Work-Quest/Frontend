const SkeletonLoading = () => {
    return (
      <div className="animate-pulse">
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-32 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-blue-100 rounded-full"></div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <div className="h-5 w-48 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SkeletonLoading;
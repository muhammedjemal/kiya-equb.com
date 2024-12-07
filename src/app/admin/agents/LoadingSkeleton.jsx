const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 animate-pulse"
        >
          {/* Card Header Skeleton */}
          <div className="flex justify-between mb-4">
            <div className="w-3/4 h-5 bg-gray-300 rounded-md" />
            <div className="w-1/4 h-5 bg-gray-300 rounded-md" />
          </div>

          {/* Card Body Skeleton */}
          <div>
            {/* Admin Details Skeleton */}
            {["dagna", "sebsabi", "tsehafi"].map((role) => (
              <div key={role} className="mb-6 border-b pb-4">
                <div className="w-1/2 h-5 bg-gray-300 rounded-md mb-2" />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
                  <div className="ml-4 space-y-2">
                    <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse" />
                    <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 h-32 bg-gray-300 rounded-lg animate-pulse" />
                  <div className="w-1/2 h-32 bg-gray-300 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}

            {/* Bank Information Skeleton */}
            <div className="mt-4">
              <div className="w-1/2 h-5 bg-gray-300 rounded-md mb-4" />
              <div className="space-y-3">
                <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse" />
                <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Other Details Skeleton */}
            <div className="mt-4 space-y-3">
              <div className="w-1/4 h-4 bg-gray-300 rounded-md animate-pulse" />
              <div className="w-1/3 h-4 bg-gray-300 rounded-md animate-pulse" />
              <div className="w-1/4 h-4 bg-gray-300 rounded-md animate-pulse" />
              <div className="w-1/4 h-4 bg-gray-300 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Card Footer Skeleton */}
          <div className="flex justify-between mt-4">
            <div className="w-1/3 h-10 bg-blue-300 rounded-md animate-pulse" />
            <div className="w-1/3 h-10 bg-red-300 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

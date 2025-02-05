export default function Loading() {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-12 w-3/4 mx-auto mb-8 bg-gray-200 animate-pulse rounded-md"></div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
            
            <div className="p-6">
              <div className="h-8 w-1/3 mb-4 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-full mb-2 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-full mb-2 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-2/3 mb-6 bg-gray-200 animate-pulse rounded-md"></div>
              
              {/* Management Plan Skeleton */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="h-8 w-1/3 mb-4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-2 w-full mb-2 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 flex-grow bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-8 w-1/2 mt-8 mb-4 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 mb-2">
                    <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-md"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                  </div>
                ))}
              </div>
              
              <div className="h-8 w-1/3 mb-4 bg-gray-200 animate-pulse rounded-md"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2 mb-2">
                  <div className="h-2 w-2 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
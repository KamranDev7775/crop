import CityInput from '@/components/CityInput';

export default async function Page(){


  return (
<div className="flex flex-col items-center pt-20 min-h-screen text-gray-800 p-2 pb-8">
      <h1 className="text-3xl font-bold mb-4 text-white">AGRI WEATHER</h1>
      < CityInput />

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md text-center w-full max-w-2xl">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center mb-6 animate-pulse">
            <div className="h-6 w-40 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-10 w-20 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-4 w-28 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
          </div>
          <div className="h-6 w-48 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg text-center animate-pulse">
                <div className="h-4 w-28 bg-gray-300 rounded mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-gray-300 rounded mx-auto mb-2"></div>
                <div className="h-6 w-16 bg-gray-300 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};
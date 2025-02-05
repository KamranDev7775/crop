import CityInput from '@/components/CityInput';

export default async function Page(){

  return (
<div className="flex flex-col items-center pt-20 min-h-screen text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">AGRI WEATHER</h1>
      < CityInput />
    </div>
  );
};

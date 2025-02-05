import CityInput from '@/components/CityInput';

export default async function Page({
  params,
}: {
  params: Promise<{ city: string}>
}){

  const API_KEY = process.env.OPEN_WEATHER_API_KEY;
  const city = (await params).city.unslugify()

  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );

  const geoData = await geoRes.json();
  
  const { lat, lon } = geoData[0];

  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const weather = await weatherRes.json();

  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const forecast = await forecastRes.json();



  return (
<div className="flex flex-col items-center pt-20 min-h-screen text-gray-800 p-2 pb-8">
      <h1 className="text-3xl font-bold mb-4 text-white">AGRI WEATHER</h1>
      < CityInput />

      {forecast && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md text-center w-full max-w-2xl">
          {weather && (
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center mb-6">
              <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys.country}</h2>
              <p className="text-lg capitalize">{weather.weather[0].description}</p>
              <p className="text-4xl font-bold">{weather.main.temp}°C</p>
              <p>Feels like: {weather.main.feels_like}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.isArray(forecast.list) && forecast.list.slice(0, 5).map((day: any, index: number) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="font-semibold">{new Date(day.dt_txt).toLocaleDateString()}</p>
                <p>{day.weather[0].description}</p>
                <p className="text-lg font-bold">{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};



declare global {
  interface String {
    slugify(): string;
    unslugify(): string;
  }
}

// Add slugify method to String prototype
String.prototype.slugify = function () {
  return this.replaceAll(' ', '_-_')    // Replace all spaces with hyphens
    .replaceAll('&', '_and_')  // Replace all '&' with 'and'
    .replaceAll('/', '_or_') // Replace all '/' with 'or'
    .replaceAll(',', '_comma_')
    .replaceAll('.', '_dot_')
};

// Add unslugify method to String prototype
String.prototype.unslugify = function () {
  return this.replaceAll('_-_', ' ')    // Replace all hyphens with spaces
    .replaceAll('_and_', '&')  // Replace all 'and' with '&'
    .replaceAll('_or_', '/')  // Replace all 'or' with '/'
    .replaceAll('_comma_', ",")
    .replaceAll('_dot_', ".")
};
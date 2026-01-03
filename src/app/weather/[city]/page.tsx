import CityInput from '@/components/CityInput';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Weather Icons Mapping
const weatherIcons: { [key: string]: string } = {
  "clear sky": "☀️",
  "few clouds": "🌤️",
  "scattered clouds": "⛅",
  "broken clouds": "☁️",
  "shower rain": "🌧️",
  "rain": "🌦️",
  "thunderstorm": "⛈️",
  "snow": "❄️",
  "mist": "🌫️",
};

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>
}) {

  const API_KEY = process.env.OPEN_WEATHER_API_KEY;
  const city = (await params).city.unslugify()

  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );

  const geoData = await geoRes.json();
  
  if (!geoData || geoData.length === 0) {
    return (
      <div className="flex flex-col items-center pt-20 min-h-screen text-gray-800 p-2 pb-8">
        <h1 className="text-3xl font-bold mb-4 text-white">AGRI WEATHER</h1>
        <CityInput />
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md text-center w-full max-w-2xl">
          <p className="text-gray-800">City not found. Please try another city name.</p>
        </div>
      </div>
    )
  }
  
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
      <CityInput />

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
            {Array.isArray(forecast.list) &&
              forecast.list
                .filter((day: any) => new Date(day.dt_txt).getHours() === 12) // Pick entries at 12 PM
                .slice(0, 5)
                .map((day: any, index: number) => {
                  const icon = weatherIcons[day.weather[0].description.toLowerCase()] || "❔";
                  const dayName = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
                  const fullDate = new Date(day.dt_txt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

                  return (
                    <div key={index} className="p-4 bg-gray-100 rounded-lg text-center shadow-sm">
                      <div className="w-full h-2 bg-blue-400 rounded-t-md mb-2 flex items-center justify-center text-xl">
                        {icon}
                      </div>
                      <p className="font-semibold">{dayName}</p>
                      <p className="text-sm">{fullDate}</p> {/* Added full date */}
                      <p className="capitalize text-sm">{day.weather[0].description}</p>
                      <p className="text-lg font-bold">{Math.round(day.main.temp)}°C</p>
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
};


// --- String Utilities for slugify and unslugify ---
declare global {
  interface String {
    slugify(): string;
    unslugify(): string;
  }
}

String.prototype.slugify = function () {
  return this.replaceAll(' ', '_-_')
    .replaceAll('&', '_and_')
    .replaceAll('/', '_or_')
    .replaceAll(',', '_comma_')
    .replaceAll('.', '_dot_');
};

String.prototype.unslugify = function () {
  return this.replaceAll('_-_', ' ')
    .replaceAll('_and_', '&')
    .replaceAll('_or_', '/')
    .replaceAll('_comma_', ",")
    .replaceAll('_dot_', ".");
};

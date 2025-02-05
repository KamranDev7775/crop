'use client';

import { useState } from 'react';

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = async () => {
    try {
      setError(null);
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        setError('City not found');
        return;
      }

      const { lat, lon } = geoData[0];

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData.list);
    } catch (err) {
      setError('Failed to fetch weather data');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">AGRI WEATHER</h1>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={fetchWeather}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Get Weather
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}



      {forecast && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md text-center w-full max-w-2xl">
          {weather && (
            <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md text-center m-4">
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
            {forecast.slice(0, 5).map((day: any, index: number) => (
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


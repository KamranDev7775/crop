'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CityInput() {
  const [city, setCity] = useState('');
  const router = useRouter();
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!city || city.replaceAll(" ", "") == "") return;
    e.preventDefault();
    router.push(`/weather/${city.slugify()}`);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (!city || city.replaceAll(" ", "") == "") return;
      e.preventDefault();
      router.push(`/weather/${city.slugify()}`);
    }
  }
  
  return (

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter city name"
          onKeyDown={handleKeyDown}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleClick}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Get Weather
        </button>
      </div>
)}



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
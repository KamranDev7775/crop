"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function CropSuggestionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const queryParams = new URLSearchParams(formData as Record<string, string>).toString()
    router.push(`/suggestion?${queryParams}`)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFillClick = () => {
    //rice 90	42	43		82.00274423	6.502985292	202.9355362

    setFormData({
      nitrogen: "90",
      phosphorus: "42",
      potassium: "43",
      temperature: "20.87974371",
      humidity: "82.00274423",
      ph: "6.502985292",
      rainfall: "202.9355362",
    })
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 ">
      <div className="max-w-6xl mx-auto  bg-gray-100 rounded-lg shadow-md p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">Crop Suggestion</h1>
        <button onClick={handleFillClick} className="text-xl font-bold text-gray-700 mb-2">📃</button>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="relative">
                <input
                  id={key}
                  name={key}
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={handleChange}
                  className="peer w-full h-12 px-4 border border-gray-300 rounded-md text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  required
                />
                <label
                  htmlFor={key}
                  className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-green-600"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold rounded-md px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition-colors"
            >
              Get Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


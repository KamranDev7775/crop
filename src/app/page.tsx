import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-6">
            AGRI ADVICE
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Smart Crop Recommendations for Better Farming
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Get personalized crop suggestions based on your soil conditions and environmental factors. 
            Make informed decisions for optimal harvest yields.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Analysis</h3>
              <p className="text-gray-600">AI-powered crop recommendations based on soil nutrients and climate data</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-3xl mb-4">🌤️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Weather Insights</h3>
              <p className="text-gray-600">Real-time weather information to optimize your farming decisions</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Better Yields</h3>
              <p className="text-gray-600">Maximize your harvest with data-driven agricultural guidance</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/home" 
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Crop Suggestions
            </Link>
            <Link 
              href="/weather" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Check Weather
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

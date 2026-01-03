"use client"

import SoilCamera from "@/components/SoilCamera"

export default function SoilAnalysisPage() {
  const handleSoilAnalysis = (results: any) => {
    console.log('Soil analysis results:', results)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">SOIL ANALYSIS</h1>
        <SoilCamera onAnalysis={handleSoilAnalysis} />
      </div>
    </div>
  )
}
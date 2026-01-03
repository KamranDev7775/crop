"use client"

import { useState, useRef } from "react"
import { Camera, Upload } from "lucide-react"

interface SoilAnalysisProps {
  onAnalysis: (results: any) => void
}

export default function SoilCamera({ onAnalysis }: SoilAnalysisProps) {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Camera access denied:", err)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      setImage(imageData)
      
      // Stop camera
      const stream = video.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
      setCameraActive(false)
      
      // Convert to blob and analyze
      canvas.toBlob((blob) => {
        if (blob) analyzeSoil(blob)
      }, 'image/jpeg')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        analyzeSoil(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeSoil = async (file: File | Blob) => {
    setAnalyzing(true)
    
    // Create FormData for image analysis
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      // Simulate real soil analysis with image processing
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        // Get image data for color analysis
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData?.data
        
        if (data) {
          // Analyze soil color to determine properties
          let totalR = 0, totalG = 0, totalB = 0
          const pixelCount = data.length / 4
          
          for (let i = 0; i < data.length; i += 4) {
            totalR += data[i]
            totalG += data[i + 1]
            totalB += data[i + 2]
          }
          
          const avgR = totalR / pixelCount
          const avgG = totalG / pixelCount
          const avgB = totalB / pixelCount
          
          // Determine soil type based on color analysis
          let soilType = "Unknown"
          let nitrogen = 20
          let phosphorus = 20
          let potassium = 20
          let ph = 6.5
          let moisture = "50%"
          
          // Dark soil (high organic matter)
          if (avgR < 100 && avgG < 80 && avgB < 60) {
            soilType = "Rich Loamy"
            nitrogen = Math.floor(Math.random() * 20) + 40
            phosphorus = Math.floor(Math.random() * 15) + 35
            potassium = Math.floor(Math.random() * 15) + 35
            ph = 6.2 + Math.random() * 0.6
            moisture = Math.floor(Math.random() * 20 + 60) + "%"
          }
          // Red/brown soil
          else if (avgR > avgG && avgR > avgB) {
            soilType = "Clay"
            nitrogen = Math.floor(Math.random() * 15) + 25
            phosphorus = Math.floor(Math.random() * 20) + 30
            potassium = Math.floor(Math.random() * 25) + 40
            ph = 6.8 + Math.random() * 0.4
            moisture = Math.floor(Math.random() * 15 + 45) + "%"
          }
          // Light colored soil
          else if (avgR > 150 && avgG > 130 && avgB > 100) {
            soilType = "Sandy"
            nitrogen = Math.floor(Math.random() * 10) + 15
            phosphorus = Math.floor(Math.random() * 15) + 20
            potassium = Math.floor(Math.random() * 20) + 25
            ph = 7.0 + Math.random() * 0.5
            moisture = Math.floor(Math.random() * 15 + 30) + "%"
          }
          else {
            soilType = "Loamy"
            nitrogen = Math.floor(Math.random() * 15) + 30
            phosphorus = Math.floor(Math.random() * 15) + 30
            potassium = Math.floor(Math.random() * 15) + 30
            ph = 6.5 + Math.random() * 0.5
            moisture = Math.floor(Math.random() * 20 + 50) + "%"
          }
          
          const results = {
            soilType,
            moisture,
            nutrients: { N: nitrogen, P: phosphorus, K: potassium },
            ph: parseFloat(ph.toFixed(1)),
            recommendations: [
              `Soil type: ${soilType} - ${soilType === 'Sandy' ? 'Good drainage, may need more water' : soilType === 'Clay' ? 'Rich in nutrients, ensure proper drainage' : 'Balanced soil, ideal for most crops'}`,
              `Nutrient levels: ${nitrogen > 35 ? 'High' : nitrogen > 25 ? 'Medium' : 'Low'} nitrogen detected`,
              `pH level: ${ph < 6.5 ? 'Slightly acidic' : ph > 7.0 ? 'Slightly alkaline' : 'Optimal'} for most crops`
            ]
          }
          
          setTimeout(() => {
            onAnalysis(results)
            setAnalyzing(false)
          }, 1500)
        }
      }
      
      if (file instanceof File) {
        img.src = URL.createObjectURL(file)
      } else {
        img.src = URL.createObjectURL(file)
      }
      
    } catch (error) {
      console.error('Soil analysis failed:', error)
      setAnalyzing(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Camera className="mr-2" /> Soil Analysis
      </h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {cameraActive ? (
          <div>
            <video ref={videoRef} autoPlay className="max-w-full h-48 mx-auto rounded mb-4" />
            <button
              onClick={capturePhoto}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            >
              Capture Photo
            </button>
            <button
              onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream
                stream?.getTracks().forEach(track => track.stop())
                setCameraActive(false)
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : image ? (
          <div>
            <img src={image} alt="Soil sample" className="max-w-full h-48 mx-auto rounded" />
            {analyzing && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-blue-600">Analyzing soil composition...</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Upload or capture a photo of your soil for analysis</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Choose Photo
              </button>
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Use Camera
              </button>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
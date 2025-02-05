'use server'
import score from "@/scripts/random_forest";
import Image from "next/image"
import ManagementPlan from "@/components/ManagementPlan"
import { Sun, Droplet, ThermometerSun } from "lucide-react"
import { neon } from "@neondatabase/serverless"


const sql = neon(process.env.DATABASE_URL || '');

export default async function CropSuggestionPage({
    searchParams,
  }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const nitrogen = (await searchParams).nitrogen ?? ""
    const phosphorus = (await searchParams).phosphorus ?? ""
    const potassium = (await searchParams).potassium ?? ""
    const temperature = (await searchParams).temperature ?? ""
    const humidity = (await searchParams).humidity ?? ""
    const ph = (await searchParams).ph ?? ""
    const rainfall = (await searchParams).rainfall ?? ""

    
const minVals = [ 0, 5, 5, 8.82567475, 14.27327988, 3.50475231, 20.36001144]
const maxVals = [140, 145, 205, 43.67549305, 99.98187601, 9.93509073, 298.5601175]

const features = [
    parseFloat(nitrogen),
    parseFloat(phosphorus),
    parseFloat(potassium),
    parseFloat(temperature),
    parseFloat(humidity),
    parseFloat(ph),
    parseFloat(rainfall)
]

function minMaxScale(features : number[], minVals: number[], maxVals: number[]) {
    return features.map((val, i) => (val - minVals[i]) / (maxVals[i] - minVals[i]));
}

const prediction = score(minMaxScale(features, minVals, maxVals));
const predictedClassIndex = prediction.indexOf(Math.max(...prediction))+1;

const cropData = await sql`
  SELECT *
FROM 
    Crops
WHERE 
    Crops.crop_id = ${predictedClassIndex};
`
const weatherData = await sql`
  SELECT *
FROM 
    Weather_Requirements
WHERE 
    Weather_Requirements.crop_id = ${predictedClassIndex};
`
const tipsData = await sql`
  SELECT *
FROM 
    Tips
WHERE 
    Tips.crop_id = ${predictedClassIndex};
`
const managementTasks = await sql`
  SELECT *
FROM 
    Management_Tasks
WHERE 
    Management_Tasks.crop_id = ${predictedClassIndex};
`

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-white mb-8 uppercase">SUGGESTED CROP {cropData[0].name}</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <Image
            src={cropData[0].image_url}
            alt={cropData[0].name}
            width={600}
            height={300}
            className="w-full h-64 object-cover"
          />

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
            <p className="text-gray-600 mb-6">
              {cropData[0].description}
            </p>

            <ManagementPlan tasksData={managementTasks} />

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Weather Requirements</h2>
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <ThermometerSun className="w-5 h-5 text-red-500" />
                <p className="text-blue-800">
                  <strong>Temperature:</strong> {weatherData[0].parameter_value}
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                <p className="text-blue-800">
                  <strong>Sunlight:</strong> {weatherData[1].parameter_value}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                <p className="text-blue-800">
                  <strong>Water:</strong> {weatherData[2].parameter_value}
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Tips</h2>
            <ul className="list-disc list-inside text-gray-600">
              {tipsData.map((tip: any) => (
                <li key={tip.tip_id}>{tip.tip_description}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    )
  }
  
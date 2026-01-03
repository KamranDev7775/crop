import PlantingReminders from "@/components/PlantingReminders"
import WeatherAlerts from "@/components/WeatherAlerts"

export default function SchedulePage() {
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">FARMING SCHEDULE</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlantingReminders />
          <WeatherAlerts />
        </div>
      </div>
    </div>
  )
}
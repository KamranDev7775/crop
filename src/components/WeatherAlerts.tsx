"use client"

import { useState, useEffect } from "react"
import { Bell, Cloud, AlertTriangle, X } from "lucide-react"

interface WeatherAlert {
  id: number
  type: 'warning' | 'info'
  message: string
  time: string
  location?: string
}

export default function WeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [location, setLocation] = useState<string>('')

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocationName(position.coords.latitude, position.coords.longitude)
          fetchWeatherAlerts(position.coords.latitude, position.coords.longitude)
        },
        () => {
          setLocation('Location unavailable')
          loadMockAlerts()
        }
      )
    } else {
      loadMockAlerts()
    }

    // Set up periodic weather checks
    const interval = setInterval(() => {
      if (location) {
        checkWeatherUpdates()
      }
    }, 300000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [location])

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      // Using a free geocoding service
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
      const data = await response.json()
      setLocation(data.city || data.locality || 'Unknown location')
    } catch (error) {
      setLocation('Location unavailable')
    }
  }

  const fetchWeatherAlerts = async (lat: number, lon: number) => {
    try {
      // Using OpenWeatherMap API (you'd need to add your API key)
      // For demo, we'll simulate based on current conditions
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY`)
      
      // Simulate weather-based alerts
      const currentHour = new Date().getHours()
      const randomFactor = Math.random()
      
      const newAlerts: WeatherAlert[] = []
      
      // Generate dynamic alerts based on time and random factors
      if (randomFactor > 0.7) {
        newAlerts.push({
          id: Date.now(),
          type: 'warning',
          message: 'Heavy rainfall expected in next 24 hours - protect crops',
          time: 'Just now',
          location
        })
      }
      
      if (currentHour >= 6 && currentHour <= 10 && randomFactor > 0.5) {
        newAlerts.push({
          id: Date.now() + 1,
          type: 'info',
          message: 'Optimal morning conditions for irrigation',
          time: '30 minutes ago',
          location
        })
      }
      
      if (randomFactor > 0.8) {
        newAlerts.push({
          id: Date.now() + 2,
          type: 'warning',
          message: 'High wind speeds forecasted - secure loose materials',
          time: '1 hour ago',
          location
        })
      }
      
      setAlerts(newAlerts)
    } catch (error) {
      loadMockAlerts()
    }
  }

  const loadMockAlerts = () => {
    const mockAlerts: WeatherAlert[] = [
      { 
        id: 1, 
        type: 'warning', 
        message: 'Heavy rainfall expected in 2 days - prepare drainage', 
        time: '2 hours ago',
        location: 'Your area'
      },
      { 
        id: 2, 
        type: 'info', 
        message: 'Optimal planting conditions this week', 
        time: '1 day ago',
        location: 'Your area'
      }
    ]
    setAlerts(mockAlerts)
  }

  const checkWeatherUpdates = () => {
    // Simulate real-time weather updates
    const shouldAddAlert = Math.random() > 0.9 // 10% chance every 5 minutes
    
    if (shouldAddAlert) {
      const alertMessages = [
        'Temperature dropping - frost warning for tonight',
        'Perfect humidity levels for crop growth detected',
        'Strong UV index - ideal for sun-loving crops',
        'Low pressure system approaching - rain likely'
      ]
      
      const newAlert: WeatherAlert = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'info' : 'warning',
        message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
        time: 'Just now',
        location
      }
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]) // Keep only 5 most recent
      
      // Send browser notification if enabled
      if (notificationsEnabled && 'Notification' in window) {
        new Notification('Weather Alert', {
          body: newAlert.message,
          icon: '/favicon.ico'
        })
      }
    }
  }

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
      
      if (permission === 'granted') {
        new Notification('Weather Alerts Enabled', {
          body: 'You will now receive real-time weather notifications',
          icon: '/favicon.ico'
        })
      }
    }
  }

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center text-gray-800">
          <Bell className="mr-2 text-gray-700" /> Weather Alerts
          {location && <span className="text-sm text-gray-600 ml-2">({location})</span>}
        </h3>
        <button
          onClick={enableNotifications}
          className={`px-4 py-2 rounded text-sm transition-colors ${
            notificationsEnabled 
              ? "bg-green-100 text-green-800" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {notificationsEnabled ? "✓ Notifications On" : "Enable Alerts"}
        </button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No weather alerts at this time</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg flex items-start justify-between ${
              alert.type === "warning" 
                ? "bg-yellow-50 border-l-4 border-yellow-400" 
                : "bg-blue-50 border-l-4 border-blue-400"
            }`}>
              <div className="flex items-start flex-1">
                {alert.type === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <Cloud className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-gray-800">{alert.message}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {alert.time} {alert.location && `• ${alert.location}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
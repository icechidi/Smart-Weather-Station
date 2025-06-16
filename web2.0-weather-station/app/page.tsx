"use client"

import { useState, useEffect } from "react"
import { WeatherCard } from "@/components/weather-card"
import { WeatherChart } from "@/components/weather-chart"
import { Thermometer, Droplets, CloudRain, Sun } from "lucide-react"

interface WeatherData {
  timestamp: string
  temperature: number
  humidity: number
  rain: number
  light: number
}

export default function WeatherStation() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [currentData, setCurrentData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Replace with your Google Sheets Web App URL
  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyK__Nb2lYuuj_rFXjcIiQUpMoza3-Ibx-NkkMaJKRnKkhtGbU0H_95nllV5LM0TNeh/exec"

  const fetchWeatherData = async () => {
    try {
      // For demo purposes, I'll generate mock data
      // Replace this with actual Google Sheets API call
      const mockData: WeatherData = {
        timestamp: new Date().toISOString(),
        temperature: 20 + Math.random() * 15, // 20-35°C
        humidity: 40 + Math.random() * 40, // 40-80%
        rain: Math.random() * 10, // 0-10mm
        light: 200 + Math.random() * 800, // 200-1000 lux
      }

      setCurrentData(mockData)
      setWeatherData((prev) => {
        const newData = [...prev, mockData].slice(-50) // Keep last 50 readings
        return newData
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchWeatherData()

    // Set up real-time updates every 5 seconds
    const interval = setInterval(fetchWeatherData, 5000)

    return () => clearInterval(interval)
  }, [])

  const weatherComponents = [
    {
      title: "Temperature",
      value: currentData?.temperature || 0,
      unit: "°C",
      icon: Thermometer,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
      iconColor: "text-red-500",
    },
    {
      title: "Humidity",
      value: currentData?.humidity || 0,
      unit: "%",
      icon: Droplets,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      iconColor: "text-blue-500",
    },
    {
      title: "Rain",
      value: currentData?.rain || 0,
      unit: "mm",
      icon: CloudRain,
      color: "indigo",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-600",
      iconColor: "text-indigo-500",
    },
    {
      title: "Light",
      value: currentData?.light || 0,
      unit: "lux",
      icon: Sun,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-600",
      iconColor: "text-amber-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Weather Station</h1>
          <p className="text-gray-600">Real-time weather monitoring from Arduino sensors</p>
          {currentData && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(currentData.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        {/* Weather Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {weatherComponents.map((component, index) => (
            <WeatherCard key={component.title} {...component} isLoading={isLoading} animationDelay={index * 100} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {weatherComponents.map((component) => (
            <WeatherChart
              key={component.title}
              title={component.title}
              data={weatherData}
              dataKey={component.title.toLowerCase()}
              unit={component.unit}
              color={component.color}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

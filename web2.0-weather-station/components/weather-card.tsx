"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface WeatherCardProps {
  title: string
  value: number
  unit: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  iconColor: string
  isLoading: boolean
  animationDelay: number
}

export function WeatherCard({
  title,
  value,
  unit,
  icon: Icon,
  bgColor,
  borderColor,
  textColor,
  iconColor,
  isLoading,
  animationDelay,
}: WeatherCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay])

  useEffect(() => {
    // Animate value changes
    if (!isLoading) {
      const duration = 1000
      const steps = 60
      const stepValue = (value - displayValue) / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        setDisplayValue((prev) => {
          const newValue = prev + stepValue
          if (currentStep >= steps) {
            clearInterval(interval)
            return value
          }
          return newValue
        })
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [value, isLoading])

  return (
    <Card
      className={`
        ${bgColor} ${borderColor} border-2 
        transform transition-all duration-500 hover:scale-105 hover:shadow-lg
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                </div>
              ) : (
                <>
                  <span className={`text-3xl font-bold ${textColor}`}>{displayValue.toFixed(1)}</span>
                  <span className={`text-lg font-medium ${textColor} ml-1`}>{unit}</span>
                </>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full bg-white/50 ${iconColor}`}>
            <Icon
              size={24}
              className={`
                transition-transform duration-300 hover:scale-110
                ${!isLoading && value > 0 ? "animate-pulse" : ""}
              `}
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center">
          <div
            className={`
              w-2 h-2 rounded-full mr-2 transition-colors duration-300
              ${!isLoading ? "bg-green-500 animate-pulse" : "bg-gray-400"}
            `}
          ></div>
          <span className="text-xs text-gray-500">{!isLoading ? "Live" : "Connecting..."}</span>
        </div>
      </CardContent>
    </Card>
  )
}

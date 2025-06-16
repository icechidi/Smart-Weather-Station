"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface WeatherData {
  timestamp: string
  temperature: number
  humidity: number
  rain: number
  light: number
}

interface WeatherChartProps {
  title: string
  data: WeatherData[]
  dataKey: string
  unit: string
  color: string
  isLoading: boolean
}

const colorMap = {
  red: "hsl(0, 84%, 60%)",
  blue: "hsl(217, 91%, 60%)",
  indigo: "hsl(239, 84%, 67%)",
  amber: "hsl(43, 96%, 56%)",
}

export function WeatherChart({ title, data, dataKey, unit, color, isLoading }: WeatherChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: item[dataKey as keyof WeatherData] as number,
  }))

  const chartColor = colorMap[color as keyof typeof colorMap] || colorMap.blue

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          {title} Readings
          <span className="ml-2 text-sm font-normal text-gray-500">({unit})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ChartContainer
            config={{
              value: {
                label: title,
                color: chartColor,
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(value) => `Time: ${value}`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={3}
                  dot={{ fill: chartColor, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        {/* Chart status */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span>{chartData.length} data points</span>
          <span>Updated every 5s</span>
        </div>
      </CardContent>
    </Card>
  )
}

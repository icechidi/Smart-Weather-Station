// Google Sheets API integration
// Replace with your actual Google Sheets Web App URL and configuration

export interface WeatherReading {
  timestamp: string
  temperature: number
  humidity: number
  rain: number
  light: number
}

export class GoogleSheetsService {
  private webAppUrl: string

  constructor(webAppUrl: string) {
    this.webAppUrl = webAppUrl
  }

  async fetchLatestReadings(): Promise<WeatherReading[]> {
    try {
      const response = await fetch(this.webAppUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Transform the data to match our interface
      return data.map((row: any) => ({
        timestamp: row.timestamp || new Date().toISOString(),
        temperature: Number.parseFloat(row.temperature) || 0,
        humidity: Number.parseFloat(row.humidity) || 0,
        rain: Number.parseFloat(row.rain) || 0,
        light: Number.parseFloat(row.light) || 0,
      }))
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error)
      throw error
    }
  }

  async addReading(reading: Omit<WeatherReading, "timestamp">): Promise<void> {
    try {
      const response = await fetch(this.webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reading,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error adding reading to Google Sheets:", error)
      throw error
    }
  }
}

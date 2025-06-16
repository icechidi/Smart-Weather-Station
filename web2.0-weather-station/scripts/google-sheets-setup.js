// Google Apps Script code for your Google Sheets Web App
// Copy this code to your Google Apps Script project

const SpreadsheetApp = SpreadsheetApp
const ContentService = ContentService

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSheet()
  const data = sheet.getDataRange().getValues()

  // Skip header row
  const headers = data[0]
  const rows = data.slice(1)

  const result = rows.map((row) => {
    const obj = {}
    headers.forEach((header, index) => {
      obj[header.toLowerCase()] = row[index]
    })
    return obj
  })

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet()
  const data = JSON.parse(e.postData.contents)

  // Add new row with timestamp
  sheet.appendRow([new Date(data.timestamp), data.temperature, data.humidity, data.rain, data.light])

  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
}

// Set up your Google Sheet with these column headers:
// Timestamp | Temperature | Humidity | Rain | Light

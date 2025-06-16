# Smart Weather Station

A real-time weather monitoring system that displays data from Arduino sensors through a web interface hosted on Raspberry Pi 5.

## Features

- **Real-time Data**: Updates every 5 seconds from Google Sheets
- **4 Weather Components**: Temperature, Humidity, Rain, and Light sensors
- **Interactive Charts**: Line graphs showing historical data trends
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Card entrance animations and value transitions
- **Color-coded Interface**: Each sensor has its unique color theme

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Sheet with columns: `Timestamp`, `Temperature`, `Humidity`, `Rain`, `Light`
2. Go to Extensions > Apps Script
3. Copy the code from `scripts/google-sheets-setup.js`
4. Deploy as Web App with execute permissions for "Anyone"
5. Copy the Web App URL

### 2. Arduino Integration

Your Arduino should send data to the Google Sheets via HTTP POST requests or through a Python script that reads from serial monitor and updates the sheet.

### 3. Raspberry Pi 5 Setup

1. Install Node.js 18+ on your Raspberry Pi 5
2. Clone this project
3. Update the `GOOGLE_SHEETS_URL` in `app/page.tsx` with your Web App URL
4. Install dependencies: `npm install`
5. Build the project: `npm run build`
6. Start the server: `npm start`

### 4. Access the Dashboard

Open your browser and navigate to `http://[raspberry-pi-ip]:3000`

## Customization

- **Update Intervals**: Modify the interval in `app/page.tsx` (default: 5 seconds)
- **Data Retention**: Change the data slice limit (default: 50 readings)
- **Colors**: Customize colors in the `weatherComponents` array
- **Chart Types**: Modify chart components for different visualizations

## Troubleshooting

- Ensure your Google Sheets Web App is deployed with proper permissions
- Check network connectivity between Raspberry Pi and Google Sheets
- Verify Arduino is sending data in the correct format
- Monitor browser console for any JavaScript errors

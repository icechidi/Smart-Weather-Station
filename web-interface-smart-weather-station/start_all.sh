#!/bin/bash

cd /home/ice-chidi/Documents/smart-weather-station-api

# Optional: activate virtualenv if needed
source /home/ice-chidi/Documents/smart-weather-station-api/venv/bin/activate

python3 weather_server.py &
sleep 2
python3 serial_reader.py &

# Run Flask server (or your combined script)
python3 app.py  # or whatever your main script is

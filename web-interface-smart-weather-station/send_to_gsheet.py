#SMART-WEATHER-STATION

import serial
import time
import requests
from datetime import datetime

# ==== CONFIG ====
SERIAL_PORT = '/dev/ttyUSB0'
BAUD_RATE = 9600
MAX_ROWS = 10

# Your deployed Google Apps Script Web App URL
GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbxgPEKKD6LoP8x_Efk1S20ff4WG0TcfSuA_2x2dzTycrwmRB2Jrs4BbRT_O6iX6vD/exec'

# Track which row we're writing to (rows 2–11)
row_index = 2

# ====== FUNCTIONS ======
def parse_sensor_data(line):
    parts = line.strip().split(',')
    if len(parts) != 4:
        raise ValueError("Invalid sensor format. Expected 4 values.")
    return {
        'temperature': parts[0].strip(),
        'humidity': parts[1].strip(),
        'rain': parts[2].strip(),
        'light': parts[3].strip()
    }

def send_to_google_sheet(data, row_num):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    payload = {
        'timestamp': timestamp,
        'temperature': data['temperature'],
        'humidity': data['humidity'],
        'rain': data['rain'],
        'light': data['light'],
        'row': row_num  # this is used by the Apps Script to write to a specific row
    }

    try:
        response = requests.post(GOOGLE_SCRIPT_URL, data=payload, timeout=10)
        if response.status_code == 200:
            print(f"[✓] Row {row_num} written: {payload}")
        else:
            print(f"[ERROR] Failed to send data: {response.status_code}")
    except Exception as e:
        print(f"[EXCEPTION] Failed to send request: {e}")

# ====== MAIN LOOP ======
def main():
    global row_index
    print(f"[INFO] Connecting to Arduino on {SERIAL_PORT} at {BAUD_RATE} baud...")

    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
        time.sleep(2)
        print("[INFO] Serial connected. Listening...")
    except serial.SerialException as e:
        print(f"[ERROR] Could not open serial port: {e}")
        return

    while True:
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                print(f"[DATA] {line}")

                sensor_data = parse_sensor_data(line)
                send_to_google_sheet(sensor_data, row_index)

                row_index += 1
                if row_index > 11:  # Loop back to row 2
                    row_index = 2

                time.sleep(10)  # Adjust based on how frequently you want to log

        except ValueError as ve:
            print(f"[WARNING] Skipping bad data: {ve}")
        except serial.SerialException as se:
            print(f"[ERROR] Serial communication issue: {se}")
            break
        except KeyboardInterrupt:
            print("[INFO] Stopped by user.")
            break
        except Exception as e:
            print(f"[ERROR] Unexpected issue: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()

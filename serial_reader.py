import serial
import time
import requests

# Adjust port as needed (check with `ls /dev/tty*`)
SERIAL_PORT = "/dev/ttyUSB0"
BAUD_RATE = 9600

while True:
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=5)
        break
    except:
        print("Waiting for Arduino Nano...")
        time.sleep(2)

print("Serial connected to Arduino.")

while True:
    try:
        line = ser.readline().decode('utf-8').strip()
        if line:
            # Example: temperature=25.00&humidity=56.00&rain=820&light=250
            print("Received:", line)
            requests.post("http://127.0.0.1:5000/update", data=line)
    except Exception as e:
        print("Error:", e)
    time.sleep(5)

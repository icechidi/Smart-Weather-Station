import serial
import time
import requests

SERIAL_PORT = "/dev/ttyUSB0"  # May vary; use `ls /dev/tty*` to verify
BAUD_RATE = 9600

while True:
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=5)
        break
    except:
        print("Waiting for Arduino Nano...")
        time.sleep(2)

print("Serial connected.")

while True:
    try:
        line = ser.readline().decode('utf-8').strip()
        if line and "temperature" in line:
            print("Received:", line)
            requests.post("http://127.0.0.1:5000/update", data=line)
    except Exception as e:
        print("Error:", e)
    time.sleep(2)

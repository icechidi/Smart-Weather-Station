from flask import Flask, render_template, request
import sqlite3
import datetime

app = Flask(__name__)

DB_FILE = 'weather_data.db'

# Initialize DB
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        temperature REAL,
        humidity REAL,
        rain INTEGER,
        light INTEGER
    )''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT * FROM weather ORDER BY id DESC LIMIT 1")
    row = c.fetchone()
    conn.close()

    data = {
        'temperature': row[2] if row else 0,
        'humidity': row[3] if row else 0,
        'rain': row[4] if row else 0,
        'light': row[5] if row else 0,
        'timestamp': row[1] if row else 'N/A'
    }
    return render_template('index.html', data=data)

@app.route('/update', methods=['POST'])
def update():
    temperature = float(request.form.get('temperature', 0))
    humidity = float(request.form.get('humidity', 0))
    rain = int(request.form.get('rain', 0))
    light = int(request.form.get('light', 0))
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO weather (timestamp, temperature, humidity, rain, light) VALUES (?, ?, ?, ?, ?)",
              (timestamp, temperature, humidity, rain, light))
    conn.commit()
    conn.close()
    return "OK"

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)

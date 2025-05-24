from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import datetime
import smtplib

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///weather_data.db'
db = SQLAlchemy(app)

# SQLite model
class WeatherData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    rain = db.Column(db.Integer)
    light = db.Column(db.Integer)
    timestamp = db.Column(db.String(30))

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/', methods=['GET'])
def index():
    latest = WeatherData.query.order_by(WeatherData.id.desc()).first()
    return render_template('index.html', data=latest)

@app.route('/update', methods=['POST'])
def update_data():
    temperature = float(request.form.get('temperature', 0))
    humidity = float(request.form.get('humidity', 0))
    rain = int(request.form.get('rain', 0))
    light = int(request.form.get('light', 0))
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Store in database
    entry = WeatherData(
        temperature=temperature,
        humidity=humidity,
        rain=rain,
        light=light,
        timestamp=timestamp
    )
    db.session.add(entry)
    db.session.commit()

    # Optional: Email alerts
    if temperature > 35:
        send_email_alert("High Temperature Alert", f"Temperature is {temperature} °C")
    if rain < 500:
        send_email_alert("Rain Alert", f"Rain detected! Value: {rain}")

    return "OK"

@app.route('/history')
def history():
    records = WeatherData.query.order_by(WeatherData.id.desc()).limit(20).all()
    return jsonify([{
        'temperature': r.temperature,
        'humidity': r.humidity,
        'rain': r.rain,
        'light': r.light,
        'timestamp': r.timestamp
    } for r in reversed(records)])

# Email alert function (Gmail)
def send_email_alert(subject, body):
    sender = "your_email@gmail.com"
    receiver = "receiver_email@gmail.com"
    password = "your_app_password"

    msg = f"Subject: {subject}\n\n{body}"

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, receiver, msg)
        server.quit()
        print("Email sent")
    except Exception as e:
        print("Email failed:", e)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

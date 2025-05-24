#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define RAIN_PIN A0
#define LDR_PIN A1

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int rain = analogRead(RAIN_PIN);
  int light = analogRead(LDR_PIN);

  // Send as URL-encoded key=value pairs
  Serial.print("temperature=");
  Serial.print(temperature);
  Serial.print("&humidity=");
  Serial.print(humidity);
  Serial.print("&rain=");
  Serial.print(rain);
  Serial.print("&light=");
  Serial.println(light);

  delay(15000); // 15 sec interval
}

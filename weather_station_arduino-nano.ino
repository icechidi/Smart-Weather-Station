//#SMART-WEATHER-STATION
//#CHIDI-ISAAC-ORJINZE - 32320914
//#BASHAR RABEE - 32320853
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define RAIN_PIN A2
#define LDR_PIN A5

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

  Serial.print(temperature); Serial.print(",");
  Serial.print(humidity); Serial.print(",");
  Serial.print(rain); Serial.print(",");
  Serial.println(light);

  delay(10000);
}

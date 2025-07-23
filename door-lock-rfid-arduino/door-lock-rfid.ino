#include <WiFi.h>
#include <FirebaseESP32.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <SPI.h>

// Pin Setup
#define SS_PIN 5
#define RST_PIN 27
#define RELAY_PIN 33
#define PIR_SENSOR 12
#define GREEN_LED 25
#define RED_LED 32
#define SDA_PIN 21
#define SCL_PIN 22

// WiFi & Firebase
const char* ssid = "pukimai1";
const char* password = "wann1236";
const char* FIREBASE_HOST = "https://monitoring-ruang-kelas-default-rtdb.firebaseio.com/";
const char* FIREBASE_AUTH = "AIzaSyAbJXnRwSGreNGDtP9L7fHx6WUwncMYA9M";

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "time.google.com", 28800, 60000);
FirebaseConfig config;
FirebaseAuth auth;
FirebaseData fbdo;

MFRC522 rfid(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Status
unsigned long lastMotionTime = 0;
unsigned long lastPirUpdate = 0;
unsigned long lastPirPrintTime = 0;
unsigned long lastSerialTime = 0;
unsigned long lastRFIDRead = 0;
unsigned long lcdMessageStart = 0;
unsigned long rfidCooldownStart = 0;

const unsigned long rfidCooldownTime = 0;

bool rfidReady = true;
bool solenoidUnlocked = false;
bool lastPirState = false;
bool accessGranted = false;
bool showLCDMessage = false;

String lastCardID = "";

String getDayOfWeek(int dayIndex) {
  const char* days[] = { "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu" };
  return (dayIndex >= 0 && dayIndex < 7) ? days[dayIndex] : "Unknown";
}

String getISO8601Time() {
  time_t rawtime = timeClient.getEpochTime();
  struct tm * ti;
  ti = gmtime(&rawtime);
  char buf[25];
  sprintf(buf, "%04d-%02d-%02dT%02d:%02d:%02dZ",
          ti->tm_year + 1900, ti->tm_mon + 1, ti->tm_mday,
          ti->tm_hour, ti->tm_min, ti->tm_sec);
  return String(buf);
}

String getFormattedTime(int hours, int minutes) {
  char buffer[6];
  sprintf(buffer, "%02d:%02d", hours, minutes);
  return String(buffer);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  Wire.begin(SDA_PIN, SCL_PIN);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(1, 0);
  lcd.print("Tap Your Card");

  SPI.begin();
  rfid.PCD_Init();

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(PIR_SENSOR, INPUT);

  digitalWrite(RELAY_PIN, HIGH);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, HIGH);

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(10240, 1024);
  fbdo.setResponseSize(10240);

  timeClient.begin();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
    }
    Serial.println("WiFi reconnected!");
  }

  timeClient.update();
  String day = getDayOfWeek(timeClient.getDay());
  String currentTime = getFormattedTime(timeClient.getHours(), timeClient.getMinutes());

  if (millis() - lastSerialTime >= 1000) {
    lastSerialTime = millis();
    Serial.print("Hari: ");
    Serial.print(day);
    Serial.print(" | Waktu: ");
    Serial.println(currentTime);
  }

  if (millis() - lastPirUpdate >= 2000) {
    lastPirUpdate = millis();
    bool motionDetected = digitalRead(PIR_SENSOR);
    if (motionDetected != lastPirState) {
      if (Firebase.setBool(fbdo, "/room2/sensor_pir/motion_detected", motionDetected)) {
        lastPirState = motionDetected;
        Serial.print("PIR Status (Firebase): ");
        Serial.println(motionDetected ? "Detected" : "No Motion");
      }
    }
  }

  // Pembacaan PIR setiap 5 detik ke Serial Monitor
  if (millis() - lastPirPrintTime >= 2000) {
    lastPirPrintTime = millis();
    bool pirStatus = digitalRead(PIR_SENSOR);
    Serial.print("PIR Reading : ");
    Serial.println(pirStatus ? "Motion Detected" : "No Motion");
  }

  if (accessGranted) {
    if (digitalRead(PIR_SENSOR)) {
      solenoidUnlocked = true;
      digitalWrite(RELAY_PIN, LOW);
      digitalWrite(GREEN_LED, HIGH);
      digitalWrite(RED_LED, LOW);
      lastMotionTime = millis();
    }

    if (solenoidUnlocked && millis() - lastMotionTime >= 10000) {
      solenoidUnlocked = false;
      digitalWrite(RELAY_PIN, HIGH);
      digitalWrite(GREEN_LED, LOW);
      digitalWrite(RED_LED, HIGH);

      rfid.PCD_Init();
      delay(100);
    }
  }

  // RFID Handling
if (rfidReady && rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
  String cardID = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) cardID += "0";
    cardID += String(rfid.uid.uidByte[i], HEX);
  }
  cardID.trim();
  cardID.toLowerCase();
  cardID.replace(" ", "");
  Serial.println("Card ID: " + cardID);

  String lecturer;
  
  // === FITUR UNLOCK DULU ===
  if (accessGranted && cardID == lastCardID) {
    // Kunci ulang
    solenoidUnlocked = false;
    accessGranted = false;
    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, HIGH);
    Firebase.setBool(fbdo, "/room2/door_status/solenoid_locked", true);
    logAccess(cardID, "locked", lecturer);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Kelas Terkunci");
    lcd.setCursor(0, 1);
    lcd.print("Terima Kasih");
  }
  // === CEK AKSES PERTAMA KALI ===
  else {
    bool granted = checkAccess(cardID, day, currentTime, lecturer);

    if (granted) {
      accessGranted = true;
      solenoidUnlocked = false;  // Akan terbuka saat motion terdeteksi
      lastCardID = cardID;       // Simpan ID untuk deteksi ulang
      digitalWrite(RELAY_PIN, LOW);
      digitalWrite(GREEN_LED, HIGH);
      digitalWrite(RED_LED, LOW);
      Firebase.setBool(fbdo, "/room2/door_status/solenoid_locked", false);
      logAccess(cardID, "granted", lecturer);

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Akses Diterima");
      lcd.setCursor(0, 1);
      lcd.print("Silahkan Masuk");
    } else {
      accessGranted = false;
      digitalWrite(RELAY_PIN, HIGH);
      digitalWrite(GREEN_LED, LOW);
      digitalWrite(RED_LED, HIGH);
      Firebase.setBool(fbdo, "/room2/door_status/solenoid_locked", true);
      logAccess(cardID, "denied", lecturer);

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Akses Ditolak");
      lcd.setCursor(0, 1);
      lcd.print("Hubungi Admin");
    }
  }

  showLCDMessage = true;
  lcdMessageStart = millis();

  rfidReady = false;
  rfidCooldownStart = millis();

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  rfid.PCD_Init();
  delay(100);
}


  // Reset LCD after 3 seconds
  if (showLCDMessage && millis() - lcdMessageStart >= 3000) {
    showLCDMessage = false;
    lcd.clear();
    lcd.setCursor(1, 0);
    lcd.print("Tap Your Card");
  }

  // RFID cooldown (1 detik)
  if (!rfidReady && millis() - rfidCooldownStart >= rfidCooldownTime) {
    rfidReady = true;
  }
}

void logAccess(String cardID, String status, String lecturer) {
  String path = "/room2/access_history/access_records";
  FirebaseJson accessRecord;
  accessRecord.set("card_id", cardID);
  accessRecord.set("timestamp", timeClient.getFormattedTime());
  accessRecord.set("status", status);
  accessRecord.set("lecturer", lecturer);

  if (Firebase.pushJSON(fbdo, path, accessRecord)) {
    Serial.println("Access logged successfully!");
  } else {
    Serial.println("Failed to log access!");
    Serial.println(fbdo.errorReason());
  }
}

bool checkAccess(String cardID, String day, String currentTime, String& lecturer) {
  Serial.println("== Memeriksa akses ke Firebase (JSON Array) ==");
  Serial.println("CardID: " + cardID);
  Serial.println("Hari: " + day);
  Serial.println("Jam : " + currentTime);

  String path = "/room2/schedule";
  if (Firebase.getArray(fbdo, path)) {
    FirebaseJsonArray& scheduleArray = fbdo.jsonArray();
    FirebaseJsonData item;

    for (size_t i = 0; i < scheduleArray.size(); i++) {
      if (scheduleArray.get(item, i)) {
        FirebaseJson scheduleItem;
        scheduleItem.setJsonData(item.stringValue);

        FirebaseJsonData scheduledDay, startTime, endTime, allowedCard, lecturerData;
        scheduleItem.get(scheduledDay, "day");
        scheduleItem.get(startTime, "start_time");
        scheduleItem.get(endTime, "end_time");
        scheduleItem.get(allowedCard, "card_id");
        scheduleItem.get(lecturerData, "lecturer");

        if (allowedCard.stringValue == cardID) {
          lecturer = lecturerData.stringValue;  // Simpan nama dosen meskipun hari atau waktu tidak cocok

          if (scheduledDay.stringValue == day &&
              currentTime >= startTime.stringValue &&
              currentTime <= endTime.stringValue) {

            Serial.println(">>> Akses diizinkan oleh Firebase (Array)!");
            return true;
          }
        }
      }
    }
  } else {
    Serial.print("Gagal mengakses Firebase: ");
    Serial.println(fbdo.errorReason());
  }

  Serial.println(">>> Akses ditolak oleh Firebase (Array)!");
  return false;
}

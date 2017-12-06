//#include <Wire.h>
#include <MIDI.h>
//#include "I2Cdev.h"
//#include "MPU6050.h"

#include <midi_Defs.h>
#include <midi_Message.h>
#include <midi_Namespace.h>
#include <midi_Settings.h>
struct MySettings : public midi::DefaultSettings
{
  static const bool UseRunningStatus = false;
  static const long BaudRate = 115200;
};

MIDI_CREATE_CUSTOM_INSTANCE(HardwareSerial, Serial, MIDI, MySettings);

const int velocity = 127; //Max Velocity (range is 0-127)
const int channel = 1; //MIDI Channel 1 (out of 16)
const int potSense1 = A1;
const int potSense2 = A2;
const int potSense3 = A3;
const int potSense4 = A4;
const int potSense5 = A5;
int lastPot1Value = 0;
int lastPot2Value = 0;
int lastPot3Value = 0;
int lastPot4Value = 0;
int lastPot5Value = 0;

//MPU6050 accelgyro;
//int16_t ax, ay, az;
//int16_t gx, gy, gz;

void setup() {
  MIDI.begin();
//  Wire.begin();
//  accelgyro.initialize();

}

void loop() {
//  accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
//  MIDI.sendControlChange(06, ax, 1);
   
  int newPot1Value = analogRead(potSense1) / 8; // read the input pin and divide by 8 to get between 0-127 for midi
  
  // int val = map(pot, 0, 1023, 0, 127);
  
  if (newPot1Value != lastPot1Value) {
    MIDI.sendControlChange(01, newPot1Value, 1);
    lastPot1Value = newPot1Value;
  }

  int newPot2Value = analogRead(potSense2) / 8; // read the input pin and divide by 8 to get between 0-127 for midi

  if (newPot2Value != lastPot2Value) {
    MIDI.sendControlChange(02, newPot2Value, 1);
    lastPot2Value = newPot2Value;
  }

  int newPot3Value = analogRead(potSense3) / 8; // read the input pin and divide by 8 to get between 0-127 for midi
  
  if (newPot3Value != lastPot3Value) {
    MIDI.sendControlChange(03, newPot3Value, 1);
    lastPot3Value = newPot3Value;
  }

   int newPot4Value = analogRead(potSense4) / 8; // read the input pin and divide by 8 to get between 0-127 for midi

  if (newPot4Value != lastPot4Value) {
    MIDI.sendControlChange(04, newPot4Value, 1);
    lastPot4Value = newPot4Value;
  }

    int newPot5Value = analogRead(potSense5) / 8; // read the input pin and divide by 8 to get between 0-127 for midi

  if (newPot5Value != lastPot5Value) {
    MIDI.sendControlChange(05, newPot5Value, 1);
    lastPot5Value = newPot5Value;
  }
//  delay(2000);
}

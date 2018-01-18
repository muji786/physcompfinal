#include <MIDI.h>
#include <midi_Defs.h>
#include <midi_Message.h>
#include <midi_Namespace.h>
#include <midi_Settings.h>
struct MySettings : public midi::DefaultSettings
{
  static const bool UseRunningStatus = false;
  static const long BaudRate = 115200; //Baudrate for Hairless
};

//Formatted as (Serial Type (HW of SW), name of arduino serial, name of port, custom settings)
MIDI_CREATE_CUSTOM_INSTANCE(HardwareSerial, Serial, MIDI, MySettings);

//declaring pots
const int potSense0 = A0;
const int potSense1 = A1;
const int potSense2 = A2;
const int potSense3 = A3;
const int potSense4 = A4;
const int potSense5 = A5;

//declaring previous value variables
int lastPot0Value = 0;
int lastPot1Value = 0;
int lastPot2Value = 0;
int lastPot3Value = 0;
int lastPot4Value = 0;
int lastPot5Value = 0;

void setup() {
  //Start listening for MIDI in on the serial port.  Used in place of Serial.begin()
  MIDI.begin();
}

void loop() {
  //Divide sensor reading by 8 to get between 0-127 -- MIDI Standard
  int newPot0Value = analogRead(potSense0) / 8;  
  if (newPot0Value != lastPot0Value) {
    //Send MIDI CC (Control Number (0-127), pot reading, MIDI Channel (1-16)) 
    MIDI.sendControlChange(01, newPot0Value, 1);
    lastPot0Value = newPot0Value;
  }

  int newPot1Value = analogRead(potSense1) / 8; 
    
  if (newPot1Value != lastPot1Value) {
    //Send MIDI CC (Control Number (0-127), pot reading, MIDI Channel (1-16)) 
    MIDI.sendControlChange(02, newPot1Value, 1);
    lastPot1Value = newPot1Value;
  }

  int newPot2Value = analogRead(potSense2) / 8; 

  if (newPot2Value != lastPot2Value) {
    //Send MIDI CC (Control Number (0-127), pot reading, MIDI Channel (1-16)) 
    MIDI.sendControlChange(03, newPot2Value, 1);
    lastPot2Value = newPot2Value;
  }

  int newPot3Value = analogRead(potSense3) / 8; 
  
  if (newPot3Value != lastPot3Value) {
    //Send MIDI CC (Control Number (0-127), pot reading, MIDI Channel (1-16)) 
    MIDI.sendControlChange(04, newPot3Value, 1);
    lastPot3Value = newPot3Value;
  }

   int newPot4Value = analogRead(potSense4) / 8; 

  if (newPot4Value != lastPot4Value) {
    //Send MIDI CC (Control Number (0-127), pot reading, MIDI Channel (1-16)) 
    MIDI.sendControlChange(05, newPot4Value, 1);
    lastPot4Value = newPot4Value;
  }

    int newPot5Value = analogRead(potSense5) / 8; 

  if (newPot5Value != lastPot5Value) {
    //Send MIDI CC (Control Number (0-127), pot reading, MIDI Channel (1-16)) 
    MIDI.sendControlChange(06, newPot5Value, 1);
    lastPot5Value = newPot5Value;
  }
}

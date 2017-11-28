const int sampleWindow = 50; // Sample window width in mS (50 mS = 20Hz)
unsigned int sample;


void setup() {
 Serial.begin(9600); // initialize serial communications
}
 
void loop() {
 int fsr1 = analogRead(A0); // read the input pin
 //int mappedFSR = map(fsr1, 0, 1023, 0, 255); // remap the pot value to fit in 1 byte
 Serial.print(fsr1); // print it out the serial port
 Serial.print(",");

 int fsr2 = analogRead(A1); // read the input pin
 //int mappedFSR2 = map(fsr2, 0, 1023, 0, 255); // remap the pot value to fit in 1 byte
 Serial.print(fsr2); // print it out the serial port
 Serial.print(",");

 int fsr3 = analogRead(A2); // read the input pin
 //int mappedFSR3 = map(fsr3, 0, 1023, 0, 255); // remap the pot value to fit in 1 byte
 Serial.print(fsr3); // print it out the serial port
 Serial.print(",");

 int fsr4 = analogRead(A3); // read the input pin
 int mappedFSR4 = map(fsr4, 0, 1023, 0, 255); // remap the pot value to fit in 1 byte
 Serial.print(fsr4); // print it out the serial port
 Serial.print(","); 

 int pot = analogRead(A4); // read the input pin
 int mappedPot = map(pot, 0, 1023, 0, 1023); // remap the pot value to fit in 1 byte
 Serial.println(mappedPot); // print it out the serial port

//  unsigned long startMillis= millis();  // Start of sample window
//   unsigned int peakToPeak = 0;   // peak-to-peak level
// 
//   unsigned int signalMax = 0;
//   unsigned int signalMin = 1024;
// 
//   // collect data for 50 mS
//   while (millis() - startMillis < sampleWindow)
//   {
//      sample = analogRead(A5);
//      if (sample < 1024)  // toss out spurious readings
//      {
//         if (sample > signalMax)
//         {
//            signalMax = sample;  // save just the max levels
//         }
//         else if (sample < signalMin)
//         {
//            signalMin = sample;  // save just the min levels
//         }
//      }
//   }
//   peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
//   double volts = (peakToPeak * 5.0) - 60;  // convert to volts
// 
//   Serial.println(volts);

 //delay(100);
}


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

 int pot = analogRead(A5); // read the input pin
 int mappedPot = map(pot, 0, 1023, 0, 5); // remap the pot value to fit in 1 byte
 Serial.println(mappedPot); // print it out the serial port
 //Serial.print(mappedPot);

 delay(10);
}


//Serial Variables
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421';
let inData; // for incoming serial data
let sensor1;
let sensor2;
let sensor3;
let sensor4;


//Sketch Variables
let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier
let filter, filterfreq, filterres;
let analyzer; // we'll use this visualize the waveform
let delay;
let distortion;
let env;
let oscType = "sine"; // default value is sine

//array to be used for assigning the base oscillator frequency in the C minor scale
let freqArray = [261.626, 293.665, 311.127, 349.228, 391.995, 415.305, 466.164];

//array to be used for assigning oscillator type
let oscArray = ['sine', 'square', 'sawtooth', 'triangle'];

// the carrier frequency pre-modulation
let carrierBaseFreq;

// min/max ranges for modulator
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;


function setup() {
    let cnv = createCanvas(800, 400);
    noFill();

<<<<<<< HEAD
    
    //********************************************SERIAL SETUP********************************************
    //********************************************SERIAL SETUP********************************************
    //********************************************SERIAL SETUP********************************************
    //********************************************SERIAL SETUP********************************************
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('list', printList); // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen); // callback for the port opening
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.on('close', portClose); // callback for the port closing

    serial.list(); // list the serial ports
    serial.open(portName); // open a serial port
    //****************************************************************************************************
    //****************************************************************************************************
    //****************************************************************************************************
    //****************************************************************************************************

    let r = round(random(0, freqArray.length));
    carrierBaseFreq = freqArray[r];

=======
    carrierBaseFreq = random(freqArray);
>>>>>>> c82f5c89bbec6708c9268c65bcf8d7151401604f
    oscType = random(oscArray);

    carrier = new p5.Oscillator(random(oscArray));
    carrier.amp(0); // set amplitude

    //****************************************************************************************************
    //THE BELOW ENVELOPE IS NOT YET WORKING.  THIS SHOULD CREATE A SMOOTH START TO EACH NOTE DUE TO 
    //THE LONG ATTACK VALUE OF 0.8
    //****************************************************************************************************

    env = new p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    env.setADSR(1, 1, 0.2, 3);
    // set attackLevel, releaseLevel
    env.setRange(1, 0);

    //****************************************************************************************************
    //THE ABOVE ENVELOPE IS NOT YET WORKING.  THIS SHOULD CREATE A SMOOTH START TO EACH NOTE DUE TO 
    //THE LONG ATTACK VALUE OF 0.8
    //****************************************************************************************************

    carrier.freq(carrierBaseFreq); // set frequency
    carrier.start(); // start oscillating

    distortion = new p5.Distortion();

    filter = new p5.LowPass();
    carrier.disconnect();

<<<<<<< HEAD
    delaySounds();

=======
    // delaySounds();
>>>>>>> c82f5c89bbec6708c9268c65bcf8d7151401604f

    carrier.connect(filter);
    carrier.connect(distortion);
    //distortion.drywet(.1);

    // try changing the type to 'square', 'sine' or 'triangle'
    modulator = new p5.Oscillator('sine');
    modulator.start();

    // add the modulator's output to modulate the carrier's frequency
    modulator.disconnect();
    //carrier.freq(modulator);

    // create an FFT to analyze the audio
    analyzer = new p5.FFT();

    // fade carrier in/out on mouseover / touch start
    toggleAudio(cnv);
}

function draw() {
    background(30);
    display();

    //    text('Carrier Oscillator Type: ' + oscType, width / 2, 40);


<<<<<<< HEAD

}

function display(){
  // map mouseY to modulator freq between a maximum and minimum frequency
  let modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
  modulator.freq(modFreq);
  filterfreq = map(mouseX, 0, width, 10, 22050);
  filterres = map(mouseY, 0, height, 15, 5);
  filter.freq(filterfreq);
  filter.res(filterres);
=======
}

function display() {
    // map mouseY to modulator freq between a maximum and minimum frequency
    let modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
    modulator.freq(modFreq);
    filterfreq = map(mouseX, 0, width, 10, 22050);
    filterres = map(mouseY, 0, height, 15, 5);
    filter.freq(filterfreq);
    filter.res(filterres);
>>>>>>> c82f5c89bbec6708c9268c65bcf8d7151401604f
    //console.log(filterfreq);

    // change the amplitude of the modulator
    // negative amp reverses the sawtooth waveform, and sounds percussive

    let modDepth = map(mouseX, mouseY, width, modMinDepth, modMaxDepth);
    modulator.amp(modDepth);

    // analyze the waveform
    waveform = analyzer.waveform();

    // draw the shape of the waveform
    stroke(255);
    strokeWeight(10);
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, -height / 2, height / 2);
        vertex(x, y + height / 2);
        //vertex(y, x - width/2);
    }
    endShape();

    strokeWeight(1);
    // add a note about what's happening
    text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
    text('Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3), 20, 40);
    text('Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz', width / 2, 20);
    text('Carrier Oscillator Type: ' + oscType, width / 2, 40);
    console.log(oscType);
}

function delaySounds() {

    delay = new p5.Delay();
    // .12, .7. 2300 as default
    // source, delayTime, feedback, filter frequency
    delay.process(carrier, .12, .7, 20000);
    delay.setType('pingPong');

    //delay.filter(filterFreq, filterRes);
    let delTime = map(mouseY, 0, width, .5, .01);
    delTime = constrain(delTime, .01, .5);
    delay.delayTime(delTime);
    // delay.process(carrier, 0.22, feedback, 230000);

}

// helper function to toggle sound
function toggleAudio(cnv) {
    cnv.mouseClicked(function () {
        //carrier.amp(0.2, 0.01);
        env.play(carrier);
    });
    //    cnv.touchStarted(function () {
    //        // carrier.amp(0.2, 0.01);
    //    });
    //    cnv.mouseOut(function () {
    //        //carrier.amp(0.0, 1.0);
    //        env.play(carrier);
    //
    //    });
}



//**************************************SERIAL FUNCTIONS*******************************************
//**************************************SERIAL FUNCTIONS*******************************************
//**************************************SERIAL FUNCTIONS*******************************************
//**************************************SERIAL FUNCTIONS*******************************************

// get the list of ports:
function printList(portList) {
    // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {
        // Display the list the console:
        console.log(i + " " + portList[i]);
    }
}

function serverConnected() {
    console.log('connected to server.');
}

function portOpen() {
    console.log('the serial port opened.')
}

function serialEvent() {
    // read a string from the serial port:
    var inString = serial.readStringUntil('\r\n');
    // check to see that there's actually a string there:
    if (inString.length > 0) {
        var sensors = split(inString, ',');
        sensor1 = sensors[1];
        sensor2 = sensors[0];
        sensor3 = sensors[2];
        sensor4 = sensors[3];

        // if (sensor1 >= 25) {
        //     var m = map(sensor1, 25, 1023, 0.1, 1.0);

        //     }
        // }
        // if (sensor2 >= 25) {
        //     var m = map(sensor2, 25, 1023, 0.1, 1.0);


        //     }
        // }
        // if (sensor3 >= 25) {
        //     var m = map(sensor3, 25, 1023, 0.1, 1.0);

        //     }
        // }
        if (sensor4 >= 100) {
            var m = map(sensor4, 25, 1023, 0.1, 1.0);     

            //carrier.amp(0.2, 0.01);
            env.setADSR(0.8, 0.7, 0.2, 0.8);


            console.log("playing Cello at volume : " + m);

        }
    }
}


function serialError(err) {
    console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
    console.log('The serial port closed.');
}


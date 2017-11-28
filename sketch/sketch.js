let mic;

/*********************************tone.js Variables*********************************
 **********************************tone.js Variables*********************************
 **********************************tone.js Variables********************************/
//pan the input signal hard right.
let panner = new Tone.Panner(0);
//new Tone.LowpassCombFilter ( [ delayTime ] , [ resonance ] , [ dampening ] )
let LPC = new Tone.LowpassCombFilter(1, 1.5, 25)

let phaser = new Tone.Phaser({
    "frequency": 1,
    "octaves": 5,
    "baseFrequency": 10000
}).toMaster();

let autoFilter = new Tone.AutoFilter("4n").toMaster().start();
let autoFilter2 = new Tone.AutoFilter("32n").toMaster().start();
let comp = new Tone.Compressor(-30, 3);
let ampEnv = new Tone.AmplitudeEnvelope({
    "attack": 5,
    "decay": 0.2,
    "sustain": 0.2,
    "release": 0.2
}).toMaster();

let limiter = new Tone.Limiter(-12);
//let synthArray = ['Tone.PluckSynth', 'Tone.SimpleSynth'];
let chorus = new Tone.Chorus(40, 25, 0.5);

let reverb = new Tone.JCReverb(0.9).connect(Tone.Master);
let delay2 = new Tone.FeedbackDelay(0.6);
let bitcrushVal = 200;
let bitcrusher = new Tone.BitCrusher(bitcrushVal).toMaster();
//routing synth through the reverb
//let synth = new Tone.PolySynth(6, Tone.FMSynth).toMaster();
let synth = new Tone.PolySynth(6, Tone.FMSynth, Tone.AMSynth).chain(phaser, panner, comp, autoFilter, autoFilter2, bitcrusher, ampEnv, delay2, chorus, reverb, LPC, limiter);
//synth.triggerAttackRelease("A4","8n");
ampEnv.triggerAttackRelease("2t");
Tone.Transport.bpm.value = 120;

/*********************************Serial Variables*********************************
 **********************************Serial Variables*********************************
 **********************************Serial Variables********************************/
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1461';
let inData; // for incoming serial data
let sensor1;
let sensor2;
let sensor3;
let sensor4;
let sensor5;

/*********************************p5.sound Variables*********************************
 **********************************p5.sound Variables*********************************
 **********************************p5.sound Variables********************************/
let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier
let filter, filterfreq, filterres;
let analyzer; // we'll use this visualize the waveform
let delay;
let distortion;
let env;
let oscType = "sine"; // default value is sine

let cnv = 0;
let gridSize = 10;
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
let oldvalue = 0;

function setup() {
    cnv = createCanvas(800, 400);
    //noFill();
    // Create an Audio input
    mic = new p5.AudioIn();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();

    frameRate(20);
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


    oscType = random(oscArray);

    carrier = new p5.Oscillator("square");
    carrier.amp(0); // set amplitude
    console.log(oscType);

    env = new p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    //env.setADSR(10, .5, 1, 1);
    env.setADSR(10, 0.5, 0.1, 0.5);
    //env.setADSR(10, .5, 0.1, 0.5);
    // set attackLevel, releaseLevel
    env.setRange(.2, 0);


    carrier.start(); // start oscillating

    //distortion = new p5.Distortion();

    filter = new p5.LowPass();
    carrier.disconnect();

    //delaySounds();

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
    Tone.Transport.start();

}

function draw() {
    background(0);
    display();
}

function display() {
    // map mouseY to modulator freq between a maximum and minimum frequency
    let modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
    modulator.freq(modFreq);
    filterfreq = map(mouseX, 0, width, 10, 1000);
    filterres = map(mouseY, 0, height, 15, 5);
    filter.freq(filterfreq);
    filter.res(filterres);
    //console.log(filterfreq);

    // change the amplitude of the modulator
    // negative amp reverses the sawtooth waveform, and sounds percussive

    let modDepth = map(mouseX, mouseY, width, modMinDepth, modMaxDepth);
    modulator.amp(modDepth);

    // analyze the waveform
    waveform = analyzer.waveform();

    // draw the shape of the waveform
    // stroke(255);
    // strokeWeight(10);
    beginShape();
    for (let i = 0; i < waveform.length; i += .25) {

        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, -height / 2, height / 2);

        let mappedX = map(x, 0, waveform.length, 0, 255);
        let mappedY = map(y, 0, waveform.length, 0, 255);
        fill(mappedY + mappedX, mappedX, random(255));
        //stroke(mappedY+mappedX, mappedX, random(255));
        stroke(0);
        strokeWeight(.8);
        //vertex(x, y + height / 2);
        //vertex(x, y + height / 2);
        fill(noise(mappedY + mappedX), random(mappedX), mappedY);
        //stroke(mappedY+mappedX, mappedX, random(255));
        rect(x, y + height / 2, 20, 20);
        //vertex(x, y+height-100 );
        fill(noise(-mappedY + mappedX), mappedX, random(255));
        //stroke(-mappedY+mappedX, random(200, 255), mappedY);
        //noStroke();
        rect(x, y + height - height / 4, 20, 2);
        rect(x, y + height / 4, 20, 2);
        //vertex(x, y + height / 2);
    }
    for (var x = gridSize; x <= width - gridSize; x += gridSize) {
        for (var y = gridSize; y <= height - gridSize; y += gridSize) {
            noStroke();
            fill(255, 255);
            let mappedMouseX = map(mouseX, width, height, 20, 0);
            let mappedMouseY = map(mouseY, width, height, 20, 0);
            // Get the overall volume (between 0 and 1.0)
            var vol = mic.getLevel();
            noFill();
            stroke(255);
            strokeWeight(.1);

            rect(x - 1, y - 1, 2, 2);

            //line(x, y, width/2, height/2);
        }
    }
    endShape();
    push();
    strokeWeight(1);
    stroke(255);

    // add a note about what's happening
    // text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
    // text('Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3), 20, 40);
    text('Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz', width / 2, 20);
    // text('Carrier Oscillator Type: ' + oscType, width / 2, 40);
    //console.log(oscType);
    pop();
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
        carrierBaseFreq = random(freqArray);
        carrier.freq(carrierBaseFreq); // set frequency
        env.play(carrier);
        //for(let z = 1; z<=5; z++){
        let mult = 2;
        var pattern = new Tone.Pattern(function (time, note) {
            synth.triggerAttackRelease(note, 2);
            //     //Cm SCALE
        }, [261.626, mult * 261.626, mult * 293.665, mult * 311.127, mult * 349.228, mult * 391.995, mult * 415.305, mult * 466.164, mult * 523.25, ]);
        //C MAJOR SCALE
        //[mult * 261.626, mult * 293.66, mult * 329.63, mult * 349.23, mult * 392.00, mult * 440.00, mult * 493.88, mult * 523.25]);
        //begin at the beginning
        pattern.start(0);

        pattern.pattern = "random";
        console.log(mult);

        /*********************************Second Pattern and Synth*********************************
         **********************************Second Pattern and Synth*********************************
         **********************************Second Pattern and Synth********************************/

        var pattern2 = new Tone.Pattern(function (time, note) {
            synth.triggerAttackRelease(note, 1);
            //Cm SCALE
        }, [mult / 2 * 261.626, mult / 2 * 293.665, mult / 2 * 311.127, mult / 2 * 349.228, mult / 2 * 391.995, mult / 2 * 415.305, mult / 2 * 466.164, mult / 2 * 523.25, ]);
        //C MAJOR SCALE
        //[mult * 261.626, mult * 293.66, mult * 329.63, mult * 349.23, mult * 392.00, mult * 440.00, mult * 493.88, mult * 523.25]);
        pattern2.start(0);

        pattern2.pattern = "random";

        /*********************************Second Pattern and Synth*********************************
         **********************************Second Pattern and Synth*********************************
         **********************************Second Pattern and Synth********************************/



        //humanize the playback of the pattern
        pattern.humanize = "4n";
        //stop playing after 4 measures
        // pattern.stop("4m");
        // pattern2.stop("4m");
    });

}


//**************************************Single Note Loop*******************************************
//**************************************Single Note Loop*******************************************
//**************************************Single Note Loop*******************************************
//**************************************Single Note Loop*******************************************

//create a looped note event every half-note
var note = new Tone.Event(function (time, pitch) {
    synth.triggerAttackRelease(pitch, "16n", time);
}, ["D4"]);

//set the note to loop every half measure
note.set({
    "loop": true,
    "loopEnd": "1m"
});

//start the note at the beginning of the Transport timeline
note.start();

//stop the note on the 4th measure
note.stop("4m");

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
        sensor5 = sensors[4];

        // if (sensor1 >= 25) {
        //     var m = map(sensor1, 25, 1023, 0.1, 1.0);

        //     }
        // }
        // if (sensor2 >= 25) {
        //     var m = map(sensor2, 25, 1023, 0.1, 1.0);


        //     }
        // }
        if (sensor3 >= 25) {
            //var m = map(sensor3, 25, 1023, 0.1, 1.0);
            if (sensor3 > oldvalue) {
                let mult = 1;
                var pattern = new Tone.Pattern(function (time, note) {
                    synth.triggerAttackRelease(note, .1);
                }, [mult * 261.626, mult * 293.665, mult * 311.127, mult * 349.228, mult * 391.995, mult * 415.305, mult * 466.164]);
                pattern.pattern = "random";
                console.log(sensor3);

                //begin at the beginning

                pattern.start(0);
            } else pattern.stop(4 m);

            oldvalue = sensor3 + 10;
        }
    }
    if (sensor4 >= 100) {
        var m = map(sensor4, 25, 1023, 0.1, 1.0);
        //carrier.amp(0.2, 0.01);
        env.play(carrier);
        //carrierBaseFreq = random(freqArray);
        //oscType = random(oscArray);
        //carrier = new p5.Oscillator(random(oscArray));

        console.log("playing Cello at volume : " + m);



    }
}



function serialError(err) {
    console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
    console.log('The serial port closed.');
}

var auCtx    = new AudioContext();
var osc      = auCtx.createOscillator();
var gain     = auCtx.createGain();
var filter   = auCtx.createBiquadFilter();  
var dest     = auCtx.destination;
var analyser = auCtx.createAnalyser();
var tuna     = new Tuna(auCtx);


analyser.fftSize = 2048;


var fx_dist   = new tuna.Overdrive({
                        outputGain: 0.1,         //0 to 1+
                        drive: 0.1,              //0 to 1
                        curveAmount: 0.7,          //0 to 1
                        algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
                        bypass: 0
                    });

var fx_chorus = new tuna.Chorus({
                        rate: 4,         //0.01 to 8+
                        feedback: 0.2,     //0 to 1+
                        delay: 0.0045,     //0 to 1
                        bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
                    });

var fx_phaser = new tuna.Phaser({
                        rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
                        depth: 0.3,                    //0 to 1
                        feedback: 0.2,                 //0 to 1+
                        stereoPhase: 90,               //0 to 180
                        baseModulationFrequency: 700,  //500 to 1500
                        bypass: 0
                    });

/*var fx_delay   = new tuna.Delay({
                        feedback: 0.3,    //0 to 1+
                        delayTime: 300,    //how many milliseconds should the wet signal be delayed?
                        wetLevel: 0.25,    //0 to 1+
                        dryLevel: 1,       //0 to 1+
                        cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
                        bypass: 0
                    });*/




osc.connect(filter);
filter.connect(fx_chorus);
//fx_dist.connect(fx_chorus);
//fx_phaser.connect(fx_chorus);
//fx_delay.connect(fx_chorus);
fx_chorus.connect(gain);
gain.connect(dest);
gain.connect(analyser);

osc.frequency.value     = 110;
osc.type                = 'square';
filter.type             = "lowpass";
filter.frequency.value  = 8000;
gain.gain.value         = 0.5;


osc.start();

var scopeCtx = document.getElementById('scope').getContext('2d');
var spectCtx = document.getElementById('spectrum').getContext('2d');

draw();


var note = {
    'G2':  97.9989,
    'G#2': 103.826,
    'Ab2': 103.826,
    'A2':  110.000,
    'A#2': 116.541,
    'Bb2': 116.541,
    'B2':  123.471,
    'Cb3': 123.471,
    'B#2': 130.813,
    'C3':  130.813,
    'C#3': 138.591,
    'Db3': 138.591,
    'D3':  146.832,
    'D#3': 155.563,
    'Eb3': 155.563,
    'E3':  164.814,
    'Fb3': 164.814,
    'E#3': 174.614,
    'F3':  174.614,
    'F#3': 184.997,
    'Gb3': 184.997,
    'G3':  195.998,
    'G#3': 207.652,
    'Ab3': 207.652,
    'A3':  220.000,
    'A#3': 233.082,
    'Bb3': 233.082,
    'B3':  246.942,
    'Cb4': 246.942,
    'B#3': 261.626,
    'C4':  261.626,
    'C#4': 277.183,
    'Db4': 277.183,
    'D4':  293.665,
    'D#4': 311.127,
}


var scale = 'OFF';

var scale_notes = {
    /*'A': [
        0,       // OFF
        110.000, // A2
        123.471, // B2
        130.813, // C3
        146.832, // D3
        164.814, // E3
        184.997, // F#3
        207.652, // G#3
        220.000, // A3

    ],
    'A#/Bb': [
        0,       // OFF
        116.541, // A#2
        130.813, // C3
        138.591, // C#3
        155.563, // Eb3
        174.614, // F3
        195.998, // G3
        220.000, // A3
        233.082  // A#3
    ],
    'B': [
        0,       // OFF
        123.471, // B2
        138.591, // C#3
        146.832, // D3
        164.814, // E3
        184.997, // F#3
        207.652, // G#3
        233.082, // A#3
        246.942  // B3
    ],*/
    'OFF': 0,
    'C minor': [
        0,       // OFF
        130.813, // C3
        146.832, // D3
        164.814, // E3
        174.614, // F3
        195.998, // G3
        220.000, // A3
        246.942, // B3
        261.626  // C4
    ],
    'C major pentatonic': [
        0,       // OFF
        130.813, // C3
        146.832, // D3
        164.814, // E3
        195.998, // G3
        220.000, // A3
    ],
    'G major pentatonic': [
        0,       // OFF
        97.9989, // G2
        110.000, // A2
        123.471, // B2
        146.832, // D3
        164.814, // E3
    ],
    'Eb major pentatonic': [
        0,       // OFF
        155.563, // Eb3
        174.614, // F3
        195.998, // G3
        233.082, // Bb3
        261.626, // C4
    ],
    'E minor pentatonic': [
        0,       // OFF
        164.814, // E3
        195.998, // G3
        220.000, // A3
        246.942,  // B3
        293.665  // D4
    ],
}




function convScale(value) {
    value = parseFloat(value);
    var notes;

    if (scale != 'OFF') {
        notes = scale_notes[scale];

        for ( var i = 1; i < notes.length; i++) {
            if (value > notes[i-1] && value < notes[i]) {
                value = notes[i];
            }
            if (i == notes.length-1 && value > notes[i]) {
                 value = notes[i];
            }
        }
    }

    return value;
}




function gainInp(val) {
    document.querySelector('#gainVal').value = val;
    gain.gain.value = val;
}

function freqInp(val) {
    val = parseFloat(val);
    val = val != 0 ? val + 50 : val;
    val = convScale(val);
    document.querySelector('#freqVal').value = val;
    document.querySelector('#freq').value = val;
    osc.frequency.value = val;
}

function shapeInp(val) {
    document.querySelector('#shapeVal').value = val;

    switch (val) {
        case '2':
            osc.type = 'square';
            break;
        case '3':
            osc.type = 'sawtooth';
            break;
        case '4':
            osc.type = 'triangle';
            break;
        default:
            osc.type = 'sine';
            break;
    }
}

function filterInp(val) {
    document.querySelector('#filterVal').value = val;
    filter.frequency.value = val;
}

function setScale(val) {
    switch (Number(val)) {
        case 0: {
            scale = 'OFF';
            break;
        }
        case 1: {
            scale = 'C minor';
            break;
        }
        case 2: {
            scale = 'C major pentatonic';
            break;
        }
        case 3: {
            scale = 'G major pentatonic';
            break;
        }
        case 4: {
            scale = 'Eb major pentatonic';
            break;
        }
        case 5: {
            scale = 'E minor pentatonic';
            break;
        }
    }
    document.querySelector('#scaleVal').value = scale;
}

function silence() {
    gain.gain.value = 0;
}

function draw() {
    drawSpectrum(analyser, spectCtx);
    drawScope(analyser, scopeCtx);

    requestAnimationFrame(draw);
}

function drawSpectrum(analyser, ctx) {
    var width     = ctx.canvas.width;
    var height    = ctx.canvas.height;
    var freqData  = new Uint8Array(analyser.frequencyBinCount);
    var scaling   = height / 256;

    analyser.getByteFrequencyData(freqData);

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(100, 150, 200)';
    ctx.beginPath();

    for (var x = 0; x < width; x++) {
        ctx.lineTo(x, height - freqData[x] * scaling);
    }

    ctx.stroke();
}

function drawScope(analyser, ctx) {
    var width         = ctx.canvas.width;
    var height        = ctx.canvas.height;
    var timeData      = new Uint8Array(analyser.frequencyBinCount);
    var scaling       = height / 256;
    var risingEdge    = 0;
    var edgeThreshold = 5;

    analyser.getByteTimeDomainData(timeData);

    //ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(100, 150, 200)';
    ctx.beginPath();

    // No buffer overrun protection
    while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width) {}

    if (risingEdge >= width) {
        risingEdge = 0;
    }

    while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width) {}

    if (risingEdge >= width) {
        risingEdge = 0;
    }

    for (var x = risingEdge; x < timeData.length && x - risingEdge < width; x++) {
        ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);
    }

    ctx.stroke();
}
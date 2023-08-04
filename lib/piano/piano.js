// The midi notes of a scale
let notes = [60, 62, 64, 65, 67, 69, 71, 72, 74];

// For automatically playing the song
let index = 0;

let trigger = 0;
let autoplay = false;
let osc;

// Define the mapping between MIDI notes and key letters
let keyMappings = {
  60: 'a', // C4 -> 'a'
  62: 's', // D4 -> 's'
  64: 'd', // E4 -> 'd'
  65: 'f', // F4 -> 'f'
  67: 'g', // G4 -> 'g'
  69: 'h', // A4 -> 'h'
  71: 'j', // B4 -> 'j'
  72: 'k', // C5 -> 'z'
  74: 'l'  // D5 -> 'x'
};

function setup() {
  createCanvas(720, 400);
  
  // A triangle oscillator
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  // Start silent
  osc.start();

  // Enable sound on user gesture
  userStartAudio().then(function () {
    // Sound is enabled
  });
}

function playNoteByKey(key) {
  // Check if the key exists in the mapping
  if (keyMappings.hasOwnProperty(key)) {
    let note = key;
    let { duration } = keyMappings[key];
    playNote(note, duration);
  }
}

function keyTyped() {
  // Play the note when certain keys are typed
  playNoteByKey(key);
}

function keyPressed() {
  // Get the key letter of the pressed key
  let keyLetter = key;
  
  // Find the MIDI note value corresponding to the pressed key letter
  let note = Object.keys(keyMappings).find((midiNote) => keyMappings[midiNote] === keyLetter);
  
  // If a valid MIDI note is found, play the corresponding note with a duration of 200 ms
  if (note !== undefined) {
    playNote(note, 300);
  }
}

function draw() {
  // Draw a keyboard
  // The width for each key
  let w = width / notes.length;
  for (let i = 0; i < notes.length; i++) {
    let x = i * w;
    // If the mouse is over the key or the key is pressed
    if ((mouseX > x && mouseX < x + w && mouseY < height) || (keyIsPressed && keyMappings[notes[i]] === key)) {
      // If we're clicking or the key is pressed
      if (mouseIsPressed || keyIsPressed) {
        fill(100, 255, 200);
      // Or just rolling over
      } else {
        fill(127);
      }
    } else {
      fill(200);
    }

    // Draw the key
    rect(x, 0, w - 1, height - 1);

    // Display the corresponding key letter on the canvas keys
    fill(0);
    textAlign(CENTER, CENTER);
    text(keyMappings[notes[i]], x + w / 2, height / 2);
  }
}

// When we click
function mousePressed(event) {
  if (event.button == 0 && event.clientX < width && event.clientY < height) {
    // Map mouse to the key index
    let key = floor(map(mouseX, 0, width, 0, notes.length));
    playNote(notes[key]);
  }
}

// Fade it out when we release
function mouseReleased() {
  osc.fade(0, 0.5);
}

function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5, 0.2);

  // If we set a duration, fade it out
  if (duration) {
    setTimeout(function () {
      osc.fade(0, 0.2);
    }, duration - 50);
  }
}

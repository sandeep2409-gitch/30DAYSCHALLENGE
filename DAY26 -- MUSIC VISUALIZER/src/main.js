// src/main.js
import { AudioEngine } from './audio.js';
import { VisualizerEngine } from './visualizer.js';

// Instantiate engines
const audio = new AudioEngine();
let visualizer = null;
let isLoopRunning = false;

// DOM Elements
const landingOverlay = document.getElementById('landing-overlay');
const startBtn = document.getElementById('start-btn');
const dashboard = document.getElementById('dashboard');
const sourceBadge = document.getElementById('source-badge');

// Audio Source buttons
const sourceSynth = document.getElementById('source-synth');
const sourceMic = document.getElementById('source-mic');
const sourceFile = document.getElementById('source-file');

// Conditional sections
const uploadZone = document.getElementById('upload-zone');
const audioInput = document.getElementById('audio-input');
const fileNameDisplay = document.getElementById('file-name-display');
const playbackControls = document.getElementById('playback-controls');
const playPauseBtn = document.getElementById('play-pause-btn');
const trackStatusText = document.getElementById('track-status-text');
const volumeGroup = document.getElementById('volume-group');

// Sliders and controls
const sensitivitySlider = document.getElementById('sensitivity-slider');
const sensitivityVal = document.getElementById('sensitivity-value');
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-value');
const volumeSlider = document.getElementById('volume-slider');
const volumeVal = document.getElementById('volume-value');
const autoRotateCheck = document.getElementById('auto-rotate-check');

// Mode & Theme Buttons
const modeButtons = document.querySelectorAll('.mode-btn');
const themeButtons = document.querySelectorAll('.theme-btn');

// Live meters
const meterBass = document.getElementById('meter-bass');
const meterMid = document.getElementById('meter-mid');
const meterTreble = document.getElementById('meter-treble');

// --- SYSTEM INITIALIZATION ---

startBtn.addEventListener('click', () => {
  // Initialize Audio
  audio.init();

  // Initialize Three.js visualizer engine
  visualizer = new VisualizerEngine(document.getElementById('visualizer-container'));
  
  // Apply initial settings from UI sliders
  visualizer.setSensitivity(sensitivitySlider.value);
  visualizer.setSpeed(speedSlider.value);
  visualizer.setAutoRotate(autoRotateCheck.checked);
  audio.setVolume(volumeSlider.value / 100);

  // Transition UI
  landingOverlay.classList.add('hidden');
  dashboard.classList.remove('hidden');

  // Trigger default procedural Synth Beat on startup
  selectSource('synth');

  // Start tick rendering loop
  if (!isLoopRunning) {
    isLoopRunning = true;
    tick();
  }
});

// --- MAIN ANIMATION TICK LOOP ---

function tick() {
  requestAnimationFrame(tick);
  
  if (!audio || !visualizer) return;

  // 1. Fetch analyzed frequency data from Web Audio
  const audioData = audio.getAudioData();

  // 2. Pass data to Three.js engine for updates
  visualizer.update(audioData);

  // 3. Update dashboard neon meter displays
  // Dampen values slightly to make UI bars smooth
  const bassPercent = Math.min(Math.round(audioData.bass * 100 * 1.1), 100);
  const midPercent = Math.min(Math.round(audioData.mid * 100 * 1.1), 100);
  const treblePercent = Math.min(Math.round(audioData.treble * 100 * 1.1), 100);

  meterBass.style.width = `${bassPercent}%`;
  meterMid.style.width = `${midPercent}%`;
  meterTreble.style.width = `${treblePercent}%`;
}

// --- AUDIO SOURCE MANAGEMENT ---

sourceSynth.addEventListener('click', () => selectSource('synth'));
sourceMic.addEventListener('click', () => selectSource('mic'));
sourceFile.addEventListener('click', () => selectSource('file'));

function selectSource(type) {
  // Reset active tabs
  sourceSynth.classList.remove('active');
  sourceMic.classList.remove('active');
  sourceFile.classList.remove('active');
  
  // Hide custom modules
  uploadZone.classList.add('hidden');
  playbackControls.classList.add('hidden');
  volumeGroup.classList.remove('hidden'); // Show volume by default

  audio.stopActiveSource();

  if (type === 'synth') {
    sourceSynth.classList.add('active');
    sourceBadge.textContent = 'SYNTH BEAT';
    sourceBadge.className = 'badge playing';
    
    // Sync current UI speed multiplier to synth tempo (base 110 BPM)
    audio.tempo = 110.0 * parseFloat(speedSlider.value);
    audio.startSynth();
  } 
  else if (type === 'mic') {
    sourceMic.classList.add('active');
    sourceBadge.textContent = 'MICROPHONE';
    sourceBadge.className = 'badge playing';
    volumeGroup.classList.add('hidden'); // Hide speaker volume for mic to prevent feedback

    audio.startMic().catch((err) => {
      alert('Microphone access denied or unavailable. Falling back to Synth Beat.');
      selectSource('synth');
    });
  } 
  else if (type === 'file') {
    sourceFile.classList.add('active');
    sourceBadge.textContent = 'UPLOAD';
    sourceBadge.className = 'badge';
    
    uploadZone.classList.remove('hidden');
    // Don't play anything yet, wait for file select
  }
}

// --- FILE UPLOAD PROCESSING ---

// File click upload trigger
uploadZone.addEventListener('click', (e) => {
  if (e.target !== audioInput) {
    audioInput.click();
  }
});

audioInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleAudioFile(file);
  }
});

// Drag & drop file event handlers
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('audio/')) {
    handleAudioFile(file);
  } else {
    alert('Please drop a valid audio file (MP3, WAV, etc.)');
  }
});

function handleAudioFile(file) {
  // Update file displays
  fileNameDisplay.textContent = file.name;
  trackStatusText.textContent = `Playing: ${file.name}`;
  
  // Show playback control group
  playbackControls.classList.remove('hidden');
  playPauseBtn.textContent = 'Pause';
  playPauseBtn.className = 'ctrl-btn';
  
  sourceBadge.textContent = 'PLAYING FILE';
  sourceBadge.className = 'badge playing';

  // Play file in engine
  audio.playFile(file);
}

// Local file Play/Pause toggler
playPauseBtn.addEventListener('click', () => {
  if (audio.isPlaying) {
    audio.pauseFile();
    playPauseBtn.textContent = 'Play';
    playPauseBtn.className = 'ctrl-btn paused';
    sourceBadge.className = 'badge';
    trackStatusText.textContent = 'Track Paused';
  } else {
    audio.resumeFile();
    playPauseBtn.textContent = 'Pause';
    playPauseBtn.className = 'ctrl-btn';
    sourceBadge.className = 'badge playing';
    trackStatusText.textContent = `Playing: ${audioInput.files[0]?.name || 'Uploaded File'}`;
  }
});

// --- PARAMETER AND SLIDER EVENTS ---

// Sensitivity
sensitivitySlider.addEventListener('input', (e) => {
  const val = e.target.value;
  sensitivityVal.textContent = `${val}x`;
  if (visualizer) visualizer.setSensitivity(val);
});

// Speed / Synth Tempo
speedSlider.addEventListener('input', (e) => {
  const val = e.target.value;
  speedVal.textContent = `${val}x`;
  
  // 1. Update visual animation speeds
  if (visualizer) visualizer.setSpeed(val);
  
  // 2. If procedural synth is active, update BPM live!
  if (audio && audio.sourceType === 'synth') {
    audio.tempo = 110.0 * parseFloat(val);
  }
});

// Volume
volumeSlider.addEventListener('input', (e) => {
  const val = e.target.value;
  volumeVal.textContent = `${val}%`;
  audio.setVolume(val / 100);
});

// Camera Auto-Rotation
autoRotateCheck.addEventListener('change', (e) => {
  if (visualizer) visualizer.setAutoRotate(e.target.checked);
});

// --- MODE SWITCHER EVENTS ---

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Toggle active class on UI
    modeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update visualizer engine mode
    const mode = btn.dataset.mode;
    if (visualizer) visualizer.setMode(mode);
  });
});

// --- THEME SPECTRUM EVENTS ---

themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Toggle active theme button styling
    themeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    
    const theme = btn.dataset.theme;
    
    // 1. Update Three.js engine colors
    if (visualizer) visualizer.setTheme(theme);
    
    // 2. Add class to body to dynamically swap dashboard CSS values
    document.body.className = ''; // Reset
    if (theme !== 'cyberpunk') {
      document.body.classList.add(`theme-${theme}`);
    }
  });
});

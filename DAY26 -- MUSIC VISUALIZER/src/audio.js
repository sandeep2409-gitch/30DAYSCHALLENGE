// src/audio.js

export class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.gainNode = null;
    this.sourceNode = null;
    this.micStream = null;
    this.audioElement = null; // Used for local uploads if playing as media element
    
    // Synth / Sequencer variables
    this.isPlayingSynth = false;
    this.tempo = 110.0; // BPM
    this.lookahead = 25.0; // ms
    this.scheduleAheadTime = 0.1; // seconds
    this.nextNoteTime = 0.0;
    this.currentStep = 0;
    this.timerId = null;
    
    // Analyzer data
    this.fftSize = 512;
    this.dataArray = null;
    this.timeDataArray = null;
    
    // State
    this.sourceType = 'none'; // 'file', 'mic', 'synth'
    this.isPlaying = false;

    // Procedural noise buffer (for Snare / Hi-hat)
    this.noiseBuffer = null;
  }

  // Initialize Audio Context lazily
  init() {
    if (this.audioCtx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0.85;
    
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime); // Default 50% volume
    
    // Connect analyser to gain, then gain to speakers
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDataArray = new Uint8Array(this.analyser.fftSize);

    // Create noise buffer
    this.createNoiseBuffer();
  }

  // Helper to set Volume (0.0 to 1.0)
  setVolume(volume) {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setTargetAtTime(volume, this.audioCtx.currentTime, 0.05);
    }
  }

  // Pre-generate a 1-second white noise buffer for Snare and Hi-hat
  createNoiseBuffer() {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate;
    this.noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  // stop any active source
  stopActiveSource() {
    // Stop Synth if running
    if (this.isPlayingSynth) {
      this.stopSynth();
    }
    
    // Stop Microphone
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    
    // Disconnect previous node
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {
        // Already disconnected
      }
      this.sourceNode = null;
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }

    this.isPlaying = false;
    this.sourceType = 'none';
  }

  // 1. Play local uploaded file
  playFile(file) {
    this.init();
    this.stopActiveSource();
    
    // Resume context if suspended
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const objectURL = URL.createObjectURL(file);
    this.audioElement = new Audio();
    this.audioElement.src = objectURL;
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.loop = true;
    
    this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
    this.sourceNode.connect(this.analyser);
    
    this.audioElement.play();
    this.isPlaying = true;
    this.sourceType = 'file';
  }

  pauseFile() {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  resumeFile() {
    if (this.audioElement && !this.isPlaying) {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.audioElement.play();
      this.isPlaying = true;
    }
  }

  // 2. Stream Microphone input
  startMic() {
    this.init();
    this.stopActiveSource();

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        this.micStream = stream;
        this.sourceNode = this.audioCtx.createMediaStreamSource(stream);
        
        // Microphone inputs go straight to the Analyser only (do not route to Speakers to prevent feedback loop!)
        this.sourceNode.connect(this.analyser);
        
        this.isPlaying = true;
        this.sourceType = 'mic';
        return true;
      })
      .catch(err => {
        console.error('Error opening microphone: ', err);
        this.sourceType = 'none';
        this.isPlaying = false;
        throw err;
      });
  }

  // 3. Procedural Synthwave Sequencer
  startSynth() {
    this.init();
    this.stopActiveSource();

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlayingSynth = true;
    this.isPlaying = true;
    this.sourceType = 'synth';
    
    // Sequencer initial timings
    this.currentStep = 0;
    this.nextNoteTime = this.audioCtx.currentTime;
    
    // Start lookahead scheduler loop
    this.scheduler();
  }

  stopSynth() {
    this.isPlayingSynth = false;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  scheduler() {
    if (!this.isPlayingSynth) return;
    
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.advanceNote();
    }
    
    // Run scheduler check again soon
    this.timerId = setTimeout(() => this.scheduler(), this.lookahead);
  }

  advanceNote() {
    // At tempo BPM, a quarter note is (60 / BPM) seconds.
    // A 16th note is 1/4th of that.
    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = 0.25 * secondsPerBeat; // 16th note length
    
    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  // Beat Sequences: 16-step patterns
  scheduleNote(step, time) {
    // 1. Kick Drum (Four-on-the-floor beat: steps 0, 4, 8, 12)
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      this.playKick(time);
    }
    
    // 2. Snare Drum (Backbeat: steps 4, 12)
    if (step === 4 || step === 12) {
      this.playSnare(time);
    }

    // 3. Hi-Hat (Offbeats and driving running hats)
    // Always schedule on offbeats (2, 6, 10, 14), optionally on others
    if (step % 2 === 0) {
      // Accented hat on offbeats, light on other beats
      const accent = (step % 4 === 2);
      this.playHihat(time, accent);
    }

    // 4. Synthwave Bassline (Pulsing eighth notes: steps 0, 2, 4, 6, 8, 10, 12, 14)
    // E-minor key progressions: E (steps 0-7) -> G (steps 8-11) -> D (steps 12-15)
    if (step % 2 === 0) {
      let bassNote = 41.20; // E1 frequency
      if (step >= 8 && step < 12) {
        bassNote = 49.00; // G1 frequency
      } else if (step >= 12) {
        bassNote = 36.71; // D1 frequency
      }
      this.playBass(time, bassNote);
    }

    // 5. Retro Lead Synth (Catchy nostalgic melody)
    // Map steps to specific melody frequencies (E Minor scale)
    // Steps: 0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15
    // Notes: B4   -    E5   B4   A4   -    G4   F#4  G4   -    B4   D5   E5   -    D5   B4
    const melodyPattern = [
      493.88, // B4 (0)
      0,      // rest (1)
      659.25, // E5 (2)
      493.88, // B4 (3)
      440.00, // A4 (4)
      0,      // rest (5)
      392.00, // G4 (6)
      369.99, // F#4 (7)
      392.00, // G4 (8)
      0,      // rest (9)
      493.88, // B4 (10)
      587.33, // D5 (11)
      659.25, // E5 (12)
      0,      // rest (13)
      587.33, // D5 (14)
      493.88  // B4 (15)
    ];

    const freq = melodyPattern[step];
    if (freq > 0) {
      this.playLead(time, freq);
    }
  }

  // --- SYNTH INSTRUMENT SCHEDULERS ---

  // Kick Drum: Sine wave frequency sweep + fast decay volume
  playKick(time) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    // Connect instrument output to the analyzer (which feeds to speakers)
    gain.connect(this.analyser);
    
    osc.type = 'sine';
    
    // Frequency sweep: start high (150Hz) and dive quickly to 45Hz
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    
    // Volume envelope: click start, decay to 0
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    
    osc.start(time);
    osc.stop(time + 0.26);
  }

  // Snare Drum: Mixed white noise filter + low sine pitch punch
  playSnare(time) {
    if (!this.noiseBuffer) return;

    // 1. Noise component (for the snare rattle)
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    
    const noiseFilter = this.audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1000; // Snare snap frequency
    
    const noiseGain = this.audioCtx.createGain();
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.analyser);
    
    noiseGain.gain.setValueAtTime(0.7, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    // 2. Tone punch component (simulating the drum body)
    const osc = this.audioCtx.createOscillator();
    const oscGain = this.audioCtx.createGain();
    
    osc.connect(oscGain);
    oscGain.connect(this.analyser);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
    
    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
    
    // Start playbacks
    noiseSource.start(time);
    noiseSource.stop(time + 0.25);
    
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Hi-Hat: White noise with short bandpass and quick decay
  playHihat(time, accent = false) {
    if (!this.noiseBuffer) return;

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.noiseBuffer;
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000; // Super high-pitch
    
    const gain = this.audioCtx.createGain();
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);
    
    const volume = accent ? 0.35 : 0.18;
    const duration = accent ? 0.08 : 0.04;
    
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    source.start(time);
    source.stop(time + duration + 0.01);
  }

  // Bass Synth: Dual detuned sawtooth oscillators + lowpass sweep
  playBass(time, frequency) {
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();
    
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    
    // Detune oscs slightly to create a thick chorus-like bass sound
    osc1.frequency.setValueAtTime(frequency, time);
    osc2.frequency.setValueAtTime(frequency - 0.5, time);
    
    filter.type = 'lowpass';
    // Sweeping lowpass filter envelope (classic acid/synth bass sound)
    filter.frequency.setValueAtTime(1000, time);
    filter.frequency.exponentialRampToValueAtTime(250, time + 0.15);
    filter.Q.value = 4.0; // Resonant peak
    
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);
    
    osc1.start(time);
    osc2.start(time);
    
    osc1.stop(time + 0.23);
    osc2.stop(time + 0.23);
  }

  // Retro Lead Synth: Square wave melody + simple delay/echo node
  playLead(time, frequency) {
    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const mainGain = this.audioCtx.createGain();
    
    // Setup Delay Effect to make it sound spacious and premium
    const delay = this.audioCtx.createDelay();
    const delayFeedback = this.audioCtx.createGain();
    const delayGain = this.audioCtx.createGain();
    
    delay.delayTime.value = 0.18; // 180ms delay
    delayFeedback.gain.value = 0.4; // 40% feedback echo loudness
    delayGain.gain.value = 0.25; // Delay echo volume in main mix
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency, time);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, time);
    filter.frequency.exponentialRampToValueAtTime(1200, time + 0.35);
    
    // Lead volume envelope (longer decay)
    mainGain.gain.setValueAtTime(0.18, time);
    mainGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    
    // Connect dry path
    osc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.analyser);
    
    // Connect wet delay path
    mainGain.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay); // Feedback loop
    delay.connect(delayGain);
    delayGain.connect(this.analyser);
    
    osc.start(time);
    osc.stop(time + 0.45);
  }

  // --- ANALYSIS AND METRICS EXTRACTION ---

  getAudioData() {
    if (!this.isPlaying || !this.analyser) {
      return {
        frequencyData: new Uint8Array(this.fftSize / 2),
        timeData: new Uint8Array(this.fftSize),
        bass: 0,
        mid: 0,
        treble: 0,
        volume: 0
      };
    }
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.analyser.getByteTimeDomainData(this.timeDataArray);
    
    // Calculate frequency range averages
    // frequencyBinCount is fftSize / 2 = 256 bins.
    // Audio ranges:
    // Bass (sub-bass and bass): 0 - 15 bins (~20Hz - ~250Hz)
    // Mid (vocals, instrument bodies): 16 - 90 bins (~250Hz - ~1500Hz)
    // Treble (hihats, high pitch melody): 91 - 220 bins (~1500Hz - ~3800Hz)
    
    let bassSum = 0;
    for (let i = 0; i < 15; i++) {
      bassSum += this.dataArray[i];
    }
    const bass = bassSum / 15 / 255; // Normalized to 0.0 - 1.0
    
    let midSum = 0;
    for (let i = 15; i < 90; i++) {
      midSum += this.dataArray[i];
    }
    const mid = midSum / (90 - 15) / 255;
    
    let trebleSum = 0;
    for (let i = 90; i < 220; i++) {
      trebleSum += this.dataArray[i];
    }
    const treble = trebleSum / (220 - 90) / 255;
    
    // Calculate volume / RMS from time domain data
    let rmsSum = 0;
    for (let i = 0; i < this.timeDataArray.length; i++) {
      const val = (this.timeDataArray[i] - 128) / 128; // Normalized wave value between -1.0 and 1.0
      rmsSum += val * val;
    }
    const volume = Math.sqrt(rmsSum / this.timeDataArray.length); // Root Mean Square (RMS)
    
    return {
      frequencyData: this.dataArray,
      timeData: this.timeDataArray,
      bass: bass,
      mid: mid,
      treble: treble,
      volume: volume
    };
  }
}

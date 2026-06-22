# Day 26: 3D Music Visualizer 🎹🌀

A premium, interactive, high-performance 3D Music Visualizer combining the **Web Audio API** and **Three.js (WebGL)**, bundled using a modern **Vite** environment.

This sensory dashboard converts audio frequency spectrums and time-domain waveforms into fluid, reactive 3D animations. It features a built-in step sequencer synthesizer to provide procedural music out-of-the-box, alongside options to analyze live microphone feeds and local file uploads.

---

## ⚡ Features

1. **Audio Ingress Sources**:
   - **Procedural Synthwave Beat**: An internal 16-step synthesizer that generates retro kick drum punches, snare hits, hi-hat offbeats, a resonant arpeggiated bassline, and square lead melodies entirely via Web Audio node oscillators and gain envelopes. No external files or network assets required (CORS bulletproof!).
   - **Microphone Stream**: Captures and visualizes ambient sound, speech, or instrument plays in real time. (Routed to analyser only, muted in speakers to prevent feedback loops).
   - **File Upload & Player**: Support for local MP3, WAV, and audio files via a sleek drag-and-drop zone or system file selector. Includes track play/pause toggles.

2. **3D Visualizer Scenes (Three.js)**:
   - **Psychedelic Audio Sphere**: A dense particle sphere that expands on bass frequencies. High-frequency treble inputs displace individual vertices into organic, jagged shapes while starfield particles drift in the background.
   - **Retro Terrain Grid**: A cyber-neon grid displaying frequency waves propagating backward along terrain rows. Includes a glowing retro synthwave sun pulsing in the distance.
   - **Vortex Light Tunnel**: Concentric polygonal glowing wireframe rings that expand and rotate to frequency bands. The camera travels continuously down the tunnel, shifting slightly on heavy beats.
   - **Radial Box Rings**: 3D bars arranged in a radial layout, scaling outward in response to specific frequency ranges, with emission intensity mapped to the mid-high bands.

3. **Tuning and Configuration Utilities**:
   - **Sensitivity**: Multiplier slider to adjust how intensely the visualizers deform in response to audio inputs.
   - **Speed / Tempo**: Animation rate adjustment slider. If playing the procedural synth, adjusting speed controls the BPM of the step sequencer in real time!
   - **Mixer Volume**: Global loudness slider (using a Web Audio GainNode).
   - **Orbit Camera Auto-Rotate**: Option to toggle automatic camera orbits or take manual control using click-and-drag interactions.
   - **Color Theme Selectors**: Cyberpunk (Neon Pink & Cyan), Volcanic (Fiery Red & Gold), Aurora (Northern Teal & Violet), and Monochrome (Glowing Silver & Charcoal). Changes both the 3D meshes and dashboard controls to match.

4. **Premium HUD Interface**:
   - Sleek glassmorphic control dashboard (`backdrop-filter: blur(12px)`) with glowing borders and micro-animations.
   - Live horizontal frequency meters reflecting BASS, MID, and TREBLE volumes directly in the control panel.

---

## 🛠️ Technology Stack

- **Graphics Core**: Three.js (WebGL 3D Engine)
- **Audio Processing**: HTML5 Web Audio API (AudioContext, AnalyserNode, BiquadFilterNode, DelayNode, GainNode, OscillatorNode)
- **Styling**: Vanilla CSS3 (Custom range sliders, glassmorphic panels, neon glows, responsive grid)
- **Build System**: Vite (Vanilla ES Module bundler)

---

## 🎮 How to Interact

- **Camera Rotation**: Click and hold on the canvas, then drag your mouse to orbit the camera.
- **Camera Zoom**: Use the scroll wheel to zoom in and out.
- **Control Panel**: Adjust themes, visualizer styles, sensitivity, and inputs using the floating HUD panel.

---

## 🚀 Getting Started

To launch the visualizer locally:

1. **Navigate into the folder**:
   ```bash
   cd "DAY26 -- MUSIC VISUALIZER"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open the displayed URL (typically `http://localhost:5173`) in your web browser.
5. Click **Initialize System** to unlock the Web Audio API and start the spectrometer!
# music-visualizer

// src/visualizer.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class VisualizerEngine {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationId = null;
    
    // Visualization Settings
    this.mode = 'sphere'; // 'sphere', 'terrain', 'tunnel', 'bars'
    this.theme = 'cyberpunk'; // 'cyberpunk', 'volcanic', 'aurora', 'monochrome'
    this.sensitivity = 1.0;
    this.speed = 1.0;
    this.autoRotate = true;
    
    // Audio Data Reference
    this.audioData = null; // Will be set from main loop
    
    // Group holders for cleanup and toggling
    this.visualizerGroup = null;
    this.starfield = null;
    
    // Visualizer specific objects
    this.spherePoints = null;
    this.sphereOriginalPos = null;
    
    this.terrainGrid = null;
    this.terrainGeometry = null;
    this.terrainSun = null;
    this.terrainHeightsHistory = []; // Matrix for scrolling height data
    
    this.tunnelRings = [];
    this.tunnelContainer = null;
    
    this.radialBars = [];
    
    // Color Palettes
    this.palettes = {
      cyberpunk: {
        bg: 0x05010a,
        base: new THREE.Color(0xff007f), // Pink
        accent: new THREE.Color(0x00f0ff), // Cyan
        glow: new THREE.Color(0x7000ff), // Purple
      },
      volcanic: {
        bg: 0x0a0200,
        base: new THREE.Color(0xff3300), // Fire Red
        accent: new THREE.Color(0xffaa00), // Orange/Gold
        glow: new THREE.Color(0x1a0500), // Dark Lava
      },
      aurora: {
        bg: 0x01070a,
        base: new THREE.Color(0x00ffaa), // Northern Green
        accent: new THREE.Color(0x0088ff), // Ocean Blue
        glow: new THREE.Color(0x7700ff), // Violet
      },
      monochrome: {
        bg: 0x080808,
        base: new THREE.Color(0xffffff), // Bright White
        accent: new THREE.Color(0x555555), // Mid Gray
        glow: new THREE.Color(0x222222), // Deep Charcoal
      }
    };
    
    this.init();
  }

  init() {
    // 1. Create Scene
    this.scene = new THREE.Scene();
    const activePalette = this.palettes[this.theme];
    this.scene.background = new THREE.Color(activePalette.bg);
    this.scene.fog = new THREE.FogExp2(activePalette.bg, 0.015);

    // 2. Create Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 15, 35);

    // 3. Create WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    
    // Clear container and append canvas
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Create Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 150;
    this.controls.minDistance = 5;

    // 5. Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);

    // 6. Create Base Visualizer Group
    this.visualizerGroup = new THREE.Group();
    this.scene.add(this.visualizerGroup);

    // 7. Add Ambient Starfield background
    this.createStarfield();

    // 8. Build visualizers in scene
    this.buildSphereVisualizer();
    this.buildTerrainVisualizer();
    this.buildTunnelVisualizer();
    this.buildRadialBarsVisualizer();

    // Set initial mode visibility
    this.setMode(this.mode);

    // 9. Resize Listener
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  // --- AMBIENT BACKGROUNDS ---

  createStarfield() {
    const starsCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    
    const palette = this.palettes[this.theme];

    for (let i = 0; i < starsCount * 3; i += 3) {
      // Random coordinates in a massive cube
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i+1] = (Math.random() - 0.5) * 200;
      positions[i+2] = (Math.random() - 0.5) * 200;

      // Color mix
      const mixColor = new THREE.Color().lerpColors(palette.base, palette.accent, Math.random());
      colors[i] = mixColor.r;
      colors[i+1] = mixColor.g;
      colors[i+2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom glowing point texture using canvas
    const pTexture = this.createParticleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- VISUALIZER 1: DEFORMING SPHERE ---

  buildSphereVisualizer() {
    const vertexCount = 1200;
    const radius = 8;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    
    this.sphereOriginalPos = [];
    const activePalette = this.palettes[this.theme];

    for (let i = 0; i < vertexCount; i++) {
      // Golden ratio placement for uniform sphere distribution
      const phi = Math.acos(-1 + (2 * i) / vertexCount);
      const theta = Math.sqrt(vertexCount * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const idx = i * 3;
      positions[idx] = x;
      positions[idx+1] = y;
      positions[idx+2] = z;

      this.sphereOriginalPos.push(new THREE.Vector3(x, y, z));

      // Color gradient from poles to equator
      const t = Math.abs(z / radius); // 0 at equator, 1 at poles
      const c = new THREE.Color().lerpColors(activePalette.base, activePalette.accent, t);
      colors[idx] = c.r;
      colors[idx+1] = c.g;
      colors[idx+2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      map: this.createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.spherePoints = new THREE.Points(geometry, material);
    this.spherePoints.name = 'sphere';
    this.visualizerGroup.add(this.spherePoints);
  }

  updateSphere(audio) {
    if (!this.spherePoints) return;
    
    const positions = this.spherePoints.geometry.attributes.position.array;
    const totalPoints = this.sphereOriginalPos.length;
    
    const bass = audio.bass * this.sensitivity;
    const mid = audio.mid * this.sensitivity;
    const treble = audio.treble * this.sensitivity;
    const volume = audio.volume * this.sensitivity;
    
    const time = Date.now() * 0.001 * this.speed;

    for (let i = 0; i < totalPoints; i++) {
      const orig = this.sphereOriginalPos[i];
      const idx = i * 3;
      
      // Select frequency bin for this particle
      const freqIndex = Math.floor((i / totalPoints) * audio.frequencyData.length);
      const freqVal = (audio.frequencyData[freqIndex] || 0) / 255.0 * this.sensitivity;

      // Mathematical displacement using 3D simplex noise formula (approximated with sines/cosines)
      const noise = Math.sin(orig.x * 0.3 + time * 2) * Math.cos(orig.y * 0.3 + time) * Math.sin(orig.z * 0.3 + time * 1.5);
      
      // Calculate total displacement based on audio levels
      // Bass drives global expansion, high-frequencies drive local jagged deformations
      const displacement = 1.0 + (bass * 0.4) + (freqVal * 0.6) + (noise * (0.1 + treble * 0.3));
      
      positions[idx] = orig.x * displacement;
      positions[idx+1] = orig.y * displacement;
      positions[idx+2] = orig.z * displacement;
    }

    this.spherePoints.geometry.attributes.position.needsUpdate = true;
    
    // Rotate sphere subtly
    this.spherePoints.rotation.y += 0.003 * this.speed;
    this.spherePoints.rotation.x += 0.001 * this.speed;
    
    // Scale overall sphere with overall volume bounce
    const baseScale = 1.0 + volume * 0.25;
    this.spherePoints.scale.set(baseScale, baseScale, baseScale);
  }

  // --- VISUALIZER 2: RETRO TERRAIN ---

  buildTerrainVisualizer() {
    const width = 120;
    const depth = 120;
    const segmentsX = 40;
    const segmentsY = 40;
    
    this.terrainGeometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsY);
    this.terrainGeometry.rotateX(-Math.PI / 2); // Lay flat on XZ plane
    
    // Initialize scrolling heights history (matrix of segmentsY+1 rows, segmentsX+1 columns)
    this.terrainHeightsHistory = [];
    for (let y = 0; y <= segmentsY; y++) {
      this.terrainHeightsHistory.push(new Float32Array(segmentsX + 1));
    }

    const activePalette = this.palettes[this.theme];
    
    // Wireframe wire mesh
    const material = new THREE.MeshBasicMaterial({
      color: activePalette.base,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const terrainGroup = new THREE.Group();
    terrainGroup.name = 'terrain';

    this.terrainGrid = new THREE.Mesh(this.terrainGeometry, material);
    terrainGroup.add(this.terrainGrid);

    // Glowing Neon Synthwave Sun in background
    const sunGeom = new THREE.CircleGeometry(16, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: activePalette.accent,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.terrainSun = new THREE.Mesh(sunGeom, sunMat);
    // Position far away in background, standing upright
    this.terrainSun.position.set(0, 10, -60);
    this.terrainSun.rotation.y = 0;
    terrainGroup.add(this.terrainSun);

    // Add terrain group to main visualizer group
    this.visualizerGroup.add(terrainGroup);
  }

  updateTerrain(audio) {
    if (!this.terrainGrid || !this.terrainGeometry) return;
    
    const positions = this.terrainGeometry.attributes.position.array;
    const segmentsX = 40;
    const segmentsY = 40;
    
    const bass = audio.bass * this.sensitivity;
    const mid = audio.mid * this.sensitivity;
    const treble = audio.treble * this.sensitivity;
    const volume = audio.volume * this.sensitivity;

    // Shift previous rows back in the history array (simulates moving forward)
    const speedFactor = Math.floor(1 + this.speed * 0.5); // Number of rows to shift per frame
    
    for (let s = 0; s < speedFactor; s++) {
      this.terrainHeightsHistory.pop(); // Remove the furthest row (at the horizon)
      
      // Generate a new front row of height data based on the current frequency spectrum
      const newRow = new Float32Array(segmentsX + 1);
      const freqBinsCount = audio.frequencyData.length;
      
      for (let x = 0; x <= segmentsX; x++) {
        // Map grid columns symmetrically so the tallest heights are on the left and right edges
        // and a flat "valley road" runs down the center of the visualizer!
        const distFromCenter = Math.abs(x - segmentsX / 2) / (segmentsX / 2); // 0 in center, 1 at edges
        
        let heightVal = 0;
        if (distFromCenter > 0.15) {
          // Map frequency data to column positions
          const binIndex = Math.floor((1 - distFromCenter) * (freqBinsCount * 0.6));
          const audioValue = (audio.frequencyData[binIndex] || 0) / 255.0;
          
          // Outer mountains are higher, scaled by audio levels
          heightVal = audioValue * 22 * this.sensitivity * (distFromCenter - 0.15);
          // Add some random details/hills on mountains
          heightVal += Math.sin(x * 0.8) * Math.cos(Date.now() * 0.002) * (1.0 + treble * 2.0);
        } else {
          // The center valley road oscillates slightly to bass beat ripples
          heightVal = Math.sin(Date.now() * 0.005 + x) * (0.2 + bass * 1.5);
        }
        
        newRow[x] = heightVal;
      }
      this.terrainHeightsHistory.unshift(newRow); // Add to the front of history (closest row)
    }

    // Apply the height matrix history back to plane vertices
    // In Three.js PlaneGeometry, vertices are indexed row-by-row (Z) then column-by-column (X)
    let idx = 0;
    for (let y = 0; y <= segmentsY; y++) {
      const rowHeights = this.terrainHeightsHistory[y];
      for (let x = 0; x <= segmentsX; x++) {
        // Vertex position array elements: [x0, y0, z0, x1, y1, z1, ...]
        // We modify the Y coordinate (height) which is at index `idx + 1`
        positions[idx + 1] = rowHeights[x];
        idx += 3;
      }
    }
    
    this.terrainGeometry.attributes.position.needsUpdate = true;
    this.terrainGeometry.computeVertexNormals();

    // Pulse the sun size and brightness in sync with the bass kick
    const sunScale = 1.0 + bass * 0.3;
    this.terrainSun.scale.set(sunScale, sunScale, 1.0);
    this.terrainSun.material.opacity = 0.5 + bass * 0.5;

    // Shift camera slightly based on visualizer movement
    if (this.autoRotate) {
      const time = Date.now() * 0.0003;
      this.camera.position.x = Math.sin(time) * 35;
      this.camera.position.z = Math.cos(time) * 15 + 25;
      this.camera.position.y = 10 + Math.sin(time * 2) * 5;
      this.camera.lookAt(new THREE.Vector3(0, 0, -10));
    }
  }

  // --- VISUALIZER 3: VORTEX TUNNEL ---

  buildTunnelVisualizer() {
    this.tunnelContainer = new THREE.Group();
    this.tunnelContainer.name = 'tunnel';

    const ringCount = 24;
    const ringSpacing = 5; // distance between rings
    this.tunnelRings = [];

    const activePalette = this.palettes[this.theme];

    for (let i = 0; i < ringCount; i++) {
      const zPos = -i * ringSpacing;
      const radius = 12;

      // Make a ring using custom shapes or octagonal torus to look retro-futuristic
      const geometry = new THREE.TorusGeometry(radius, 0.15, 8, 16);
      const material = new THREE.MeshBasicMaterial({
        color: activePalette.base,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });

      const ringMesh = new THREE.Mesh(geometry, material);
      ringMesh.position.set(0, 0, zPos);
      
      this.tunnelContainer.add(ringMesh);
      
      // Store additional properties for runtime mapping
      this.tunnelRings.push({
        mesh: ringMesh,
        baseZ: zPos,
        baseRadius: radius,
        depthIndex: i
      });
    }

    this.visualizerGroup.add(this.tunnelContainer);
  }

  updateTunnel(audio) {
    if (!this.tunnelContainer) return;
    
    const ringSpacing = 5;
    const totalLength = this.tunnelRings.length * ringSpacing;
    const time = Date.now() * 0.001 * this.speed;
    
    const bass = audio.bass * this.sensitivity;
    const mid = audio.mid * this.sensitivity;
    const treble = audio.treble * this.sensitivity;

    // Camera fly-through logic: move camera straight down the negative Z axis
    const flySpeed = 0.15 * this.speed * (1.0 + bass * 0.5);
    
    this.tunnelRings.forEach((ring) => {
      // Move ring towards the camera (+Z direction)
      ring.mesh.position.z += flySpeed;
      
      // If a ring passes behind the camera, wrap it back to the very far end of the tunnel
      if (ring.mesh.position.z > 15) {
        ring.mesh.position.z -= totalLength;
      }
      
      // Calculate normalized depth value (0 in front, 1 at the deepest tunnel back)
      const currentZ = ring.mesh.position.z;
      const distFromStart = Math.abs(currentZ);
      const depthRatio = Math.min(distFromStart / totalLength, 1.0);
      
      // Select audio frequency bin based on ring depth index
      const binIdx = Math.floor(depthRatio * (audio.frequencyData.length * 0.5));
      const freqVal = (audio.frequencyData[binIdx] || 0) / 255.0 * this.sensitivity;
      
      // Deform ring dimensions: Bass expands outer rings, mids pulse inner rings
      const scale = 1.0 + freqVal * 0.6 + (bass * 0.2 * (1 - depthRatio));
      ring.mesh.scale.set(scale, scale, 1.0);
      
      // Rotate rings in opposite directions to create vortex distortion
      const rotDir = ring.depthIndex % 2 === 0 ? 1 : -1;
      ring.mesh.rotation.z += 0.005 * rotDir * this.speed * (1.0 + mid * 2.0);
      
      // Dynamic color interpolation along the tunnel length
      const colorVal = new THREE.Color().lerpColors(
        this.palettes[this.theme].base, 
        this.palettes[this.theme].accent, 
        Math.sin(time + depthRatio * Math.PI) * 0.5 + 0.5
      );
      ring.mesh.material.color.copy(colorVal);
      ring.mesh.material.opacity = (1.0 - depthRatio) * (0.3 + freqVal * 0.7);
    });

    // Reset camera position to 0,0,10 to ensure we stay centered in the tunnel
    // Camera tilts/shakes in sync with bass frequencies
    this.camera.position.set(
      Math.sin(time * 2) * (bass * 1.5), 
      Math.cos(time * 1.5) * (bass * 1.5), 
      10
    );
    this.camera.lookAt(0, 0, -50);
  }

  // --- VISUALIZER 4: RADIAL BOX RINGS ---

  buildRadialBarsVisualizer() {
    const barCount = 64;
    const circleRadius = 14;
    this.radialBars = [];
    
    const activePalette = this.palettes[this.theme];
    
    const radialGroup = new THREE.Group();
    radialGroup.name = 'bars';

    // Box dimensions
    const width = 0.8;
    const height = 4.0;
    const depth = 0.8;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);

    for (let i = 0; i < barCount; i++) {
      // Distribute boxes radially in a circle
      const angle = (i / barCount) * Math.PI * 2;
      const x = Math.sin(angle) * circleRadius;
      const z = Math.cos(angle) * circleRadius;
      
      // Mesh material with emission glow support
      const material = new THREE.MeshLambertMaterial({
        color: activePalette.base,
        emissive: activePalette.glow,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85
      });
      
      const barMesh = new THREE.Mesh(geometry, material);
      barMesh.position.set(x, 0, z);
      
      // Rotate box to face outwards from the circle center
      barMesh.rotation.y = angle;
      
      // Align box pivot to bottom base so it grows outward, not symmetrically
      // We translate the mesh geometry inside itself
      barMesh.geometry = barMesh.geometry.clone();
      barMesh.geometry.translate(0, height / 2, 0);
      
      // Lay boxes flat or standing? Let's rotate them so they point radially outwards:
      // Rotates around X axis to lie in the XZ plane pointing outwards
      barMesh.rotation.x = Math.PI / 2;

      radialGroup.add(barMesh);
      this.radialBars.push({
        mesh: barMesh,
        angle: angle,
        baseMaterial: material
      });
    }

    // Add a glowing core sphere in the center of the ring
    const coreGeom = new THREE.SphereGeometry(6, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: activePalette.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.name = 'core';
    radialGroup.add(core);

    this.visualizerGroup.add(radialGroup);
  }

  updateRadialBars(audio) {
    if (this.radialBars.length === 0) return;
    
    const barCount = this.radialBars.length;
    const time = Date.now() * 0.001 * this.speed;
    
    const bass = audio.bass * this.sensitivity;
    const mid = audio.mid * this.sensitivity;
    const volume = audio.volume * this.sensitivity;
    
    for (let i = 0; i < barCount; i++) {
      const bar = this.radialBars[i];
      
      // Audio frequency mapping
      // Map bars symmetrically: index wraps from 0 to middle, then back
      const halfIndex = i < barCount / 2 ? i : barCount - 1 - i;
      const binIdx = Math.floor((halfIndex / (barCount / 2)) * (audio.frequencyData.length * 0.7));
      const freqVal = (audio.frequencyData[binIdx] || 0) / 255.0 * this.sensitivity;
      
      // Apply scale (extending outward). Core scale must be >= 0.1 to avoid errors
      const scaleZ = 0.1 + freqVal * 3.5; 
      bar.mesh.scale.set(1.0, scaleZ, 1.0);
      
      // Map colors dynamically based on individual frequency heights
      const colorVal = new THREE.Color().lerpColors(
        this.palettes[this.theme].base,
        this.palettes[this.theme].accent,
        freqVal
      );
      bar.mesh.material.color.copy(colorVal);
      bar.mesh.material.emissiveIntensity = 0.2 + freqVal * 0.8;
    }
    
    // Rotate and animate the central core
    const radialGroup = this.visualizerGroup.getObjectByName('bars');
    if (radialGroup) {
      radialGroup.rotation.y += 0.002 * this.speed;
      
      const core = radialGroup.getObjectByName('core');
      if (core) {
        const coreScale = 1.0 + bass * 0.4;
        core.scale.set(coreScale, coreScale, coreScale);
        core.rotation.y -= 0.005 * this.speed;
        core.rotation.x += 0.002 * this.speed;
        core.material.color.copy(this.palettes[this.theme].accent);
      }
    }

    // Classic camera rotation around the circular visualization
    if (this.autoRotate) {
      const camTime = Date.now() * 0.0002 * this.speed;
      const orbitRadius = 35 + volume * 5;
      this.camera.position.x = Math.sin(camTime) * orbitRadius;
      this.camera.position.z = Math.cos(camTime) * orbitRadius;
      this.camera.position.y = 18 + Math.sin(camTime * 0.5) * 6;
      this.camera.lookAt(0, 0, 0);
    }
  }

  // --- ENGINE ORCHESTRATION ---

  setMode(modeName) {
    this.mode = modeName;
    
    // Toggle Three.js object visibilities
    this.visualizerGroup.children.forEach((group) => {
      group.visible = (group.name === modeName);
    });

    // Reset controls if switching mode
    this.controls.reset();
    
    // Adjust camera setup per mode
    if (modeName === 'sphere') {
      this.camera.position.set(0, 10, 22);
    } else if (modeName === 'terrain') {
      this.camera.position.set(0, 15, 35);
      this.camera.lookAt(new THREE.Vector3(0, 0, -10));
    } else if (modeName === 'tunnel') {
      this.camera.position.set(0, 0, 10);
      this.camera.lookAt(new THREE.Vector3(0, 0, -50));
    } else if (modeName === 'bars') {
      this.camera.position.set(0, 18, 30);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }

  setTheme(themeName) {
    if (!this.palettes[themeName]) return;
    this.theme = themeName;
    const palette = this.palettes[themeName];
    
    // 1. Update backgrounds and fog
    this.scene.background.setHex(palette.bg);
    this.scene.fog.color.setHex(palette.bg);
    
    // 2. Refresh backgrounds starfield colors
    if (this.starfield) {
      const colors = this.starfield.geometry.attributes.color.array;
      const count = colors.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const mixColor = new THREE.Color().lerpColors(palette.base, palette.accent, Math.random());
        colors[idx] = mixColor.r;
        colors[idx+1] = mixColor.g;
        colors[idx+2] = mixColor.b;
      }
      this.starfield.geometry.attributes.color.needsUpdate = true;
    }
    
    // 3. Update active visualizer base material colors
    if (this.spherePoints) {
      const colors = this.spherePoints.geometry.attributes.color.array;
      const count = colors.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const radius = 8;
        const z = this.sphereOriginalPos[i].z;
        const t = Math.abs(z / radius);
        const c = new THREE.Color().lerpColors(palette.base, palette.accent, t);
        colors[idx] = c.r;
        colors[idx+1] = c.g;
        colors[idx+2] = c.b;
      }
      this.spherePoints.geometry.attributes.color.needsUpdate = true;
    }
    
    if (this.terrainGrid) {
      this.terrainGrid.material.color.copy(palette.base);
      this.terrainSun.material.color.copy(palette.accent);
    }
    
    if (this.radialBars.length > 0) {
      this.radialBars.forEach((bar) => {
        bar.mesh.material.color.copy(palette.base);
        bar.mesh.material.emissive.copy(palette.glow);
      });
    }
  }

  setSensitivity(val) {
    this.sensitivity = parseFloat(val);
  }

  setSpeed(val) {
    this.speed = parseFloat(val);
  }

  setAutoRotate(state) {
    this.autoRotate = state;
  }

  // Main tick loop
  update(audioEngineData) {
    // 1. Damping controls update
    this.controls.update();
    
    // 2. Animate ambient background starfield rotation speed in sync with volume
    const vol = audioEngineData.volume;
    if (this.starfield) {
      this.starfield.rotation.y += 0.0005 * this.speed * (1.0 + vol * 3.0);
      this.starfield.rotation.x += 0.0002 * this.speed;
    }

    // 3. Delegate to specific visualizer draw updates
    if (this.mode === 'sphere') {
      this.updateSphere(audioEngineData);
    } else if (this.mode === 'terrain') {
      this.updateTerrain(audioEngineData);
    } else if (this.mode === 'tunnel') {
      this.updateTunnel(audioEngineData);
    } else if (this.mode === 'bars') {
      this.updateRadialBars(audioEngineData);
    }

    // 4. Render frame
    this.renderer.render(this.scene, this.camera);
  }

  // Cleanup WebGL contexts on exit
  dispose() {
    window.removeEventListener('resize', this.onResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Traverse and dispose materials and geometries
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

export function ComicBookScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const spiderSpinSpeedRef = useRef(0);
  const easterEggTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [easterEggText, setEasterEggText] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // Capture the container in local scope to avoid mount ref discrepancies during cleanup
    const container = mountRef.current;

    // Clear any prior children (such as residual canvases from React StrictMode double rendering)
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 1. Setup Scene Elements
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    container.appendChild(renderer.domElement);

    // 2. Setup Lighting (Mouse moves the light coordinate)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 3. Define Theme-Specific Shading Colors
    const isDark = theme === 'dark';
    
    // Custom manga colors
    const primaryCol = new THREE.Color(isDark ? '#FF4B72' : '#E11D48'); // Neon Cherry vs Indie Rose
    const secondaryCol = new THREE.Color(isDark ? '#6366F1' : '#3B2E58'); // Cyber Indigo vs Retro Plum
    const shadowCol = new THREE.Color(isDark ? '#050508' : '#1F1A2C'); // Dark slate shadow
    const outlineCol = new THREE.Color(isDark ? '#FFFFFF' : '#111112'); // White vs Black ink lines

    // 4. Custom GLSL Toon + Halftone Shader
    const toonHalftoneShader = {
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uLightPosition;
        uniform vec3 uBaseColor;
        uniform vec3 uShadowColor;
        uniform float uHalftoneSize;
        uniform float uHalftoneDensity;
        
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        // Custom screen-space halftone dot overlay
        float getHalftone(vec2 screenPos, float radius) {
          float size = uHalftoneSize;
          vec2 grid = fract(screenPos / size) - 0.5;
          float dist = length(grid);
          return step(dist, radius * 0.5);
        }

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 lightDir = normalize(uLightPosition);
          
          float NdotL = dot(normal, lightDir);
          
          // Cel-shading thresholds
          float celIntensity;
          if (NdotL > 0.65) {
            celIntensity = 1.0;
          } else if (NdotL > 0.18) {
            celIntensity = 0.65;
          } else if (NdotL > -0.15) {
            celIntensity = 0.35;
          } else {
            celIntensity = 0.1;
          }
          
          // Halftone scales inside shadow boundaries
          float shadowFactor = 1.0 - clamp((NdotL + 0.3) * 1.3, 0.0, 1.0);
          
          float dotRadius = 0.0;
          if (shadowFactor > 0.15) {
            dotRadius = (shadowFactor - 0.15) * uHalftoneDensity;
          }
          
          vec2 screenPos = gl_FragCoord.xy;
          float halftone = getHalftone(screenPos, dotRadius);
          
          vec3 celColor = mix(uShadowColor, uBaseColor, celIntensity);
          
          vec3 finalColor = celColor;
          if (halftone > 0.5) {
            finalColor = mix(celColor, uShadowColor, 0.85);
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };

    // 5. Inverted Hull Outline Shader
    const outlineShader = {
      vertexShader: `
        uniform float uOutlineThickness;
        void main() {
          // Displace vertices outward along normals to draw outline silhouette
          vec3 pos = position + normal * uOutlineThickness;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uOutlineColor;
        void main() {
          gl_FragColor = vec4(uOutlineColor, 1.0);
        }
      `
    };

    // 6. Materials
    const yMaterial = new THREE.ShaderMaterial({
      vertexShader: toonHalftoneShader.vertexShader,
      fragmentShader: toonHalftoneShader.fragmentShader,
      uniforms: {
        uLightPosition: { value: dirLight.position.clone() },
        uBaseColor: { value: primaryCol },
        uShadowColor: { value: shadowCol },
        uHalftoneSize: { value: 10.0 },
        uHalftoneDensity: { value: 0.8 }
      }
    });

    const starburstMaterial = new THREE.ShaderMaterial({
      vertexShader: toonHalftoneShader.vertexShader,
      fragmentShader: toonHalftoneShader.fragmentShader,
      uniforms: {
        uLightPosition: { value: dirLight.position.clone() },
        uBaseColor: { value: secondaryCol },
        uShadowColor: { value: shadowCol },
        uHalftoneSize: { value: 12.0 },
        uHalftoneDensity: { value: 0.85 }
      }
    });

    const yOutlineMaterial = new THREE.ShaderMaterial({
      vertexShader: outlineShader.vertexShader,
      fragmentShader: outlineShader.fragmentShader,
      uniforms: {
        uOutlineThickness: { value: 0.045 },
        uOutlineColor: { value: outlineCol }
      },
      side: THREE.BackSide
    });

    const starburstOutlineMaterial = new THREE.ShaderMaterial({
      vertexShader: outlineShader.vertexShader,
      fragmentShader: outlineShader.fragmentShader,
      uniforms: {
        uOutlineThickness: { value: 0.055 },
        uOutlineColor: { value: outlineCol }
      },
      side: THREE.BackSide
    });

    // 7. Assemble Geometries & Meshes
    const containerGroup = new THREE.Group();
    scene.add(containerGroup);

    // 7.1 Procedural 3D Spider Web (drawn with Lines)
    const spokeCount = 12;
    const webRadius = 2.4;
    const rings = 5;
    const linePoints: THREE.Vector3[] = [];

    // Radial Spokes
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      linePoints.push(new THREE.Vector3(0, 0, 0));
      linePoints.push(new THREE.Vector3(Math.cos(angle) * webRadius, Math.sin(angle) * webRadius, 0));
    }

    // Concentric sagging rings connecting spokes
    for (let r = 1; r <= rings; r++) {
      const currentRadius = (r / rings) * webRadius;
      for (let i = 0; i < spokeCount; i++) {
        const angle1 = (i / spokeCount) * Math.PI * 2;
        const angle2 = ((i + 1) / spokeCount) * Math.PI * 2;

        const p1 = new THREE.Vector3(Math.cos(angle1) * currentRadius, Math.sin(angle1) * currentRadius, 0);
        const p2 = new THREE.Vector3(Math.cos(angle2) * currentRadius, Math.sin(angle2) * currentRadius, 0);

        // Map a slight sag toward center to represent webs under tension
        const midAngle = (angle1 + angle2) / 2;
        const sagRadius = currentRadius * 0.93; // 7% inward sag
        const pMid = new THREE.Vector3(Math.cos(midAngle) * sagRadius, Math.sin(midAngle) * sagRadius, 0);

        linePoints.push(p1, pMid);
        linePoints.push(pMid, p2);
      }
    }

    const webGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const webMaterial = new THREE.LineBasicMaterial({
      color: outlineCol,
      transparent: true,
      opacity: 0.55,
      linewidth: 1.5
    });
    const webMesh = new THREE.LineSegments(webGeometry, webMaterial);
    webMesh.position.set(0, 0, -0.6);
    containerGroup.add(webMesh);

    // 7.2 Assemble Low-Poly Spider
    const spiderGroup = new THREE.Group();
    spiderGroup.position.set(0, 0, 0.35); // Placed in front
    containerGroup.add(spiderGroup);

    // Abdomen (Body)
    const yGeometry = new THREE.IcosahedronGeometry(0.35, 0); // Low-poly octahedron
    const abdomenMesh = new THREE.Mesh(yGeometry, yMaterial);
    const abdomenOutline = new THREE.Mesh(yGeometry, yOutlineMaterial);
    abdomenMesh.add(abdomenOutline);
    abdomenMesh.scale.set(1, 1, 1.45);
    abdomenMesh.position.set(0, -0.05, 0);
    spiderGroup.add(abdomenMesh);

    // Head
    const headGeometry = new THREE.IcosahedronGeometry(0.22, 0);
    const headMesh = new THREE.Mesh(headGeometry, starburstMaterial);
    const headOutline = new THREE.Mesh(headGeometry, starburstOutlineMaterial);
    headMesh.add(headOutline);
    headMesh.position.set(0, -0.05, 0.44);
    spiderGroup.add(headMesh);

    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); // Glowing white eyes
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.07, 0.04, 0.58);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.07, 0.04, 0.58);
    spiderGroup.add(leftEye);
    spiderGroup.add(rightEye);

    // Legs (8 legs total)
    const legsGroup = new THREE.Group();
    spiderGroup.add(legsGroup);

    const legGeometry = new THREE.BoxGeometry(0.045, 0.045, 0.34);
    legGeometry.center();

    const legRoots: THREE.Group[] = [];

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 4; i++) {
        const legRoot = new THREE.Group();
        // Shift pivot along body sides
        legRoot.position.set(side * 0.16, -0.08, 0.18 + (i - 1.5) * 0.08);

        const angleOffset = (i - 1.5) * 0.38;

        // Upper segment (Femur)
        const upperLeg = new THREE.Mesh(legGeometry, yMaterial);
        const upperOutline = new THREE.Mesh(legGeometry, yOutlineMaterial);
        upperLeg.add(upperOutline);
        upperLeg.scale.set(1, 1, 1.25);
        upperLeg.position.set(side * 0.18, 0.15, 0);
        upperLeg.rotation.set(0, 0, -side * 0.58);
        upperLeg.rotation.y = angleOffset;
        legRoot.add(upperLeg);

        // Lower segment (Tibia)
        const lowerLeg = new THREE.Mesh(legGeometry, starburstMaterial);
        const lowerOutline = new THREE.Mesh(legGeometry, starburstOutlineMaterial);
        lowerLeg.add(lowerOutline);
        lowerLeg.scale.set(0.85, 0.85, 1.3);
        lowerLeg.position.set(side * 0.38, -0.08, 0);
        lowerLeg.rotation.set(0, 0, side * 0.78);
        lowerLeg.rotation.y = angleOffset;
        legRoot.add(lowerLeg);

        legsGroup.add(legRoot);
        legRoots.push(legRoot);
      }
    }

    // 7.3 Silk Thread connecting Web center (0, 0, -0.6) to Spider body (0, y, 0.35)
    const silkPoints = [
      new THREE.Vector3(0, 0, -0.6),
      new THREE.Vector3(0, 0, 0.35)
    ];
    const silkGeom = new THREE.BufferGeometry().setFromPoints(silkPoints);
    const silkLine = new THREE.Line(silkGeom, webMaterial);
    containerGroup.add(silkLine);

    // Initial group configuration
    containerGroup.rotation.set(0.05, -0.08, 0);

    // 8. Interactive Mouse Pointer Tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect) return;
      
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Keyboard Easter Egg listener
    let typedKeys = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      typedKeys += e.key.toLowerCase();
      if (typedKeys.length > 10) {
        typedKeys = typedKeys.slice(-10);
      }
      
      let quote = '';
      if (typedKeys.includes('spidey')) {
        quote = "THWIP! 🕸️";
        typedKeys = '';
      } else if (typedKeys.includes('batman')) {
        quote = "I AM BATMAN! 🦇";
        typedKeys = '';
      } else if (typedKeys.includes('ironman')) {
        quote = "I AM IRON MAN. 🦾";
        typedKeys = '';
      }

      if (quote) {
        spiderSpinSpeedRef.current = 15;
        setEasterEggText(quote);
        if (easterEggTimeoutRef.current) {
          clearTimeout(easterEggTimeoutRef.current);
        }
        easterEggTimeoutRef.current = setTimeout(() => {
          setEasterEggText(null);
        }, 2200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 9. Animation Loop
    let animationFrameId: number;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let bobTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      bobTime += 0.022;

      // Handle hover scale interpolation
      targetScale = isHoveredRef.current ? 1.15 : 1.0;
      currentScale += (targetScale - currentScale) * 0.08;
      containerGroup.scale.setScalar(currentScale);

      // 9.1 Spider floating bob & subtle rotation swaying
      spiderGroup.position.y = Math.sin(bobTime) * 0.08;
      spiderGroup.position.x = Math.sin(bobTime * 0.4) * 0.04;
      
      // Easter egg spin logic (decay spin speed)
      if (spiderSpinSpeedRef.current > 0.01) {
        spiderGroup.rotation.y += spiderSpinSpeedRef.current;
        spiderSpinSpeedRef.current *= 0.92;
      } else {
        spiderGroup.rotation.y = Math.sin(bobTime * 0.5) * 0.06;
      }
      
      spiderGroup.rotation.z = Math.sin(bobTime * 0.3) * 0.04;

      // 9.2 Wiggle legs based on offset phase waves for natural idle insect motion
      legRoots.forEach((legRoot, idx) => {
        const isLeft = idx < 4;
        const legIndex = idx % 4;
        const sideMultiplier = isLeft ? 1 : -1;
        const phase = bobTime * 4.2 + legIndex * Math.PI * 0.5;

        legRoot.rotation.x = Math.sin(phase) * 0.15;
        legRoot.rotation.z = Math.cos(phase) * 0.06 * sideMultiplier;
      });

      // 9.3 Update silk thread vertex to connect web center and spider body
      const positions = silkGeom.attributes.position.array as Float32Array;
      positions[3] = spiderGroup.position.x;
      positions[4] = spiderGroup.position.y;
      positions[5] = spiderGroup.position.z;
      silkGeom.attributes.position.needsUpdate = true;

      // 9.4 Rotate entire scene dynamically based on mouse cursor direction (subtle: < 20 degrees total sway)
      const targetRotateY = mouseX * 0.12 - 0.05; // ~10 deg max sway
      const targetRotateX = -mouseY * 0.08 + 0.04; // ~7 deg max sway

      containerGroup.rotation.y += (targetRotateY - containerGroup.rotation.y) * 0.06;
      containerGroup.rotation.x += (targetRotateX - containerGroup.rotation.x) * 0.06;

      // 9.5 Shift shader lighting coordinates
      dirLight.position.set(5 + mouseX * 4, 5 + mouseY * 4, 5);
      yMaterial.uniforms.uLightPosition.value.copy(dirLight.position);
      starburstMaterial.uniforms.uLightPosition.value.copy(dirLight.position);

      renderer.render(scene, camera);
    };
    animate();

    // 10. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 400;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose Geometries
      yGeometry.dispose();
      headGeometry.dispose();
      legGeometry.dispose();
      eyeGeom.dispose();
      webGeometry.dispose();
      silkGeom.dispose();

      // Dispose Materials
      yMaterial.dispose();
      starburstMaterial.dispose();
      yOutlineMaterial.dispose();
      starburstOutlineMaterial.dispose();
      webMaterial.dispose();
      eyeMat.dispose();

      renderer.dispose();
    };
  }, [theme]);

  // Click Easter Egg trigger helper
  const handleCanvasClick = () => {
    const quotes = [
      "THWIP! 🕸️",
      "My Spider-Sense is tingling! ⚡",
      "With great power comes great clean code. 💻",
      "I am Batman! 🦇",
      "I am Iron Man. 🦾",
      "Is it a bird? Is it a plane? ☄️",
      "With great power, comes great responsibility. 🦸",
      "THWIP! 🕷️"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Trigger rapid spin
    spiderSpinSpeedRef.current = 15;
    
    setEasterEggText(randomQuote);
    if (easterEggTimeoutRef.current) {
      clearTimeout(easterEggTimeoutRef.current);
    }
    easterEggTimeoutRef.current = setTimeout(() => {
      setEasterEggText(null);
    }, 2200);
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-[320px] md:h-[400px] cursor-pointer select-none relative overflow-hidden"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
      onClick={handleCanvasClick}
    >
      {/* Floating UI Helper Banner */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-foreground text-background border-2 border-border-color px-2.5 py-0.5 text-[10px] font-comic-title tracking-widest uppercase select-none pointer-events-none opacity-80 shadow-comic-md z-10">
        Hover to Zoom • Click Spidey
      </div>

      {/* Comic Speech Bubble Easter Egg */}
      {easterEggText && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none w-max max-w-[90%]">
          <div className="bg-accent text-accent-foreground border-3 border-border-color px-4 py-2 font-comic-header uppercase text-sm sm:text-base shadow-comic animate-wiggle relative rounded-lg">
            {easterEggText}
            {/* Speech bubble tail pointer */}
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[10px] border-t-border-color"></div>
            <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-7 border-x-transparent border-t-[8px] border-t-accent"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComicBookScene;

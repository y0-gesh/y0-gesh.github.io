'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SpiderCanvasProps {
  isEnabled: boolean;
  onPullToggle: () => void;
}

export function SpiderCanvas({ isEnabled, onPullToggle }: SpiderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spiderGroupRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Drag / Physics State
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const didTriggerRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const DEFAULT_LENGTH = 70; // Base hanging web length in px
  const THRESHOLD = 45;      // Pull distance to trigger toggle

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = 120;
    const height = 140;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 10);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    const loader = new GLTFLoader();
    loader.load(
      '/model/granny_spider.glb',
      (gltf) => {
        const model = gltf.scene;

        // Compute Bounding Box & Scale to fit nicely
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center); // Center geometry

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.9 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Position spider in canvas
        model.position.set(0, 0, 0);

        const group = new THREE.Group();
        group.add(model);
        scene.add(group);
        spiderGroupRef.current = group;
        setModelLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Could not load granny_spider.glb model:', err);
      }
    );

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (spiderGroupRef.current) {
        // Gentle dangling sway animation
        spiderGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.6) * 0.12;
        spiderGroupRef.current.rotation.y = Math.cos(elapsedTime * 1.2) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const isAnimatingRef = useRef(false);

  // Spring release bounce helper
  const animateSpringRelease = (startVal: number) => {
    let current = startVal;
    let velocity = 0;
    const target = 0;
    const stiffness = 0.16;
    const damping = 0.70;

    isAnimatingRef.current = true;

    const step = () => {
      const force = (target - current) * stiffness;
      velocity = (velocity + force) * damping;
      current += velocity;

      setY(current);

      if (Math.abs(current - target) > 0.4 || Math.abs(velocity) > 0.4) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setY(0);
        isAnimatingRef.current = false;
        animFrameRef.current = null;
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  };

  // Pointer Down Drag Handler
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || isAnimatingRef.current) return;
    e.stopPropagation();
    setIsDragging(true);
    didTriggerRef.current = false;
    startYRef.current = e.clientY - y;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startYRef.current;
    const constrainedY = Math.max(0, Math.min(100, deltaY));

    currentYRef.current = constrainedY;
    setY(constrainedY);

    if (constrainedY >= THRESHOLD && !didTriggerRef.current) {
      didTriggerRef.current = true;
      onPullToggle();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const releaseY = currentYRef.current;

    // If click without drag (drag distance < 6px), run animated pull down
    if (releaseY < 6 && !didTriggerRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      let pull = 0;
      const maxPull = 55;

      const pullStep = () => {
        pull += 7;
        setY(pull);

        if (pull >= THRESHOLD && !didTriggerRef.current) {
          didTriggerRef.current = true;
          onPullToggle();
        }

        if (pull < maxPull) {
          requestAnimationFrame(pullStep);
        } else {
          animateSpringRelease(maxPull);
        }
      };

      requestAnimationFrame(pullStep);
      return;
    }

    currentYRef.current = 0;
    animateSpringRelease(releaseY);
  };

  const currentWebLength = DEFAULT_LENGTH + y;

  return (
    <div
      className="fixed top-0 right-6 sm:right-16 z-999999 flex flex-col items-center pointer-events-none select-none"
      style={{ height: `${DEFAULT_LENGTH + 180}px` }}
    >
      {/* Spider Web Strand SVG */}
      <svg
        width="60"
        height={currentWebLength + 90}
        className="overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
      >
        <defs>
          <filter id="spider-web-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Top Ceiling Anchor Web Plate */}
        <circle cx="30" cy="4" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />

        {/* Outer Dark Comic Outline Web Cord Line */}
        <path
          d={`M 30,4 L 30,${currentWebLength}`}
          fill="none"
          stroke="#0f172a"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Main Spider-Man Pure White Web Strand Line */}
        <path
          d={`M 30,4 L 30,${currentWebLength}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeDasharray={isEnabled ? 'none' : '5,3'}
          strokeLinecap="round"
        />

        {/* Secondary web spiral texture nodes for authentic spider web look */}
        <circle cx="30" cy={currentWebLength * 0.35} r="2" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        <circle cx="30" cy={currentWebLength * 0.7} r="2" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />

        {/* Web Attachment Node Knot */}
        <circle
          cx="30"
          cy={currentWebLength}
          r="4.5"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="2"
        />
      </svg>

      {/* Interactive 3D Spider Container */}
      <div
        className="pointer-events-auto cursor-grab active:cursor-grabbing absolute top-0 flex flex-col items-center group"
        style={{
          transform: `translateY(${currentWebLength - 10}px)`,
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Pull or click Spider to toggle Web Shooter ON/OFF"
      >
        {/* Expanded touch target for easy grabbing */}
        <div className="absolute inset-0 -m-4 rounded-full cursor-grab active:cursor-grabbing"></div>

        {/* 3D Canvas */}
        <div ref={containerRef} className="w-[120px] h-[140px] flex items-center justify-center -mt-4">
          {!modelLoaded && (
            <div className="w-0.5 h-16 bg-white/80 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpiderCanvas;

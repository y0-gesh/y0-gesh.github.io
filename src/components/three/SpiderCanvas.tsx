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

  const DEFAULT_LENGTH = 75; // Base hanging web length in px
  const THRESHOLD = 45;      // Pull distance to trigger toggle
  const SILK_ATTACH_OFFSET = 20; // Exact pixel Y in canvas where silk connects to spider spinneret

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = 120;
    const height = 140;

    const scene = new THREE.Scene();
    // Camera positioned slightly below origin looking towards the spider hanging from y=0
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -0.95, 3.6);

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

    const group = new THREE.Group();
    scene.add(group);
    spiderGroupRef.current = group;

    const loader = new GLTFLoader();
    loader.load(
      '/model/granny_spider.glb',
      (gltf) => {
        const model = gltf.scene;

        // Compute Bounding Box & Scale to fit nicely
        const initialBox = new THREE.Box3().setFromObject(model);
        const size = initialBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.85 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Rotate so head points downwards hanging from web line
        model.rotation.x = Math.PI / 2;
        model.updateMatrixWorld(true);

        // Calculate bounding box after scale and rotation
        const rotatedBox = new THREE.Box3().setFromObject(model);
        const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());

        // Offset model inside group so its spinneret/top abdomen is precisely at (0, 0, 0)
        // and centered along X and Z axes
        model.position.set(
          -rotatedCenter.x,
          -rotatedBox.max.y + 0.1, // Top anchor point at local origin
          -rotatedCenter.z
        );

        group.add(model);
        setModelLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Could not load granny_spider.glb model:', err);
      }
    );

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (spiderGroupRef.current) {
        // Natural pendulum dangling sway anchored at the silk attachment point (0, 0, 0)
        spiderGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.5) * 0.08;
        spiderGroupRef.current.rotation.y = Math.cos(elapsedTime * 1.1) * 0.12;
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
  const webEndY = currentWebLength + SILK_ATTACH_OFFSET;

  return (
    <div
      className="fixed top-0 right-6 sm:right-16 z-999999 flex flex-col items-center pointer-events-none select-none"
      style={{ width: '120px', height: `${currentWebLength + 160}px` }}
    >
      {/* Real Spider Web Silk Strand SVG */}
      <svg
        width="120"
        height={webEndY + 20}
        className="absolute top-0 left-0 overflow-visible pointer-events-none"
      >
        <defs>
          {/* Subtle silk shimmer gradient */}
          <linearGradient id="silk-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#e2e8f0" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
          </linearGradient>

          {/* Delicate silk glow */}
          <filter id="silk-micro-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ceiling anchor dot */}
        <circle cx="60" cy="1" r="1.5" fill="#ffffff" opacity="0.8" />

        {/* Outer soft ambient silk glow */}
        <line
          x1="60"
          y1="0"
          x2="60"
          y2={webEndY}
          stroke={isEnabled ? "#ffffff" : "#94a3b8"}
          strokeWidth="2.5"
          strokeOpacity={isEnabled ? "0.2" : "0.1"}
          filter="url(#silk-micro-glow)"
        />

        {/* Realistic Semi-Translucent Spider Web Silk Thread */}
        <line
          x1="60"
          y1="0"
          x2="60"
          y2={webEndY}
          stroke={isEnabled ? "url(#silk-grad)" : "#94a3b8"}
          strokeWidth="1.1"
          strokeOpacity={isEnabled ? "0.88" : "0.5"}
          strokeDasharray={isEnabled ? "none" : "3,3"}
        />

        {/* Ultra-fine bright specular highlight filament */}
        {isEnabled && (
          <line
            x1="60"
            y1="0"
            x2="60"
            y2={webEndY}
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.95"
          />
        )}

        {/* Silk attachment droplet on spider spinneret */}
        <circle
          cx="60"
          cy={webEndY}
          r="1.2"
          fill="#ffffff"
          opacity={isEnabled ? "0.85" : "0.4"}
        />
      </svg>

      {/* Interactive 3D Spider Container */}
      <div
        className="pointer-events-auto cursor-grab active:cursor-grabbing absolute top-0 left-0 flex flex-col items-center group"
        style={{
          transform: `translateY(${currentWebLength}px)`,
          touchAction: 'none',
          width: '120px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Pull or click Spider to toggle Web Shooter ON/OFF"
      >
        {/* Expanded touch target for easy grabbing */}
        <div className="absolute inset-0 -m-3 rounded-full cursor-grab active:cursor-grabbing"></div>

        {/* 3D Canvas */}
        <div ref={containerRef} className="w-[120px] h-[140px] flex items-center justify-center">
          {!modelLoaded && (
            <div className="w-0.5 h-16 bg-white/60 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpiderCanvas;


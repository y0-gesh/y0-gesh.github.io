"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface SpiderCanvasProps {
  isEnabled: boolean;
  onPullToggle: () => void;
}

export function SpiderCanvas({ isEnabled, onPullToggle }: SpiderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spiderGroupRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const spiderElementRef = useRef<HTMLDivElement>(null);
  const silkPathRefs = useRef<SVGPathElement[]>([]);
  const sideFiberRefs = useRef<SVGPathElement[]>([]);

  // Drag / Physics State (both X and Y deflection)
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const didTriggerRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const DEFAULT_LENGTH = 75; // Base hanging web length in px
  const THRESHOLD = 45; // Pull distance to trigger toggle
  const SILK_ATTACH_OFFSET = 58; // Extends silk strand directly into the center/abdomen of the spider model

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = 120;
    const height = 140;

    const scene = new THREE.Scene();
    // Camera positioned looking directly at the hanging spider
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
      "/model/granny_spider.glb",
      (gltf) => {
        const model = gltf.scene;

        // Compute Bounding Box & Scale to fit nicely
        const initialBox = new THREE.Box3().setFromObject(model);
        const size = initialBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.85 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Rotate so top faces camera and rotate around Z so spider body aligns vertically straight downwards
        // model.rotation.x = Math.PI / 2;
        model.rotation.x = Math.PI / 0.38;
        model.rotation.z = 0.58; // Align body axis so head points straight vertically down
        model.rotation.y = -0.6; // Align body axis so head points straight vertically down
        model.updateMatrixWorld(true);

        // Calculate bounding box after scale and rotation
        const rotatedBox = new THREE.Box3().setFromObject(model);
        const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());

        // Center model inside group along X/Z and position top anchor near origin
        model.position.set(
          -rotatedCenter.x,
          -rotatedBox.max.y + 0.1,
          -rotatedCenter.z,
        );

        group.add(model);
        setModelLoaded(true);
      },
      undefined,
      (err) => {
        console.warn("Could not load granny_spider.glb model:", err);
      },
    );

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Natural idle dangling sway movement
      const swayX = Math.sin(elapsedTime * 1.5) * 2.8;
      const swayRotation = Math.sin(elapsedTime * 1.5) * 0.07;
      const swayY = Math.cos(elapsedTime * 1.1) * 1.0;

      // When being dragged with cursor, tilt spider in direction of pull deflection
      const dragTilt = (currentXRef.current / 60) * 0.25;

      if (spiderGroupRef.current) {
        spiderGroupRef.current.rotation.z = swayRotation + dragTilt;
        spiderGroupRef.current.rotation.y = Math.cos(elapsedTime * 1.1) * 0.1;
      }

      /*
       * Send the sway movement to the React spider wrapper
       * without causing a React re-render every animation frame.
       */
      if (spiderElementRef.current) {
        spiderElementRef.current.style.setProperty(
          "--spider-sway-x",
          `${swayX}px`,
        );

        spiderElementRef.current.style.setProperty(
          "--spider-sway-y",
          `${swayY}px`,
        );
      }

      /*
       * Animate the silk string with deflection based on cursor pull direction!
       * Top anchor stays at ceiling (x=60, y=1).
       * Bottom follows the spider's dragged position (60 + currentX + swayX, length).
       * The middle deflects and bows realistically according to cursor drag vector.
       */
      const dragX = currentXRef.current;
      const length = DEFAULT_LENGTH + currentYRef.current + SILK_ATTACH_OFFSET;

      const wave1 = Math.sin(elapsedTime * 1.5);
      const wave2 = Math.sin(elapsedTime * 1.5 + 0.8);
      const wave3 = Math.sin(elapsedTime * 1.5 + 1.5);

      const bottomX = 60 + dragX + swayX;
      const bottomY = length;

      // Realistic elastic curve control points reflecting pull deflection
      const c1x = 60 + dragX * 0.18 + wave1 * 0.8;
      const c2x = 60 + dragX * 0.48 + wave2 * 1.4;
      const c3x = 60 + dragX * 0.78 + wave3 * 1.8;

      /*
       * Main silk fiber
       */
      if (silkPathRefs.current[0]) {
        silkPathRefs.current[0].setAttribute(
          "d",
          `
        M 60 1
        C
          ${c1x} ${length * 0.22},
          ${c2x} ${length * 0.48},
          ${c3x} ${length * 0.72}
        C
          ${60 + dragX * 0.88 + wave1 * 1.5} ${length * 0.84},
          ${60 + dragX * 0.95 + wave2 * 1.8} ${length * 0.94},
          ${bottomX} ${bottomY}
      `,
        );
      }

      /*
       * Secondary silk filament
       */
      if (silkPathRefs.current[1]) {
        silkPathRefs.current[1].setAttribute(
          "d",
          `
        M 60.12 1
        C
          ${60 + dragX * 0.2 + wave2 * 1.0} ${length * 0.25},
          ${60 + dragX * 0.5 + wave3 * 1.2} ${length * 0.50},
          ${60 + dragX * 0.8 + wave1 * 1.5} ${length * 0.75}
        C
          ${60 + dragX * 0.9 + wave2 * 1.6} ${length * 0.86},
          ${60 + dragX * 0.96 + wave3 * 1.4} ${length * 0.95},
          ${bottomX} ${bottomY}
      `,
        );
      }

      /*
       * Fine highlight filament
       */
      if (silkPathRefs.current[2]) {
        silkPathRefs.current[2].setAttribute(
          "d",
          `
        M 59.94 1
        C
          ${60 + dragX * 0.22 + wave3 * 0.7} ${length * 0.28},
          ${60 + dragX * 0.52 + wave1 * 1.1} ${length * 0.55},
          ${60 + dragX * 0.82 + wave2 * 1.4} ${length * 0.78}
        C
          ${60 + dragX * 0.92 + wave1 * 1.5} ${length * 0.88},
          ${bottomX} ${length * 0.96},
          ${bottomX} ${bottomY}
      `,
        );
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

  // Dual-axis spring release bounce helper
  const animateSpringRelease = (startX: number, startY: number) => {
    let curX = startX;
    let curY = startY;
    let velX = 0;
    let velY = 0;
    const target = 0;
    const stiffness = 0.16;
    const damping = 0.72;

    isAnimatingRef.current = true;

    const step = () => {
      const forceX = (target - curX) * stiffness;
      velX = (velX + forceX) * damping;
      curX += velX;

      const forceY = (target - curY) * stiffness;
      velY = (velY + forceY) * damping;
      curY += velY;

      currentXRef.current = curX;
      currentYRef.current = curY;
      setX(curX);
      setY(curY);

      const stillMoving =
        Math.abs(curX - target) > 0.3 ||
        Math.abs(velX) > 0.3 ||
        Math.abs(curY - target) > 0.3 ||
        Math.abs(velY) > 0.3;

      if (stillMoving) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        currentXRef.current = 0;
        currentYRef.current = 0;
        setX(0);
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
    startXRef.current = e.clientX - x;
    startYRef.current = e.clientY - y;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    // Allow lateral deflection (±55px) and downward pull (0-110px)
    const constrainedX = Math.max(-55, Math.min(55, deltaX));
    const constrainedY = Math.max(0, Math.min(110, deltaY));

    currentXRef.current = constrainedX;
    currentYRef.current = constrainedY;
    setX(constrainedX);
    setY(constrainedY);

    // Trigger toggle when pulled sufficiently downward or overall drag distance
    const totalPull = Math.sqrt(constrainedX * constrainedX + constrainedY * constrainedY);
    if ((constrainedY >= THRESHOLD || totalPull >= THRESHOLD + 5) && !didTriggerRef.current) {
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

    const releaseX = currentXRef.current;
    const releaseY = currentYRef.current;

    // If click without significant drag (< 6px), run animated pull down
    if (Math.hypot(releaseX, releaseY) < 6 && !didTriggerRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      let pull = 0;
      const maxPull = 55;

      const pullStep = () => {
        pull += 7;
        currentYRef.current = pull;
        setY(pull);

        if (pull >= THRESHOLD && !didTriggerRef.current) {
          didTriggerRef.current = true;
          onPullToggle();
        }

        if (pull < maxPull) {
          requestAnimationFrame(pullStep);
        } else {
          animateSpringRelease(0, maxPull);
        }
      };

      requestAnimationFrame(pullStep);
      return;
    }

    animateSpringRelease(releaseX, releaseY);
  };

  const currentWebLength = DEFAULT_LENGTH + y;
  const webEndY = currentWebLength + SILK_ATTACH_OFFSET;

  return (
    <div
      className="fixed top-0 right-6 sm:right-16 z-999999 flex flex-col items-center pointer-events-none select-none"
      style={{ width: "120px", height: `${currentWebLength + 160}px` }}
    >
      {/* Real Animated Spider Web Silk Strand SVG */}
      <svg
        width="120"
        height={webEndY + 25}
        className="absolute top-0 left-0 overflow-visible pointer-events-none"
        viewBox={`0 0 120 ${webEndY + 25}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Extremely subtle silk softness */}
          <filter
            id="silk-softness"
            x="-100%"
            y="-20%"
            width="300%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="0.18" />
          </filter>

          {/* Very subtle outer atmospheric fiber */}
          <filter
            id="silk-ambient"
            x="-200%"
            y="-50%"
            width="400%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="0.65" />
          </filter>
        </defs>

        {/* Ceiling attachment */}
        <circle
          cx="60"
          cy="1"
          r="0.9"
          fill="#ffffff"
          opacity={isEnabled ? 0.8 : 0.3}
        />

        {/* Ambient atmospheric silk glow */}
        <path
          d={`M 60 1 C 60 ${webEndY * 0.3}, 60 ${webEndY * 0.6}, 60 ${webEndY}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity={isEnabled ? 0.055 : 0.02}
          filter="url(#silk-ambient)"
        />

        {/* Main silk fiber */}
        <path
          ref={(el) => {
            if (el) silkPathRefs.current[0] = el;
          }}
          d={`
            M 60 1
            C
              60 ${webEndY * 0.22},
              60 ${webEndY * 0.48},
              60 ${webEndY * 0.72}
            C
              60 ${webEndY * 0.84},
              60 ${webEndY * 0.94},
              ${60 + x} ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isEnabled ? 0.92 : 0.38}
        />

        {/* Secondary micro-strand */}
        <path
          ref={(el) => {
            if (el) silkPathRefs.current[1] = el;
          }}
          d={`
            M 60.12 1
            C
              60.12 ${webEndY * 0.25},
              60.05 ${webEndY * 0.50},
              60.1 ${webEndY * 0.75}
            C
              60.15 ${webEndY * 0.86},
              60.08 ${webEndY * 0.95},
              ${60 + x} ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.32"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isEnabled ? 0.68 : 0.24}
        />

        {/* Micro highlight fiber */}
        <path
          ref={(el) => {
            if (el) silkPathRefs.current[2] = el;
          }}
          d={`
            M 59.94 1
            C
              59.94 ${webEndY * 0.28},
              60.05 ${webEndY * 0.55},
              59.98 ${webEndY * 0.78}
            C
              59.94 ${webEndY * 0.88},
              60 ${webEndY * 0.96},
              ${60 + x} ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.18"
          strokeLinecap="round"
          opacity={isEnabled ? 0.75 : 0.2}
        />

        {/* Spinneret connection droplet on spider */}
        <circle
          cx={60 + x}
          cy={webEndY}
          r="0.75"
          fill="#ffffff"
          opacity={isEnabled ? 0.9 : 0.35}
        />
      </svg>

      {/* Interactive 3D Spider */}
      <div
        ref={spiderElementRef}
        className="
          pointer-events-auto
          cursor-grab
          active:cursor-grabbing
          absolute
          top-0
          left-0
          flex
          flex-col
          items-center
          group
        "
        style={{
          transform: `
            translate3d(
              calc(${x}px + var(--spider-sway-x, 0px)),
              calc(${currentWebLength}px + var(--spider-sway-y, 0px)),
              0
            )
          `,
          willChange: "transform",
          touchAction: "none",
          width: "120px",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Pull or click Spider to toggle Web Shooter ON/OFF"
      >
        {/* Expanded invisible touch target */}
        <div
          className="
            absolute
            inset-0
            -m-3
            rounded-full
            cursor-grab
            active:cursor-grabbing
          "
        />

        {/* 3D Spider Canvas */}
        <div
          ref={containerRef}
          className="
            w-[120px]
            h-[140px]
            flex
            items-center
            justify-center
          "
        >
          {!modelLoaded && (
            <div
              className="
                w-0.5
                h-16
                bg-white/60
                animate-pulse
              "
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SpiderCanvas;


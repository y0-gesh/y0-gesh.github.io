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

  // Drag / Physics State
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const didTriggerRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const DEFAULT_LENGTH = 75; // Base hanging web length in px
  const THRESHOLD = 45; // Pull distance to trigger toggle
  const SILK_ATTACH_OFFSET = 50; // Exact pixel Y in canvas where silk connects to spider spinneret

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
      "/model/granny_spider.glb",
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

      // Same natural movement used by the spider.
      const swayX = Math.sin(elapsedTime * 1.5) * 3.2;
      const swayRotation = Math.sin(elapsedTime * 1.5) * 0.08;
      const swayY = Math.cos(elapsedTime * 1.1) * 1.2;

      if (spiderGroupRef.current) {
        spiderGroupRef.current.rotation.z = swayRotation;
        spiderGroupRef.current.rotation.y = Math.cos(elapsedTime * 1.1) * 0.12;
      }

      /*
       * Send the horizontal movement to the React spider wrapper
       * without causing a React render every animation frame.
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
       * Animate the silk itself.
       *
       * Top remains attached to the ceiling at x=60.
       * Bottom follows the spider.
       *
       * The middle bends naturally, instead of moving as a rigid line.
       */
      const length = DEFAULT_LENGTH + currentYRef.current + SILK_ATTACH_OFFSET;

      const wave1 = Math.sin(elapsedTime * 1.5);
      const wave2 = Math.sin(elapsedTime * 1.5 + 0.8);
      const wave3 = Math.sin(elapsedTime * 1.5 + 1.5);

      const bottomX = 60 + swayX;
      const bottomY = length;

      const c1x = 60 + wave1 * 0.9;
      const c2x = 60 + wave2 * 1.8;
      const c3x = 60 + wave3 * 2.5;

      /*
       * Main silk.
       */
      if (silkPathRefs.current[0]) {
        silkPathRefs.current[0].setAttribute(
          "d",
          `
        M 60 1
        C
          ${c1x} ${length * 0.18},
          ${c2x} ${length * 0.38},
          ${c3x} ${length * 0.58}
        C
          ${60 + wave1 * 2.2} ${length * 0.74},
          ${60 + wave2 * 2.8} ${length * 0.89},
          ${bottomX} ${bottomY}
      `,
        );
      }

      /*
       * Secondary silk filament.
       */
      if (silkPathRefs.current[1]) {
        silkPathRefs.current[1].setAttribute(
          "d",
          `
        M 60.15 1
        C
          ${60 + wave2 * 1.2} ${length * 0.2},
          ${60 + wave3 * 1.5} ${length * 0.42},
          ${60 + wave1 * 2.0} ${length * 0.62}
        C
          ${60 + wave2 * 2.5} ${length * 0.78},
          ${60 + wave3 * 2.3} ${length * 0.92},
          ${bottomX} ${bottomY}
      `,
        );
      }

      /*
       * Fine highlight filament.
       */
      if (silkPathRefs.current[2]) {
        silkPathRefs.current[2].setAttribute(
          "d",
          `
        M 59.95 1
        C
          ${60 + wave3 * 0.8} ${length * 0.25},
          ${60 + wave1 * 1.4} ${length * 0.5},
          ${60 + wave2 * 1.8} ${length * 0.75}
        C
          ${60 + wave1 * 2.0} ${length * 0.88},
          ${bottomX} ${length * 0.96},
          ${bottomX} ${bottomY}
      `,
        );
      }

      renderer.render(scene, camera);
    };

    animate();

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
    const damping = 0.7;

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
      style={{ width: "120px", height: `${currentWebLength + 160}px` }}
    >
      {/* Real Spider Web Silk Strand SVG */}
      {/* Reference-style spider silk strand */}
      {/* =========================================================
          REALISTIC ANIMATED SPIDER SILK
          ========================================================= */}

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

        {/* =====================================================
            CEILING ATTACHMENT
            ===================================================== */}

        <circle
          cx="60"
          cy="1"
          r="0.9"
          fill="#ffffff"
          opacity={isEnabled ? 0.8 : 0.3}
        />

        {/* =====================================================
            VERY SUBTLE AMBIENT SILK
            Almost invisible — just gives the thread a little
            natural presence against a dark background.
            ===================================================== */}

        <path
          d={`M 60 1 C 60 ${webEndY * 0.3}, 60 ${webEndY * 0.6}, 60 ${webEndY}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity={isEnabled ? 0.055 : 0.02}
          filter="url(#silk-ambient)"
        />

        {/* =====================================================
            MAIN SILK FIBER
            This is the primary visible strand.
            Thin, irregular and animated.
            ===================================================== */}

        <path
          ref={(el) => {
            if (el) {
              silkPathRefs.current[0] = el;
            }
          }}
          d={`
            M 60 1

            C
              60 ${webEndY * 0.18},
              60 ${webEndY * 0.38},
              60 ${webEndY * 0.58}

            C
              60 ${webEndY * 0.75},
              60 ${webEndY * 0.9},
              60 ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.48"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isEnabled ? 0.9 : 0.38}
        />

        {/* =====================================================
            SECOND SILK FIBER
            Slightly offset from the main fiber. This creates
            the appearance of several microscopic strands.
            ===================================================== */}

        <path
          ref={(el) => {
            if (el) {
              silkPathRefs.current[1] = el;
            }
          }}
          d={`
            M 60.12 1

            C
              60.12 ${webEndY * 0.2},
              60 ${webEndY * 0.42},
              60.1 ${webEndY * 0.62}

            C
              60.15 ${webEndY * 0.78},
              60 ${webEndY * 0.92},
              60 ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.28"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isEnabled ? 0.65 : 0.24}
        />

        {/* =====================================================
            MICRO HIGHLIGHT FIBER
            Extremely thin. Gives real silk its tiny highlight.
            ===================================================== */}

        <path
          ref={(el) => {
            if (el) {
              silkPathRefs.current[2] = el;
            }
          }}
          d={`
            M 59.94 1

            C
              59.94 ${webEndY * 0.25},
              60.05 ${webEndY * 0.48},
              59.98 ${webEndY * 0.7}

            C
              59.94 ${webEndY * 0.84},
              60 ${webEndY * 0.94},
              60 ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.16"
          strokeLinecap="round"
          opacity={isEnabled ? 0.72 : 0.2}
        />

        {/* =====================================================
            TINY BROKEN SIDE FIBERS
            These make it feel less computer-perfect.
            ===================================================== */}

        {isEnabled && (
          <>
            <path
              d={`
                M 59.7 ${webEndY * 0.18}
                C
                  59.82 ${webEndY * 0.2},
                  59.92 ${webEndY * 0.22},
                  60 ${webEndY * 0.25}
              `}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.12"
              strokeLinecap="round"
              opacity="0.35"
            />

            <path
              d={`
                M 60.22 ${webEndY * 0.36}
                C
                  60.12 ${webEndY * 0.38},
                  60.04 ${webEndY * 0.4},
                  59.98 ${webEndY * 0.43}
              `}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.11"
              strokeLinecap="round"
              opacity="0.3"
            />

            <path
              d={`
                M 59.75 ${webEndY * 0.57}
                C
                  59.84 ${webEndY * 0.59},
                  59.94 ${webEndY * 0.61},
                  60.02 ${webEndY * 0.63}
              `}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.1"
              strokeLinecap="round"
              opacity="0.28"
            />

            <path
              d={`
                M 60.24 ${webEndY * 0.73}
                C
                  60.14 ${webEndY * 0.75},
                  60.06 ${webEndY * 0.77},
                  60 ${webEndY * 0.8}
              `}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.1"
              strokeLinecap="round"
              opacity="0.25"
            />
          </>
        )}

        {/* =====================================================
            SPINNERET CONNECTION
            The silk narrows slightly right before the spider.
            ===================================================== */}

        <path
          d={`
            M 60 ${webEndY - 4}

            C
              59.98 ${webEndY - 3},
              59.99 ${webEndY - 1.5},
              60 ${webEndY}
          `}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.52"
          strokeLinecap="round"
          opacity={isEnabled ? 0.92 : 0.35}
        />

        {/* Tiny silk attachment point */}
        <circle
          cx="60"
          cy={webEndY}
          r="0.65"
          fill="#ffffff"
          opacity={isEnabled ? 0.85 : 0.3}
        />
      </svg>

      {/* =========================================================
          INTERACTIVE SPIDER
          ========================================================= */}

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
              var(--spider-sway-x, 0px),
              calc(
                ${currentWebLength}px +
                var(--spider-sway-y, 0px)
              ),
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

        {/* =====================================================
            3D SPIDER CANVAS
            ===================================================== */}

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

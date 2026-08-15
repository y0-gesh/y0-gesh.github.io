"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface SpiderCanvasProps {
  isEnabled: boolean;
  onPullToggle: () => void;
}

/*
 * Computes the rotation (around the screen z-axis) needed to bring the
 * model's dominant axis onto the vertical. This is used as a fallback
 * when the named landmark bones aren't present on the model, so we no
 * longer depend on a hardcoded angle that only matches one specific rig.
 *
 * The dominant axis is found via principal component analysis over all
 * mesh vertices in world space, which naturally follows the spider's
 * elongated body/leg shape regardless of bone naming.
 */
function computeBodyAxisAlignmentAngle(model: THREE.Object3D): number {
  const worldPos = new THREE.Vector3();
  const points: { x: number; y: number }[] = [];
  let meanX = 0;
  let meanY = 0;

  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    const positionAttr = mesh.geometry?.getAttribute("position");
    if (!positionAttr) return;

    for (let i = 0; i < positionAttr.count; i++) {
      worldPos.fromBufferAttribute(positionAttr, i);
      mesh.localToWorld(worldPos);
      points.push({ x: worldPos.x, y: worldPos.y });
      meanX += worldPos.x;
      meanY += worldPos.y;
    }
  });

  if (points.length === 0) return 0;

  meanX /= points.length;
  meanY /= points.length;

  let covXX = 0;
  let covYY = 0;
  let covXY = 0;

  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    covXX += dx * dx;
    covYY += dy * dy;
    covXY += dx * dy;
  }

  // Angle of the dominant axis (an undirected line) measured from the x-axis
  const axisAngle = 0.5 * Math.atan2(2 * covXY, covXX - covYY);

  // Rotation needed to bring that axis onto the vertical (y-axis), wrapped
  // to the smallest turn so the model doesn't get flipped unexpectedly
  let delta = Math.PI / 2 - axisAngle;
  while (delta > Math.PI / 2) delta -= Math.PI;
  while (delta < -Math.PI / 2) delta += Math.PI;

  return delta;
}

export function SpiderCanvas({ isEnabled, onPullToggle }: SpiderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spiderGroupRef = useRef<THREE.Group | null>(null);
  const spinneretRef = useRef<THREE.Object3D | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const spiderElementRef = useRef<HTMLDivElement>(null);
  const silkPathRefs = useRef<SVGPathElement[]>([]);
  const ambientSilkRef = useRef<SVGPathElement>(null);
  const dropletRef = useRef<SVGCircleElement>(null);

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
  // Used only for SVG height / viewBox (projection supplies the real attach point)
  const SILK_ATTACH_OFFSET = 70;

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

        // Calibrated orientation: aligned straight vertically downwards
        model.rotation.set(1.315, -0.560, -0.040);
        model.updateMatrixWorld(true);

        // Find spinneret (Spider_back_00)
        const spiderBack = model.getObjectByName("Spider_back_00");
        if (spiderBack) {
          spinneretRef.current = spiderBack;
        }

        // Recompute world bounding box after rotation
        const rotatedBox = new THREE.Box3().setFromObject(model);

        // Center on the actual abdomen apex (Spider_back_00) so silk enters the exact center of abdomen
        if (spiderBack) {
          const backPos = new THREE.Vector3();
          spiderBack.getWorldPosition(backPos);
          model.position.set(
            -backPos.x,
            -rotatedBox.max.y,
            -backPos.z,
          );
        } else {
          const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());
          model.position.set(
            -rotatedCenter.x,
            -rotatedBox.max.y + 0.1,
            -rotatedCenter.z,
          );
        }

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

      // Natural idle dangling sway movement (pendulum physics)
      const swayX = Math.sin(elapsedTime * 1.5) * 3.4;
      const swayRotation = Math.sin(elapsedTime * 1.5) * 0.08;
      const swayY = Math.cos(elapsedTime * 1.1) * 1.0;

      const dragX = currentXRef.current;
      const dragY = currentYRef.current;

      // Calculate the true direction vector of the string from the ceiling anchor
      const totalDx = dragX + swayX;
      const totalDy = DEFAULT_LENGTH + dragY + SILK_ATTACH_OFFSET + swayY;
      const tensionAngle = Math.atan2(totalDx, totalDy);

      if (spiderGroupRef.current) {
        // Body tilts dynamically to align along the line of tension of the web strand!
        spiderGroupRef.current.rotation.z = -tensionAngle + swayRotation * 0.4;
        spiderGroupRef.current.rotation.y = Math.cos(elapsedTime * 1.1) * 0.08;
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
       * Project the real spinneret location every frame so the silk
       * stays perfectly glued to the abdomen even while the model tilts.
       */
      let projX = 60;          // fallback (canvas center)
      let projY = SILK_ATTACH_OFFSET; // fallback

      if (spinneretRef.current) {
        const vec = new THREE.Vector3();
        spinneretRef.current.getWorldPosition(vec);
        vec.project(camera);

        // NDC → canvas pixels (y is flipped because NDC +Y is up)
        projX = (vec.x * 0.5 + 0.5) * width;
        projY = (-vec.y * 0.5 + 0.5) * height;
      }

      // Absolute position of the attachment point in the outer SVG coordinate system
      const bottomX = dragX + swayX + projX;
      const bottomY = DEFAULT_LENGTH + dragY + projY + swayY;

      const dx = bottomX - 60;
      const dy = bottomY - 1;

      // Subtle dynamic harmonic flex along the string
      const wave1 = Math.sin(elapsedTime * 1.5);
      const wave2 = Math.sin(elapsedTime * 1.5 + 0.8);
      const wave3 = Math.sin(elapsedTime * 1.5 + 1.5);

      // Realistic pendulum cubic Bézier control points
      const c1x = 60 + dx * 0.30 + wave1 * 0.4;
      const c1y = 1 + dy * 0.32;
      const c2x = 60 + dx * 0.70 + wave2 * 0.6;
      const c2y = 1 + dy * 0.68;

      /*
       * Main silk fiber - completely swinging with the spider
       */
      if (silkPathRefs.current[0]) {
        silkPathRefs.current[0].setAttribute(
          "d",
          `M 60 1 C ${c1x} ${c1y}, ${c2x} ${c2y}, ${bottomX} ${bottomY}`,
        );
      }

      /*
       * Secondary silk filament
       */
      if (silkPathRefs.current[1]) {
        silkPathRefs.current[1].setAttribute(
          "d",
          `M 60.12 1 C ${60 + dx * 0.32 + wave2 * 0.5} ${c1y}, ${60 + dx * 0.72 + wave3 * 0.6} ${c2y}, ${bottomX} ${bottomY}`,
        );
      }

      /*
       * Fine highlight filament
       */
      if (silkPathRefs.current[2]) {
        silkPathRefs.current[2].setAttribute(
          "d",
          `M 59.94 1 C ${60 + dx * 0.28 + wave3 * 0.3} ${c1y}, ${60 + dx * 0.68 + wave1 * 0.5} ${c2y}, ${bottomX} ${bottomY}`,
        );
      }

      /*
       * Ambient soft glow path - swings synchronously
       */
      if (ambientSilkRef.current) {
        ambientSilkRef.current.setAttribute(
          "d",
          `M 60 1 C ${60 + dx * 0.3} ${c1y}, ${60 + dx * 0.7} ${c2y}, ${bottomX} ${bottomY}`,
        );
      }

      /*
       * Silk attachment droplet on spider spinneret
       */
      if (dropletRef.current) {
        dropletRef.current.setAttribute("cx", bottomX.toFixed(2));
        dropletRef.current.setAttribute("cy", bottomY.toFixed(2));
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

  const MAX_PULL_RADIUS = 135; // Maximum stretch radius before automatic snap detachment

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;
    const rawY = Math.max(0, deltaY);
    const pullDistance = Math.hypot(deltaX, rawY);

    // Auto-detach grab when pulled past max stretch radius!
    if (pullDistance >= MAX_PULL_RADIUS) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);

      if (!didTriggerRef.current) {
        didTriggerRef.current = true;
        onPullToggle();
      }

      const clampedX = (deltaX / pullDistance) * MAX_PULL_RADIUS;
      const clampedY = (rawY / pullDistance) * MAX_PULL_RADIUS;

      currentXRef.current = clampedX;
      currentYRef.current = clampedY;
      setX(clampedX);
      setY(clampedY);

      animateSpringRelease(clampedX, clampedY);
      return;
    }

    currentXRef.current = deltaX;
    currentYRef.current = rawY;
    setX(deltaX);
    setY(rawY);

    // Trigger toggle when pulled sufficiently downward or overall drag distance
    if ((rawY >= THRESHOLD || pullDistance >= THRESHOLD) && !didTriggerRef.current) {
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
          ref={ambientSilkRef}
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
              60 ${webEndY * 0.30},
              60 ${webEndY * 0.70},
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
              60.12 ${webEndY * 0.32},
              60.1 ${webEndY * 0.72},
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
              59.98 ${webEndY * 0.68},
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
          ref={dropletRef}
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
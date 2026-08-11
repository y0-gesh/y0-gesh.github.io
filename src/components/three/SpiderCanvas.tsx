'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SpiderCanvasProps {
  isPulled: boolean;
  onPullToggle: () => void;
}

export function SpiderCanvas({ isPulled, onPullToggle }: SpiderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spiderGroupRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = 120;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

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

    // Create 3D Realistic Pure White Silk Web Strand from top of canvas down to spider
    const webMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.15,
      gapSize: 0.05,
      linewidth: 2,
    });

    const webPoints = [
      new THREE.Vector3(0, 2.5, 0),    // Top ceiling anchor
      new THREE.Vector3(0, -0.4, 0),   // Spider attachment point
    ];
    const webGeometry = new THREE.BufferGeometry().setFromPoints(webPoints);
    const webLine = new THREE.Line(webGeometry, webMaterial);
    webLine.computeLineDistances();
    scene.add(webLine);

    // Outer glow strand line for 3D silk realism
    const glowMaterial = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.7,
    });
    const glowLine = new THREE.Line(webGeometry, glowMaterial);
    scene.add(glowLine);

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
        const scale = 1.8 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Position spider right at the end of the silk web line
        model.position.set(0, -0.4, 0);

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
        // Gentle dangling sway animation anchored to web tip
        spiderGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.5) * 0.12;
        spiderGroupRef.current.rotation.y = Math.cos(elapsedTime * 1.0) * 0.15;
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

  return (
    <div
      onClick={onPullToggle}
      className={`relative cursor-pointer transition-transform duration-300 active:scale-95 group ${
        isPulled ? 'translate-y-8' : 'translate-y-0'
      }`}
      title="Pull Spider to toggle Web Shooter ON/OFF"
    >
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-[120px] h-[180px] flex items-center justify-center -mt-6">
        {!modelLoaded && (
          <div className="w-0.5 h-16 bg-white/80 animate-pulse"></div>
        )}
      </div>
    </div>
  );
}

export default SpiderCanvas;

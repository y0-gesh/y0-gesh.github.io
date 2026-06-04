'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

export function ComicBookScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene Elements
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    
    // Transparent background so theme background shows through
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 3. Create Cover Texture dynamically via HTML Canvas
    const createCoverTexture = (isDark: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Background
      ctx.fillStyle = isDark ? '#FF3D3D' : '#E23636'; // Marvel Red
      ctx.fillRect(0, 0, 512, 512);

      // Yellow Accent Slash
      ctx.fillStyle = '#F7D117'; // Comic Yellow
      ctx.beginPath();
      ctx.moveTo(0, 400);
      ctx.lineTo(512, 300);
      ctx.lineTo(512, 380);
      ctx.lineTo(0, 480);
      ctx.fill();

      // Black Borders/Outlines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 12;
      ctx.strokeRect(10, 10, 492, 492);

      // Title Banner
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(40, 50, 432, 100);
      ctx.strokeRect(40, 50, 432, 100);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 54px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('YOGESH', 256, 100);

      // Issue Badge
      ctx.fillStyle = '#000000';
      ctx.fillRect(40, 170, 70, 70);
      ctx.strokeRect(40, 170, 70, 70);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('No.1', 75, 205);

      // Comic details text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Impact, sans-serif';
      ctx.fillText('CREATIVE CODE', 256, 270);
      
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('PORTFOLIO ISSUE', 256, 310);

      // Action splash text
      ctx.fillStyle = '#000000';
      ctx.font = 'italic bold 44px Impact, sans-serif';
      ctx.fillText('BAM!', 256, 430);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // 4. Create Inside Page Texture
    const createPageTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.fillStyle = '#F5F2EB'; // Off-white comic paper
      ctx.fillRect(0, 0, 512, 512);

      // Panel borders
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 210, 210);
      ctx.strokeRect(270, 30, 210, 210);
      ctx.strokeRect(30, 270, 450, 210);

      // Draw panel illustrations sketches
      ctx.fillStyle = '#1F3A60'; // Comic blue ink
      ctx.fillRect(50, 50, 170, 170);
      ctx.fillStyle = '#E23636'; // Red ink
      ctx.fillRect(290, 50, 170, 170);

      // Speech bubble
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(256, 375, 120, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WELCOME TO MY STORY!', 256, 380);

      return new THREE.CanvasTexture(canvas);
    };

    // Instantiate textures
    const isDark = theme === 'dark';
    const coverTex = createCoverTexture(isDark);
    const pageTex = createPageTexture();

    // 5. Construct the Book Group
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // Book spine width/height parameters
    const bookW = 1.6;
    const bookH = 2.4;
    const bookThickness = 0.12;

    // Materials
    const coverMaterial = new THREE.MeshStandardMaterial({ 
      map: coverTex, 
      roughness: 0.4 
    });
    
    const backMaterial = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0x222222 : 0xdddddd, 
      roughness: 0.5 
    });

    const spineMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.6 
    });

    const pageMaterial = new THREE.MeshStandardMaterial({ 
      map: pageTex, 
      roughness: 0.6 
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xeaeaea,
      roughness: 0.8
    });

    // 5.1 Spine Mesh
    const spineGeo = new THREE.BoxGeometry(bookThickness, bookH, bookThickness);
    const spine = new THREE.Mesh(spineGeo, spineMaterial);
    spine.position.set(-bookW / 2, 0, 0);
    bookGroup.add(spine);

    // 5.2 Back Cover
    const backGeo = new THREE.BoxGeometry(bookW, bookH, 0.02);
    const backCover = new THREE.Mesh(backGeo, backMaterial);
    // Pivot spine edge
    backCover.position.set(0, 0, -bookThickness / 2);
    bookGroup.add(backCover);

    // 5.3 Inner Page Block (Solid box representing inner pages)
    const pageBlockGeo = new THREE.BoxGeometry(bookW - 0.04, bookH - 0.04, bookThickness - 0.02);
    // Array of materials to map texture only to the top page
    const pageBlockMats = [
      edgeMaterial, // right
      edgeMaterial, // left
      edgeMaterial, // top
      edgeMaterial, // bottom
      pageMaterial, // front face (inside page)
      edgeMaterial  // back face
    ];
    const pageBlock = new THREE.Mesh(pageBlockGeo, pageBlockMats);
    pageBlock.position.set(0.01, 0, 0);
    bookGroup.add(pageBlock);

    // 5.4 Front Cover Group (Pivot is set at the spine edge)
    const frontCoverPivot = new THREE.Group();
    frontCoverPivot.position.set(-bookW / 2, 0, bookThickness / 2);
    bookGroup.add(frontCoverPivot);

    const frontGeo = new THREE.BoxGeometry(bookW, bookH, 0.02);
    // Align front cover to right of pivot
    const frontCover = new THREE.Mesh(frontGeo, coverMaterial);
    frontCover.position.set(bookW / 2, 0, 0);
    frontCoverPivot.add(frontCover);

    // Initial positioning
    bookGroup.rotation.set(0.2, -0.4, 0.05);

    // 6. Interactive Mouse Pointer Tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Normalized coordinates (-1 to 1)
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop
    let animationFrameId: number;
    let currentOpenAngle = 0;
    
    // Target open angle (0 is closed, Math.PI * 0.7 is fully open)
    let targetOpenAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smoothly interpolate rotations towards targets
      const targetRotateY = mouseX * 0.4 - 0.4;
      const targetRotateX = -mouseY * 0.3 + 0.2;

      bookGroup.rotation.y += (targetRotateY - bookGroup.rotation.y) * 0.06;
      bookGroup.rotation.x += (targetRotateX - bookGroup.rotation.x) * 0.06;

      // Handle front cover open animation on hover
      targetOpenAngle = isHovered ? -Math.PI * 0.6 : 0;
      currentOpenAngle += (targetOpenAngle - currentOpenAngle) * 0.08;
      frontCoverPivot.rotation.y = currentOpenAngle;

      renderer.render(scene, camera);
    };
    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 400;

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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose WebGL resources
      coverTex.dispose();
      pageTex.dispose();
      spineGeo.dispose();
      backGeo.dispose();
      pageBlockGeo.dispose();
      frontGeo.dispose();
      coverMaterial.dispose();
      backMaterial.dispose();
      spineMaterial.dispose();
      pageMaterial.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
    };
  }, [isHovered, theme]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[320px] md:h-[400px] cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating UI Helper Banner */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-foreground text-background border-2 border-border-color px-2.5 py-0.5 text-[10px] font-comic-title tracking-widest uppercase select-none pointer-events-none opacity-80 shadow-comic-md z-10">
        Hover to Open Book
      </div>
    </div>
  );
}
export default ComicBookScene;

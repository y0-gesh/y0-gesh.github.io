'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SpiderWebOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDropped, setIsDropped] = useState(false);

  // Restore scroll instantly once dropped, prevent scroll only while active
  useEffect(() => {
    if (isVisible && !isDropped) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, isDropped]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isDropped ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
      }}
      className={`flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden paper-texture bg-halftone  bg-white/10 backdrop-blur-xl ${
        isDropped ? 'pointer-events-none' : ''
      }`}
      onClick={() => {
        setIsDropped(true);
        // Completely remove overlay from DOM after drop animation finishes
        setTimeout(() => setIsVisible(false), 900);
      }}
    >
      {/* 3D-Like Web Container (Drops to Floor) */}
      <motion.div
        initial={{ y: 0, scale: 1, rotate: 0 }}
        animate={isDropped ? {
          y: '100vh',
          scale: 0.9,
          rotate: 8,
          opacity: 0,
        } : {}}
        transition={{ type: 'spring', stiffness: 120, damping: 20, duration: 0.8 }}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
      >
        {/* SVG Fullscreen Spider Web */}
        <svg
          viewBox="0 0 200 200"
          className="w-[120vw] h-[120vh] md:w-[100vw] md:h-[100vh] stroke-foreground fill-none stroke-[1.5px] opacity-75 dark:opacity-85"
        >
          {/* Radial Spokes from Center (100, 100) */}
          <line x1="100" y1="100" x2="0" y2="0" />
          <line x1="100" y1="100" x2="100" y2="0" />
          <line x1="100" y1="100" x2="200" y2="0" />
          <line x1="100" y1="100" x2="200" y2="100" />
          <line x1="100" y1="100" x2="200" y2="200" />
          <line x1="100" y1="100" x2="100" y2="200" />
          <line x1="100" y1="100" x2="0" y2="200" />
          <line x1="100" y1="100" x2="0" y2="100" />
          <line x1="100" y1="100" x2="50" y2="0" />
          <line x1="100" y1="100" x2="150" y2="0" />
          <line x1="100" y1="100" x2="200" y2="50" />
          <line x1="100" y1="100" x2="200" y2="150" />
          <line x1="100" y1="100" x2="150" y2="200" />
          <line x1="100" y1="100" x2="50" y2="200" />
          <line x1="100" y1="100" x2="0" y2="150" />
          <line x1="100" y1="100" x2="0" y2="50" />

          {/* Concentric sagging web rings */}
          {/* Ring 1 (Radius ~ 25) */}
          <path d="
            M 125 100 Q 123 110, 117 117 Q 110 123, 100 125 Q 90 123, 83 117 Q 77 110, 75 100 
            Q 77 90, 83 83 Q 90 77, 100 75 Q 110 77, 117 83 Q 123 90, 125 100 Z
          " />
          {/* Ring 2 (Radius ~ 50) */}
          <path d="
            M 150 100 Q 146 120, 135 135 Q 120 146, 100 150 Q 80 146, 65 135 Q 54 120, 50 100 
            Q 54 80, 65 65 Q 80 54, 100 50 Q 120 54, 135 65 Q 146 80, 150 100 Z
          " />
          {/* Ring 3 (Radius ~ 75) */}
          <path d="
            M 175 100 Q 170 130, 153 153 Q 130 170, 100 175 Q 70 170, 47 153 Q 30 130, 25 100 
            Q 30 70, 47 47 Q 70 30, 100 25 Q 130 30, 153 47 Q 170 70, 175 100 Z
          " />
          {/* Ring 4 (Radius ~ 100) */}
          <path d="
            M 200 100 Q 194 140, 170 170 Q 140 194, 100 200 Q 60 194, 30 170 Q 6 140, 0 100 
            Q 6 60, 30 30 Q 60 6, 100 0 Q 140 6, 170 30 Q 194 60, 200 100 Z
          " />
        </svg>
      </motion.div>

      {/* Centered Cover Title Panel (Drops to Floor) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={isDropped ? {
          y: '100vh',
          opacity: 0,
        } : {
          scale: 1,
          opacity: 1,
        }}
        transition={isDropped ? { duration: 0.5 } : { type: 'spring', stiffness: 200 }}
        className="z-10 bg-panel-bg border-4 border-border-color p-8 max-w-lg text-center shadow-comic relative transform -rotate-1 pointer-events-none"
      >
        {/* Top Red Label */}
        <div className="absolute -top-3.5 left-6 bg-primary text-white border-2 border-border-color px-3 py-0.5 text-xs font-comic-title uppercase tracking-widest shadow-comic-md">
          Special Collector's Issue
        </div>
        
        <h1 className="font-comic-header text-5xl sm:text-6xl uppercase tracking-tight text-stroke-black text-primary leading-none select-none mb-4 pt-2">
          YOGESH TANDAN
        </h1>
        
        <p className="font-comic-title text-xl uppercase tracking-wider text-secondary mb-6">
          Web Developer & Systems Engineer
        </p>
        
        <div className="bg-accent text-accent-foreground border-2 border-border-color px-4 py-2 text-xs font-bold uppercase tracking-widest animate-wiggle shadow-comic-md inline-block">
          Click to Clear the Web
        </div>
      </motion.div>
      
      {/* Hanging Spider Animation */}
      <motion.div
        animate={isDropped ? { y: '100vh', opacity: 0 } : { y: [0, 15, 0] }}
        transition={isDropped ? {} : { repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-0 left-12 w-[1px] bg-foreground/40 origin-top h-36 flex items-end justify-center pointer-events-none"
      >
        {/* SVG Spider */}
        <svg viewBox="0 0 20 20" className="w-6 h-6 fill-primary stroke-border-color stroke-[1.5px] translate-y-full">
          <circle cx="10" cy="8" r="3" />
          <circle cx="10" cy="13" r="4" />
          <path d="M 7 8 Q 5 6, 3 8 M 7 10 Q 4 9, 2 11 M 7 12 Q 4 12, 3 14 M 7 14 Q 5 15, 4 17" />
          <path d="M 13 8 Q 15 6, 17 8 M 13 10 Q 16 9, 18 11 M 13 12 Q 16 12, 17 14 M 13 14 Q 15 15, 16 17" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default SpiderWebOverlay;

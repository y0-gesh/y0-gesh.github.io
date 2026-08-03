'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebShot {
  id: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  rotation: number;
  scale: number;
  badge: string;
}

const SOUND_EFFECTS = ['THWIP!', 'THWIP!', 'THWIPP!', 'WHIP!', 'THWIP!'];

export function WebShooterListener() {
  const [shots, setShots] = useState<WebShot[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger if user is selecting text
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Wrist origin point: Bottom of screen, dynamically leaning toward click side
      const originX = screenWidth * 0.3 + (e.clientX / screenWidth) * (screenWidth * 0.4);
      const originY = screenHeight + 20;

      const newShot: WebShot = {
        id: Date.now() + Math.random(),
        targetX: e.clientX,
        targetY: e.clientY,
        originX,
        originY,
        rotation: Math.floor(Math.random() * 360),
        scale: 0.9 + Math.random() * 0.3,
        badge: SOUND_EFFECTS[Math.floor(Math.random() * SOUND_EFFECTS.length)],
      };

      setShots((prev) => [...prev.slice(-8), newShot]); // Keep max 8 active shots

      // Clean up shot after 1.5 seconds (1500ms)
      setTimeout(() => {
        setShots((prev) => prev.filter((s) => s.id !== newShot.id));
      }, 1500);
    };

    window.addEventListener('pointerdown', handleClick);
    return () => {
      window.removeEventListener('pointerdown', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none">
      {/* Fullscreen SVG for drawing the web strand lines from bottom wrist to target */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Subtle drop shadow for crisp comic contrast on light or dark bg */}
          <filter id="web-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.7" />
          </filter>
        </defs>

        <AnimatePresence>
          {shots.map((shot) => {
            // Control curve point for web strand arc
            const controlX = (shot.originX + shot.targetX) / 2 + (shot.targetX > shot.originX ? 25 : -25);
            const controlY = (shot.originY + shot.targetY) / 2 - 40;

            return (
              <g key={`line-${shot.id}`}>
                {/* Dark comic outline line behind main white strand */}
                <motion.path
                  d={`M ${shot.originX} ${shot.originY} Q ${controlX} ${controlY} ${shot.targetX} ${shot.targetY}`}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: [1, 1, 0.9, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    pathLength: { duration: 0.18, ease: 'easeOut' },
                    opacity: { duration: 1.5, times: [0, 0.1, 0.8, 1] },
                  }}
                />

                {/* Main Spider-Man Pure White Web Strand Line */}
                <motion.path
                  d={`M ${shot.originX} ${shot.originY} Q ${controlX} ${controlY} ${shot.targetX} ${shot.targetY}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: [1, 1, 0.95, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    pathLength: { duration: 0.18, ease: 'easeOut' },
                    opacity: { duration: 1.5, times: [0, 0.1, 0.8, 1] },
                  }}
                />

                {/* Secondary branching web tendril for extra web shooter realism */}
                {/* <motion.path
                  d={`M ${shot.originX} ${shot.originY} Q ${controlX - 15} ${controlY + 20} ${shot.targetX - 10} ${shot.targetY + 10}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                  initial={{ pathLength: 0, opacity: 0.8 }}
                  animate={{ pathLength: 1, opacity: [0.8, 0.8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    pathLength: { duration: 0.22, ease: 'easeOut', delay: 0.03 },
                    opacity: { duration: 1.5, times: [0, 0.1, 0.75, 1] },
                  }}
                /> */}
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Web Impact Net Splat at Target Pointer Position */}
      <AnimatePresence>
        {shots.map((shot) => (
          <div
            key={`impact-${shot.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: shot.targetX, top: shot.targetY }}
          >
            {/* Impact Web Net - Pure White Spider-Man Color with Comic Drop Shadow */}
            <motion.div
              initial={{ scale: 0.05, opacity: 0, rotate: shot.rotation }}
              animate={{
                scale: [0.05, shot.scale * 1.1, shot.scale],
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 1.5,
                times: [0, 0.12, 0.8, 1],
                ease: ['easeOut', 'easeOut', 'easeIn'],
              }}
              className="w-44 h-44 relative flex items-center justify-center"
            >
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full fill-none stroke-white stroke-[2.2px] opacity-100"
                style={{ filter: 'url(#web-shadow)' }}
              >
                {/* Center Stick Node */}
                <circle cx="80" cy="80" r="5" className="fill-white stroke-slate-900 stroke-[1.5px]" />
                <circle cx="80" cy="80" r="11" className="stroke-white stroke-[1.5px] fill-white/20" />

                {/* 12 Radial Anchor Spokes */}
                <line x1="80" y1="80" x2="80" y2="6" />
                <line x1="80" y1="80" x2="118" y2="16" />
                <line x1="80" y1="80" x2="148" y2="43" />
                <line x1="80" y1="80" x2="154" y2="80" />
                <line x1="80" y1="80" x2="148" y2="117" />
                <line x1="80" y1="80" x2="118" y2="144" />
                <line x1="80" y1="80" x2="80" y2="154" />
                <line x1="80" y1="80" x2="42" y2="144" />
                <line x1="80" y1="80" x2="12" y2="117" />
                <line x1="80" y1="80" x2="6" y2="80" />
                <line x1="80" y1="80" x2="12" y2="43" />
                <line x1="80" y1="80" x2="42" y2="16" />

                {/* Concentric Sagging Web Rings */}
                <path d="M 80 58 Q 95 62, 102 80 Q 95 98, 80 102 Q 65 98, 58 80 Q 65 62, 80 58 Z" />
                <path d="M 80 38 Q 110 44, 122 80 Q 110 116, 80 122 Q 50 116, 38 80 Q 50 44, 80 38 Z" />
                <path d="M 80 18 Q 124 26, 142 80 Q 124 134, 80 142 Q 36 134, 18 80 Q 36 26, 80 18 Z" />
                <path d="M 80 5 Q 133 14, 155 80 Q 133 146, 80 155 Q 27 146, 5 80 Q 27 14, 80 5 Z" />

                {/* Extra Web Droplets / Stick Points */}
                <circle cx="118" cy="16" r="3" className="fill-white" />
                <circle cx="148" cy="43" r="3" className="fill-white" />
                <circle cx="42" cy="144" r="3" className="fill-white" />
                <circle cx="12" cy="43" r="3" className="fill-white" />
                <circle cx="80" cy="154" r="3" className="fill-white" />
              </svg>
            </motion.div>

            {/* Spider-Man Comic "THWIP!" Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 20, y: -20, rotate: -15 }}
              animate={{
                scale: [0, 1.15, 1, 1, 0],
                opacity: [0, 1, 1, 1, 0],
                x: 28,
                y: -35,
                rotate: 6,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                times: [0, 0.15, 0.25, 0.8, 1],
                ease: 'easeOut',
              }}
              className="absolute top-0 left-0 bg-red-600 text-white font-comic-header text-sm tracking-widest px-3 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase select-none whitespace-nowrap z-20"
            >
              {shot.badge}
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default WebShooterListener;

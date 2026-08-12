'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const SpiderCanvas = dynamic(() => import('../three/SpiderCanvas'), {
  ssr: false,
});

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
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPulled, setIsPulled] = useState(false);
  const [bannerText, setBannerText] = useState<string | null>(null);

  // Keep ref for event listener to access live state
  const isEnabledRef = useRef(isEnabled);
  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  const handlePullToggle = () => {
    setIsPulled(true);
    setTimeout(() => setIsPulled(false), 300);

    const nextState = !isEnabled;
    setIsEnabled(nextState);
    setBannerText(nextState ? 'WEB SHOOTER ON' : 'WEB SHOOTER OFF');

    setTimeout(() => {
      setBannerText(null);
    }, 2000);
  };

  useEffect(() => {
    const handleClick = (e: PointerEvent) => {
      // Check if shooter is active
      if (!isEnabledRef.current) return;

      // Only fire for main/left click (button === 0). Ignore right-click (2), middle-click (1), back/forward (3,4), etc.
      if (e.button !== 0) return;

      // Don't trigger if user clicked on the hanging spider control
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.spider-toggle-container')) return;

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
        scale: 0.65 + Math.random() * 0.2,
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
    <>
      {/* Hanging Spider Pull Switch in Top Right Corner */}
      <div className="spider-toggle-container">
        <SpiderCanvas isEnabled={isEnabled} onPullToggle={handlePullToggle} />
      </div>

      {/* Center Screen Banner Notification (WEB SHOOTER ON / OFF) */}
      <AnimatePresence>
        {bannerText && (
          <div className="fixed inset-0 z-999999 pointer-events-none flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: -20 }}
              animate={{ scale: 1.1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className={`
                px-8 py-5 border-4 border-black shadow-[8px_8px_0px_#000000]
                font-comic-header text-3xl sm:text-5xl uppercase tracking-widest text-center select-none
                ${isEnabled ? 'bg-primary text-white' : 'bg-slate-800 text-slate-200'}
              `}
            >
              <span className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                {bannerText}
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-999999 overflow-hidden select-none">
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
                className="w-28 h-28 sm:w-32 sm:h-32 relative flex items-center justify-center"
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
                initial={{ scale: 0, opacity: 0, x: 15, y: -15, rotate: -15 }}
                animate={{
                  scale: [0, 1.1, 1, 1, 0],
                  opacity: [0, 1, 1, 1, 0],
                  x: 18,
                  y: -24,
                  rotate: 6,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.15, 0.25, 0.8, 1],
                  ease: 'easeOut',
                }}
                className="absolute top-0 left-0 bg-red-600 text-white font-comic-header text-xs tracking-widest px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] uppercase select-none whitespace-nowrap z-20"
              >
                {shot.badge}
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default WebShooterListener;

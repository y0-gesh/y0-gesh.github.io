'use client';

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SoundEffectBadgeProps {
  text: string;
  color?: 'red' | 'blue' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SoundEffectBadge({
  text,
  color = 'yellow',
  size = 'md',
  className = '',
}: SoundEffectBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const handleInteract = async () => {
    // Run an energetic squash-and-stretch pop animation sequence
    await controls.start({
      scale: [1, 1.25, 0.9, 1.1, 1],
      rotate: [0, -10, 8, -3, 0],
      transition: { duration: 0.5, ease: 'easeInOut' }
    });
  };

  // Color mappings
  const bgColors = {
    red: 'fill-primary',
    blue: 'fill-secondary',
    yellow: 'fill-accent',
    green: 'fill-emerald-500',
  };

  const textColors = {
    red: 'text-primary-foreground',
    blue: 'text-secondary-foreground',
    yellow: 'text-accent-foreground',
    green: 'text-white',
  };

  const sizes = {
    sm: 'w-24 h-24 text-sm',
    md: 'w-36 h-36 text-xl',
    lg: 'w-48 h-48 text-3xl',
  };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${sizes[size]} ${className}`}
      onHoverStart={() => {
        setIsHovered(true);
        handleInteract();
      }}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleInteract}
      animate={controls}
    >
      {/* 20-Point Starburst Splash Shape */}
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 w-full h-full drop-shadow-md filter ${bgColors[color]} stroke-border-color stroke-[2px]`}
      >
        <path d="M 50 10 L 58 28 L 78 22 L 72 40 L 90 45 L 75 56 L 85 75 L 67 70 L 68 90 L 50 80 L 32 90 L 33 70 L 15 75 L 25 56 L 10 45 L 28 40 L 22 22 L 42 28 Z" />
      </svg>

      {/* Retro Comic Text */}
      <span
        className={`
          z-10 font-comic-header uppercase tracking-wider
          ${textColors[color]}
          drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]
          rotate-[-8deg]
          transition-transform duration-200
          ${isHovered ? 'scale-110' : ''}
        `}
      >
        {text}
      </span>
    </motion.div>
  );
}
export default SoundEffectBadge;

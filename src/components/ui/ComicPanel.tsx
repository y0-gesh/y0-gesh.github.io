'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ComicPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: React.ReactNode;
  skewAngle?: 'left' | 'right' | 'none';
  hoverEffect?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ComicPanel({
  children,
  skewAngle = 'none',
  hoverEffect = true,
  className = '',
  onClick,
  ...props
}: ComicPanelProps) {
  // Map skew types
  const skewClass = 
    skewAngle === 'left' ? '-skew-x-2' : 
    skewAngle === 'right' ? 'skew-x-2' : 
    '';

  const motionProps = hoverEffect && !onClick ? {
    whileHover: { 
      x: -4, 
      y: -4, 
      transition: { type: 'spring' as const, stiffness: 300, damping: 15 } 
    }
  } : {};

  const clickableProps = onClick ? {
    whileHover: { x: -4, y: -4 },
    whileTap: { x: 2, y: 2 },
    onClick
  } : {};

  const wrapperProps = {
    ...motionProps,
    ...clickableProps
  };

  return (
    <motion.div
      {...wrapperProps}
      className={`
        bg-panel-bg text-foreground 
        border-3 border-border-color 
        shadow-comic
        relative overflow-hidden
        p-6 ${skewClass} ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      {...props}
    >
      {/* Corner Spider Web (removes generic stars) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-[0.09] dark:opacity-[0.14] stroke-foreground fill-none stroke-[2px] z-0"
      >
        <line x1="100" y1="0" x2="0" y2="0" />
        <line x1="100" y1="0" x2="0" y2="50" />
        <line x1="100" y1="0" x2="0" y2="100" />
        <line x1="100" y1="0" x2="50" y2="100" />
        <line x1="100" y1="0" x2="100" y2="100" />
        <path d="M 75 0 A 25 25 0 0 0 100 25 M 50 0 A 50 50 0 0 0 100 50 M 25 0 A 75 75 0 0 0 100 75 M 0 0 A 100 100 0 0 0 100 100" />
      </svg>

      {/* Unskew children if parent is skewed so text remains readable */}
      <div className={`relative z-10 ${skewAngle === 'left' ? 'skew-x-2' : skewAngle === 'right' ? '-skew-x-2' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}
export default ComicPanel;

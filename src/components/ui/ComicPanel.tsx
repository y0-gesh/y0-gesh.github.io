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
      {/* Unskew children if parent is skewed so text remains readable */}
      <div className={skewAngle === 'left' ? 'skew-x-2' : skewAngle === 'right' ? '-skew-x-2' : ''}>
        {children}
      </div>
    </motion.div>
  );
}
export default ComicPanel;

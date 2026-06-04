'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ComicButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ComicButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComicButtonProps) {
  // Styles for variations
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-red-600',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-blue-800',
    accent: 'bg-accent text-accent-foreground hover:bg-yellow-500',
    outline: 'bg-panel-bg text-foreground hover:bg-muted border-border-color',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-comic-title tracking-wider',
    md: 'px-5 py-2.5 text-sm font-comic-title tracking-wider',
    lg: 'px-8 py-3.5 text-lg font-comic-title tracking-widest',
  };

  return (
    <motion.button
      whileHover={{ x: -3, y: -3 }}
      whileTap={{ x: 2, y: 2 }}
      className={`
        relative inline-flex items-center justify-center
        border-3 border-border-color
        shadow-comic-md
        transition-colors duration-150
        uppercase font-semibold select-none cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
export default ComicButton;

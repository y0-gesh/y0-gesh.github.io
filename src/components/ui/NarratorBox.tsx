'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NarratorBoxProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function NarratorBox({
  children,
  title = 'MEANWHILE...',
  className = '',
}: NarratorBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`
        bg-accent text-accent-foreground
        border-3 border-border-color
        shadow-comic-md
        p-4 relative
        min-w-[150px]
        z-10
        ${className}
      `}
    >
      {/* Narrative header block */}
      {title && (
        <div className="absolute -top-3.5 left-4 bg-primary text-primary-foreground border-2 border-border-color px-2 py-0.5 text-xs font-comic-title tracking-wider uppercase">
          {title}
        </div>
      )}
      
      {/* Inner Content */}
      <div className="font-sans text-sm md:text-base font-semibold leading-relaxed pt-1">
        {children}
      </div>
    </motion.div>
  );
}
export default NarratorBox;

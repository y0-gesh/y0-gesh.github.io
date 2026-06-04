'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { 
      href: 'https://github.com/y0-gesh', 
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ), 
      label: 'GitHub' 
    },
    { 
      href: 'https://www.linkedin.com/in/yogesh-tandan/', 
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ), 
      label: 'LinkedIn' 
    },
    { 
      href: 'https://twitter.com', 
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ), 
      label: 'Twitter/X' 
    },
  ];

  return (
    <footer className="bg-muted text-muted-foreground border-t-4 border-border-color mt-auto relative overflow-hidden bg-halftone">
      
      {/* Dynamic comic margin divider at top */}
      <div className="h-2 bg-primary border-b-2 border-border-color w-full"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Logo and copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="bg-primary text-primary-foreground border-2 border-border-color px-2.5 py-0.5 font-comic-header text-xl uppercase tracking-tighter shadow-comic-md">
            Yogesh Tandan
          </div>
          <p className="text-xs font-semibold tracking-wide">
            © {new Date().getFullYear()} ALL RIGHTS RESERVED. PUBLISHED IN PORTFOLIO.
          </p>
        </div>

        {/* Social buttons */}
        <div className="flex items-center gap-4">
          {socials.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, rotate: (Math.random() - 0.5) * 15 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center border-2 border-border-color bg-panel-bg text-foreground shadow-comic-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        {/* Back to top bubble */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-border-color bg-accent text-accent-foreground font-comic-title uppercase text-sm tracking-wider shadow-comic-md cursor-pointer select-none"
        >
          Top <ArrowUp size={14} className="stroke-[3px]" />
        </motion.button>

      </div>
    </footer>
  );
}
export default Footer;

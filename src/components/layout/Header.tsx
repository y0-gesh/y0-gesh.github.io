'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Origin Story' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Newsroom' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b-3 border-border-color shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Marvel style logo */}
        <Link href="/" className="inline-flex items-center select-none group">
          <div className="bg-primary text-primary-foreground border-2 border-border-color px-3 py-1 font-comic-header text-2xl md:text-3xl tracking-tighter uppercase transform -rotate-1 group-hover:rotate-0 transition-transform duration-150 shadow-comic-md">
            Yogesh
          </div>
          <div className="bg-foreground text-background border-y-2 border-r-2 border-border-color px-3 py-1 font-comic-header text-2xl md:text-3xl tracking-tighter uppercase transform rotate-2 group-hover:rotate-0 transition-transform duration-150 shadow-comic-md -ml-1">
            Tandan
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center border-l-3 border-border-color h-full ml-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  h-full flex items-center px-6 font-comic-title text-lg tracking-wider uppercase
                  border-r-3 border-border-color select-none
                  transition-colors duration-150
                  ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-primary hover:text-primary-foreground'}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Theme Toggle & Mobile Burger) */}
        <div className="flex items-center gap-3 pl-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 border-2 border-border-color bg-panel-bg shadow-comic-md hover:bg-muted text-foreground cursor-pointer transition-transform active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Burger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border-2 border-border-color bg-panel-bg shadow-comic-md hover:bg-muted text-foreground cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-background border-b-3 border-border-color shadow-lg md:hidden p-4 bg-halftone"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      px-4 py-3 border-2 border-border-color font-comic-title text-lg tracking-wider uppercase shadow-comic-md
                      ${isActive ? 'bg-accent text-accent-foreground' : 'bg-panel-bg hover:bg-primary hover:text-primary-foreground'}
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export default Header;

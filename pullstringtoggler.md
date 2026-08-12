for reference purpose:

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../../context/ThemeContext";

const PullStringToggle = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const didTriggerRef = useRef(false);
  const animationObj = useRef({ y: 0 });

  const DEFAULT_LENGTH = 110; // hanging length
  const THRESHOLD = 55; // pull distance to trigger theme switch

  // Click handler (automated pull-and-release)
  const handleClick = () => {
    if (isDragging) return;

    // Reset animation object
    animationObj.current.y = 0;
    didTriggerRef.current = false;

    const tl = gsap.timeline();
    
    // Pull down
    tl.to(animationObj.current, {
      y: 65,
      duration: 0.22,
      ease: "power2.out",
      onUpdate: () => {
        setY(animationObj.current.y);
        if (animationObj.current.y >= THRESHOLD && !didTriggerRef.current) {
          didTriggerRef.current = true;
          setDarkMode(prev => !prev);
        }
      }
    })
    // Elastic release bounce
    .to(animationObj.current, {
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1.2, 0.4)",
      onUpdate: () => setY(animationObj.current.y)
    });
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    didTriggerRef.current = false;
    
    const clientY = "touches" in e 
      ? e.touches[0].clientY 
      : e.clientY;
      
    startYRef.current = clientY - y;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientY = "touches" in e 
        ? e.touches[0].clientY 
        : e.clientY;
        
      const deltaY = clientY - startYRef.current;
      
      // Constrain dragging downwards only, and cap maximum stretch
      const constrainedY = Math.max(0, Math.min(130, deltaY));
      currentYRef.current = constrainedY;
      setY(constrainedY);

      // Trigger switch if pulled past threshold
      if (constrainedY >= THRESHOLD && !didTriggerRef.current) {
        didTriggerRef.current = true;
        setDarkMode(prev => !prev);
        
        // Quick visual snap feedback when triggered
        gsap.to(animationObj.current, {
          y: constrainedY + 8,
          duration: 0.05,
          yoyo: true,
          repeat: 1
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      animationObj.current.y = currentYRef.current;

      // Spring back to rest using GSAP elastic easing
      gsap.to(animationObj.current, {
        y: 0,
        duration: 0.95,
        ease: "elastic.out(1.3, 0.35)",
        onUpdate: () => setY(animationObj.current.y)
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, y, setDarkMode]);

  const stringLength = DEFAULT_LENGTH + y;

  return (
    <div 
      className="fixed top-0 right-10 md:right-16 z-[9995] flex flex-col items-center pointer-events-none select-none"
      style={{ height: `${DEFAULT_LENGTH + 150}px` }}
    >
      <svg
        width="60"
        height={stringLength + 60}
        className="overflow-visible filter drop-shadow-md"
      >
        <defs>
          <radialGradient id="lightGlow" cx="50%" cy="0%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="15%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hanging glow bulb effect in light mode */}
        {!darkMode && (
          <ellipse
            cx="30"
            cy="2"
            rx="60"
            ry="45"
            fill="url(#lightGlow)"
            className="pointer-events-none mix-blend-screen opacity-90 transition-opacity duration-500"
          />
        )}

        {/* Support Plate / Base bracket at top */}
        <rect
          x="26"
          y="0"
          width="8"
          height="12"
          rx="2"
          fill={darkMode ? "#4b5563" : "#71717a"}
          className="transition-colors duration-500"
        />

        {/* The Hanging Switch Cord */}
        <path
          d={`M 30,10 L 30,${stringLength}`}
          fill="none"
          stroke={darkMode ? "#d1d5db" : "#3f3f46"}
          strokeWidth="2.5"
          strokeDasharray={darkMode ? "4,3" : "none"} // chalky dotted style in dark mode
          className="transition-colors duration-500"
        />

        {/* Knob Connector Ring */}
        <circle
          cx="30"
          cy={stringLength}
          r="4.5"
          fill="none"
          stroke={darkMode ? "#fda4af" : "#dc2626"}
          strokeWidth="2.5"
        />

        {/* Pull Knob Handle */}
        <g
          transform={`translate(30, ${stringLength + 10})`}
          className="pointer-events-auto cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onClick={handleClick}
        >
          {/* Invisible padding area to make grabbing easier on touch */}
          <circle cx="0" cy="12" r="28" fill="transparent" className="cursor-pointer" />

          {/* Styled wooden switch pull bead */}
          <path
            d="M -10,0 L 10,0 C 12,14 8,28 0,30 C -8,28 -12,14 -10,0 Z"
            fill={darkMode ? "#374151" : "#e4e4e7"}
            stroke={darkMode ? "#f3f4f6" : "#18181b"}
            strokeWidth="3.5"
            className="transition-colors duration-500 hover:scale-105 origin-top duration-150"
          />

          {/* Indicator label inside the switch */}
          <text
            x="0"
            y="20"
            textAnchor="middle"
            className="select-none pointer-events-none text-[12px] font-bold"
            fill={darkMode ? "#ffffff" : "#000000"}
          >
            {darkMode ? "0" : "1"}
          </text>
        </g>
      </svg>
      
      {/* Hand-drawn helper tooltip */}
      <span 
        className={`mt-1 font-cursive text-xs font-bold transition-all duration-700 pointer-events-none select-none ${
          isDragging ? "opacity-0 scale-90" : "opacity-75 scale-100 animate-pulse"
        } ${darkMode ? "text-text-subheading" : "text-text-subheading"}`}
      >
        Pull Switch
      </span>
    </div>
  );
};

export default PullStringToggle;
```
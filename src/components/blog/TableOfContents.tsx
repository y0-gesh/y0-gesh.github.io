'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HeadingItem } from '@/lib/content';
import { BookOpen, ListOrdered } from 'lucide-react';

interface TableOfContentsProps {
  headings: HeadingItem[];
  articleTitle?: string;
}

export function TableOfContents({ headings, articleTitle }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Filter out any heading matching the main article title to avoid redundant duplicate top entry
  const displayHeadings = useMemo(() => {
    if (!headings) return [];
    if (!articleTitle) return headings;
    const cleanTitle = articleTitle.toLowerCase().trim();
    return headings.filter(
      (h) => h.text.toLowerCase().trim() !== cleanTitle
    );
  }, [headings, articleTitle]);

  useEffect(() => {
    if (!displayHeadings || displayHeadings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-90px 0px -65% 0px',
        threshold: 0.1,
      }
    );

    displayHeadings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [displayHeadings]);

  if (!displayHeadings || displayHeadings.length === 0) {
    return (
      <div className="p-4 border-2 border-border-color bg-background text-xs text-muted-foreground font-semibold">
        No section headings detected in this article.
      </div>
    );
  }

  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -95;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="flex items-center justify-between border-b-2 border-border-color pb-2">
        <h3 className="font-comic-header text-2xl uppercase text-secondary flex items-center gap-2">
          <BookOpen size={20} /> Index Outline
        </h3>
        <span className="text-[10px] font-comic-title uppercase bg-accent text-accent-foreground px-2 py-0.5 border border-border-color shadow-comic-md">
          {displayHeadings.length} Sections
        </span>
      </div>

      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
        <ListOrdered size={13} className="text-primary" /> On This Page
      </p>

      {/* Heading links index container */}
      <nav className="flex flex-col gap-1.5 max-h-[42vh] md:max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin select-none font-sans">
        {displayHeadings.map((heading, index) => {
          const isActive = activeId === heading.id;
          
          // Indentation depending on heading depth (h1, h2, h3)
          const indentClass = 
            heading.level === 1 ? 'pl-2' : 
            heading.level === 2 ? 'pl-4' : 
            'pl-7';

          return (
            <a
              key={`${heading.id}-${index}`}
              href={`#${heading.id}`}
              onClick={(e) => handleHeadingClick(e, heading.id)}
              className={`
                block py-1.5 px-2.5 rounded-sm transition-all leading-normal text-xs md:text-[13px] font-sans font-medium break-words
                border-l-3
                ${indentClass}
                ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-comic-md transform translate-x-1'
                    : 'border-transparent text-muted-foreground hover:border-secondary hover:text-foreground hover:bg-muted/40'
                }
              `}
              title={heading.text}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

export default TableOfContents;

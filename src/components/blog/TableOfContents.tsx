'use client';

import React, { useState, useEffect } from 'react';
import { HeadingItem } from '@/lib/content';
import { BookOpen, ListOrdered } from 'lucide-react';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!headings || headings.length === 0) return;

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

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) {
    return (
      <div className="p-4 border-2 border-border-color bg-background text-xs text-muted-foreground font-semibold">
        No headings detected in this article.
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b-2 border-border-color pb-2">
        <h3 className="font-comic-header text-2xl uppercase text-secondary flex items-center gap-2">
          <BookOpen size={20} /> Index Outline
        </h3>
        <span className="text-[10px] font-comic-title uppercase bg-accent text-accent-foreground px-2 py-0.5 border border-border-color shadow-comic-md">
          {headings.length} Sections
        </span>
      </div>

      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
        <ListOrdered size={13} className="text-primary" /> On This Page
      </p>

      {/* Heading links index container */}
      <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1 text-xs font-semibold scrollbar-thin select-none">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          
          // Indentation depending on heading depth (h1, h2, h3)
          const indentClass = 
            heading.level === 1 ? 'pl-2' : 
            heading.level === 2 ? 'pl-5' : 
            'pl-8';

          return (
            <a
              key={`${heading.id}-${index}`}
              href={`#${heading.id}`}
              onClick={(e) => handleHeadingClick(e, heading.id)}
              className={`
                block py-1.5 px-2.5 rounded-sm transition-all leading-snug line-clamp-2
                border-l-3 text-[11px] md:text-xs
                ${indentClass}
                ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-comic-md transform translate-x-1'
                    : 'border-transparent text-muted-foreground hover:border-secondary hover:text-foreground hover:bg-muted/50'
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

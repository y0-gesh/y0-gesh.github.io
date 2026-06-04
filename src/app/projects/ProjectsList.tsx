'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/lib/content';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { ComicButton } from '@/components/ui/ComicButton';
import { Search } from 'lucide-react';

interface ProjectsListProps {
  initialProjects: ProjectData[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // Core list of filter tags
  const tags = useMemo(() => {
    const list = new Set<string>();
    initialProjects.forEach((p) => p.tags.forEach((t) => list.add(t.toUpperCase())));
    return ['ALL', ...Array.from(list)];
  }, [initialProjects]);

  // Search & Tag Filter Logic
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = 
        selectedTag === 'ALL' || 
        project.tags.some((t) => t.toUpperCase() === selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [initialProjects, searchQuery, selectedTag]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Search and Tabs Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-3 border-border-color bg-panel-bg p-4 shadow-comic-md">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-border-color p-2 pl-9 bg-background focus:outline-none focus:bg-accent font-semibold placeholder-muted-foreground/60 shadow-comic-md text-sm"
          />
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        </div>

        {/* Categories / Tags tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`
                px-3 py-1.5 border-2 border-border-color text-xs font-comic-title tracking-wider uppercase shadow-comic-md transition-transform duration-100 cursor-pointer active:scale-95
                ${selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-panel-bg hover:bg-muted text-foreground'}
              `}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

      {/* Grid listing */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <ComicPanel
              key={project.slug}
              skewAngle={idx % 2 === 0 ? 'left' : 'right'}
              className="flex flex-col h-full"
            >
              <div className="relative aspect-video w-full border-2 border-border-color mb-4 bg-muted flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-halftone"></div>
                <span className="font-comic-title text-xl text-muted-foreground z-10">
                  {project.title} Screen
                </span>
              </div>
              
              <div className="absolute top-4 left-4 bg-secondary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase">
                {project.date.split('-')[0]}
              </div>

              <h2 className="font-comic-header text-3xl uppercase mb-2">
                {project.title}
              </h2>
              
              <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-6 flex-grow line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 border border-border-color bg-muted text-[10px] uppercase font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              <Link href={`/projects/${project.slug}`} className="w-full">
                <ComicButton variant="primary" size="sm" className="w-full">
                  Access Dossier
                </ComicButton>
              </Link>
            </ComicPanel>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-3 border-dashed border-border-color bg-panel-bg shadow-comic-md">
          <p className="font-comic-header text-3xl text-primary uppercase">No Records Found</p>
          <p className="text-xs font-bold text-muted-foreground uppercase mt-2">Adjust your search parameters and scan again.</p>
        </div>
      )}

    </div>
  );
}
export default ProjectsList;

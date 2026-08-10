'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/lib/content';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { ComicButton } from '@/components/ui/ComicButton';
import { Search, ExternalLink, ArrowRight } from 'lucide-react';

interface ProjectsListProps {
  initialProjects: ProjectData[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 6;

  // Core list of filter tags
  const tags = useMemo(() => {
    const list = new Set<string>();
    initialProjects.forEach((p) => p.tags.forEach((t) => list.add(t.toUpperCase())));
    return ['ALL', ...Array.from(list)];
  }, [initialProjects]);

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Search and Tabs Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-3 border-border-color bg-panel-bg p-4 shadow-comic-md">
        
        {/* Search input */}
        <div className="relative w-full md:max-w-1/4">
          <input
            type="text"
            placeholder="Search database..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full border-2 border-border-color p-2 pl-9 bg-background focus:outline-none focus:bg-accent font-semibold placeholder-muted-foreground/60 shadow-comic-md text-sm"
          />
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        </div>

        {/* Categories / Tags tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
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
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProjects.map((project, idx) => (
              <ComicPanel
                key={project.slug}
                skewAngle={idx % 2 === 0 ? 'left' : 'right'}
                className="flex flex-col h-full"
              >
                <div className="relative aspect-video w-full border-2 border-border-color mb-4 bg-muted flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-halftone"></div>
                  {project.slug === 'think-canvas' && (
                    <img src="/images/think-canvas.png" alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {project.slug === 'node-editor-flow' && (
                    <img src="/images/node-flow.png" alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {project.slug === 'cicd-infrastructure-automation' && (
                    <img src="/images/devops-journey.png" alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {!['think-canvas', 'node-editor-flow', 'cicd-infrastructure-automation'].includes(project.slug) && (
                    <span className="font-comic-title text-xl text-muted-foreground z-10">
                      {project.title}
                    </span>
                  )}
                </div>
                
                <div className="absolute top-4 left-4 bg-secondary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase">
                  {project.date ? project.date.split('-')[0] : 'PROJECT'}
                </div>

                <h2 className="font-comic-header text-2xl uppercase mb-2">
                  {project.title}
                </h2>
                
                <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-4 flex-grow line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 border border-border-color bg-muted text-[10px] uppercase font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: Live Demo + GitHub + Case Study */}
                <div className="flex flex-col gap-2 mt-auto pt-2">
                  
                  <div className="flex gap-2 w-full">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <ComicButton variant="accent" size="sm" className="w-full text-[11px] py-1.5 px-2 gap-1">
                          Demo <ExternalLink size={12} className="stroke-[3px]" />
                        </ComicButton>
                      </a>
                    ) : null}

                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <ComicButton variant="outline" size="sm" className="w-full text-[11px] py-1.5 px-2 gap-1">
                          GitHub <svg className="w-3 h-3 fill-current inline-block" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </ComicButton>
                      </a>
                    ) : null}
                  </div>

                  <Link href={`/projects/${project.slug}`} className="w-full">
                    <ComicButton variant="primary" size="sm" className="w-full text-xs py-2 gap-1">
                      View Case Study <ArrowRight size={14} className="stroke-[3px]" />
                    </ComicButton>
                  </Link>

                </div>
              </ComicPanel>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t-3 border-border-color">
              <ComicButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                ← Previous
              </ComicButton>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`
                      w-9 h-9 border-2 border-border-color text-xs font-comic-title font-bold shadow-comic-sm transition-transform active:scale-95 cursor-pointer
                      ${currentPage === pageNum ? 'bg-primary text-white' : 'bg-panel-bg hover:bg-muted text-foreground'}
                    `}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <ComicButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Next →
              </ComicButton>
            </div>
          )}

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

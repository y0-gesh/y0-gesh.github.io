import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { ComicButton } from '@/components/ui/ComicButton';
import { NarratorBox } from '@/components/ui/NarratorBox';
import { getProjectBySlug, getAllProjects } from '@/lib/content';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar } from 'lucide-react';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Next / Prev Project Navigation logic
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-12 bg-halftone">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          
          {/* Back button */}
          <div className="mb-8">
            <Link href="/projects">
              <ComicButton variant="outline" size="sm">
                <ArrowLeft size={14} className="inline-block mr-1 stroke-[3px]" /> Back to Database
              </ComicButton>
            </Link>
          </div>

          {/* Project Title Block */}
          <div className="relative mb-12">
            <div className="absolute -top-3.5 left-4 bg-primary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase tracking-widest z-10 shadow-comic-md">
              Mission Report
            </div>
            <h1 className="font-comic-header text-5xl sm:text-6xl uppercase border-3 border-border-color bg-panel-bg p-6 pt-8 shadow-comic">
              {project.title}
            </h1>
          </div>

          {/* Grid Layout (Main Content + Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Left Column: Markdown content */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <ComicPanel skewAngle="none" className="bg-panel-bg p-8">
                {/* HTML content rendered from Markdown */}
                <div 
                  className="
                    font-sans text-sm md:text-base leading-relaxed font-semibold text-foreground
                    space-y-6
                    [&>h2]:font-comic-header [&>h2]:text-3xl [&>h2]:uppercase [&>h2]:text-secondary [&>h2]:mt-6 [&>h2]:mb-2
                    [&>h3]:font-comic-title [&>h3]:text-xl [&>h3]:uppercase [&>h3]:text-foreground [&>h3]:mt-4 [&>h3]:mb-1
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5
                    [&>pre]:border-2 [&>pre]:border-border-color [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:shadow-comic-md
                    [&>code]:font-mono [&>code]:text-xs [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:border [&>code]:border-border-color
                    [&>pre>code]:border-none [&>pre>code]:p-0
                  "
                  dangerouslySetInnerHTML={{ __html: project.contentHtml }}
                />
              </ComicPanel>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Quick Info Box */}
              <ComicPanel skewAngle="none" className="bg-panel-bg border-3">
                <h3 className="font-comic-header text-2xl uppercase border-b-2 border-border-color pb-2 mb-4 text-primary">
                  Dossier Summary
                </h3>
                
                <div className="flex flex-col gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} /> <span>Date: {project.date}</span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground block mb-2">Capabilities Deployed:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 border border-border-color bg-muted text-[10px] uppercase font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t-2 border-border-color">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ComicButton variant="primary" size="sm" className="w-full">
                          Live Deploy <ExternalLink size={14} className="inline-block ml-1 stroke-[3px]" />
                        </ComicButton>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <ComicButton variant="outline" size="sm" className="w-full">
                          Source Repository <svg className="w-3.5 h-3.5 fill-current inline-block ml-1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </ComicButton>
                      </a>
                    )}
                  </div>

                </div>
              </ComicPanel>

              {/* Classic Narrative Warning */}
              <NarratorBox title="SYSTEM ADVISORY" className="bg-accent text-accent-foreground">
                “This capsule holds active build parameters. Coordinates are verified, operations are verified, repositories remain under active surveillance.”
              </NarratorBox>

            </div>

          </div>

          {/* Next / Prev Project Navigation Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t-3 border-border-color pt-12">
            
            {/* Prev project */}
            {prevProject ? (
              <Link href={`/projects/${prevProject.slug}`} className="group">
                <ComicPanel skewAngle="left" className="h-full hover:bg-muted/30">
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">← Previous Mission</span>
                  <span className="font-comic-header text-xl uppercase text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {prevProject.title}
                  </span>
                </ComicPanel>
              </Link>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            {/* Next project */}
            {nextProject ? (
              <Link href={`/projects/${nextProject.slug}`} className="group">
                <ComicPanel skewAngle="right" className="h-full text-right hover:bg-muted/30">
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">Next Mission →</span>
                  <span className="font-comic-header text-xl uppercase text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {nextProject.title}
                  </span>
                </ComicPanel>
              </Link>
            ) : (
              <div></div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

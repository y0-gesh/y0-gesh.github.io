import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllProjects } from '@/lib/content';
import { ProjectsList } from './ProjectsList';

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-12 bg-halftone">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header Banners */}
          <div className="text-center mb-12">
            <h1 className="font-comic-header text-6xl uppercase text-primary mb-2 text-stroke-black">
              Project Database
            </h1>
            <p className="font-bold text-muted-foreground uppercase">
              Classified Project Portfolios and Mission Log Records
            </p>
          </div>

          {/* Interactive Client Listing */}
          <ProjectsList initialProjects={projects} />

        </div>
      </main>

      <Footer />
    </div>
  );
}

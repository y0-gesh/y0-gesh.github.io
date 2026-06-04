import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllBlogPosts } from '@/lib/content';
import { BlogList } from './BlogList';

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-12 bg-halftone">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Newspaper Masthead Banner */}
          <div className="border-y-4 border-double border-border-color py-6 mb-12 text-center bg-panel-bg shadow-comic-md select-none">
            <h1 className="font-comic-header text-6xl md:text-8xl tracking-widest uppercase text-foreground leading-none">
              Daily Planet Newsroom
            </h1>
            
            <div className="flex items-center justify-between border-t-2 border-border-color mt-4 pt-2 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest px-4">
              <span>VOL. XXVI... NO. 142</span>
              <span className="hidden sm:inline">PUBLISHED DIRECTLY FROM THE SOURCE CODE</span>
              <span>PRICE: FREE EDITION</span>
            </div>
          </div>

          {/* Render Interactive Listing */}
          <BlogList initialPosts={posts} />

        </div>
      </main>

      <Footer />
    </div>
  );
}

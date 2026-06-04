'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogPostData } from '@/lib/content';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { ComicButton } from '@/components/ui/ComicButton';
import { Search, Calendar, Clock } from 'lucide-react';

interface BlogListProps {
  initialPosts: BlogPostData[];
}

export function BlogList({ initialPosts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Memoize all categories
  const categories = useMemo(() => {
    const list = new Set<string>();
    initialPosts.forEach((p) => list.add(p.category.toUpperCase()));
    return ['ALL', ...Array.from(list)];
  }, [initialPosts]);

  // Filtering Logic
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'ALL' || 
        post.category.toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  // Divide posts into a featured post (newest) and list of remaining posts
  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Search and Tabs Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-3 border-border-color bg-panel-bg p-4 shadow-comic-md">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search chronicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-border-color p-2 pl-9 bg-background focus:outline-none focus:bg-accent font-semibold placeholder-muted-foreground/60 shadow-comic-md text-sm"
          />
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3 py-1.5 border-2 border-border-color text-xs font-comic-title tracking-wider uppercase shadow-comic-md transition-transform duration-100 cursor-pointer active:scale-95
                ${selectedCategory === cat ? 'bg-secondary text-secondary-foreground' : 'bg-panel-bg hover:bg-muted text-foreground'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Retro Newspaper Layout Grid */}
      {filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-10">
          
          {/* 1. Featured Big Story Column (only if no category has deleted it) */}
          {featuredPost && (
            <div className="border-3 border-border-color bg-panel-bg shadow-comic p-6 relative overflow-hidden bg-halftone">
              <div className="absolute top-4 left-4 bg-primary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase">
                Featured Editorial
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
                
                {/* Visual block */}
                <div className="lg:col-span-5 aspect-video w-full border-2 border-border-color bg-muted flex items-center justify-center">
                  <span className="font-comic-title text-2xl text-muted-foreground">Illustration Block</span>
                </div>

                {/* Text Block */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {featuredPost.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {featuredPost.readTime}</span>
                  </div>

                  <h2 className="font-comic-header text-4xl sm:text-5xl uppercase hover:text-primary transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed line-clamp-3">
                    {featuredPost.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] font-comic-title uppercase bg-accent text-accent-foreground border border-border-color px-2.5 py-0.5">
                      {featuredPost.category}
                    </span>
                    
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <ComicButton variant="primary" size="sm">
                        Read Story
                      </ComicButton>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. Smaller multi-column entries list */}
          {listPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {listPosts.map((post) => (
                <ComicPanel key={post.slug} className="flex flex-col h-full bg-panel-bg hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>

                  <h3 className="font-comic-header text-2xl uppercase mb-2 hover:text-secondary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-4 flex-grow line-clamp-3">
                    {post.description}
                  </p>

                  <div className="flex justify-between items-center mt-4 border-t-2 border-border-color pt-4">
                    <span className="text-[10px] font-comic-title uppercase bg-accent text-accent-foreground border border-border-color px-2 py-0.5">
                      {post.category}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-primary hover:underline uppercase">
                      Read Chronicle →
                    </Link>
                  </div>
                </ComicPanel>
              ))}
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
export default BlogList;

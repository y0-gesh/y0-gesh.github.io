import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { ComicButton } from '@/components/ui/ComicButton';
import { NarratorBox } from '@/components/ui/NarratorBox';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/content';
import { ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Next / Prev Post Logic
  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      
      {/* Scroll Reading Progress Bar - fixed right below header or at very top */}
      <div 
        id="reading-progress" 
        className="fixed top-0 left-0 h-1.5 bg-primary z-[999] w-full transform scale-x-0 origin-left"
        aria-hidden="true"
      ></div>

      <Header />

      <main className="flex-grow py-12 bg-halftone">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          
          {/* Back button */}
          <div className="mb-8">
            <Link href="/blog">
              <ComicButton variant="outline" size="sm">
                <ArrowLeft size={14} className="inline-block mr-1 stroke-[3px]" /> Back to Archives
              </ComicButton>
            </Link>
          </div>

          {/* Masthead Headline */}
          <div className="border-3 border-border-color bg-panel-bg p-6 md:p-8 shadow-comic mb-12 relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase z-10 shadow-comic-md">
              {post.category}
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-3 mt-6">
              <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
            </div>

            <h1 className="font-comic-header text-4xl sm:text-6xl uppercase leading-tight">
              {post.title}
            </h1>
          </div>

          {/* Grid: Article Body + Table of Contents Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Left Column: Markdown content */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <ComicPanel skewAngle="none" className="bg-panel-bg p-8">
                <div 
                  className="
                    font-sans text-sm md:text-base leading-relaxed font-semibold text-foreground
                    space-y-6
                    [&>h2]:font-comic-header [&>h2]:text-3xl [&>h2]:uppercase [&>h2]:text-secondary [&>h2]:mt-8 [&>h2]:mb-2 [&>h2]:border-b-2 [&>h2]:border-border-color [&>h2]:pb-1
                    [&>h3]:font-comic-title [&>h3]:text-xl [&>h3]:uppercase [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-1
                    [&>p>strong]:text-primary [&>p>strong]:font-extrabold
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5
                    [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-muted [&>blockquote]:px-4 [&>blockquote]:py-2 [&>blockquote]:font-semibold [&>blockquote]:italic
                    [&>pre]:border-2 [&>pre]:border-border-color [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:shadow-comic-md
                    [&>code]:font-mono [&>code]:text-xs [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:border [&>code]:border-border-color
                    [&>pre>code]:border-none [&>pre>code]:p-0
                  "
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              </ComicPanel>
            </div>

            {/* Right Column: Sidebar Table of Contents */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              <ComicPanel skewAngle="none" className="bg-panel-bg border-3 sticky top-24">
                <h3 className="font-comic-header text-2xl uppercase border-b-2 border-border-color pb-2 mb-4 text-secondary flex items-center gap-2">
                  <BookOpen size={20} /> Index Outline
                </h3>
                
                {/* Yellow Narrative details card */}
                <NarratorBox title="COMIC BULLETIN" className="mb-4">
                  “Follow details sequentially. Ensure variables are loaded before runtime triggers. Code responsibly.”
                </NarratorBox>

                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  Scroll downwards to access chronological article notes. Use the progress bar at the top to track reading completions.
                </p>
              </ComicPanel>

            </div>

          </div>

          {/* Navigation links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t-3 border-border-color pt-12">
            
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group">
                <ComicPanel skewAngle="left" className="h-full hover:bg-muted/30">
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">← Previous Story</span>
                  <span className="font-comic-header text-xl uppercase text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {prevPost.title}
                  </span>
                </ComicPanel>
              </Link>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="group">
                <ComicPanel skewAngle="right" className="h-full text-right hover:bg-muted/30">
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">Next Story →</span>
                  <span className="font-comic-header text-xl uppercase text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {nextPost.title}
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

      {/* Fallback Scroll listener JS for browsers that don't support native CSS timeline */}
      <script dangerouslySetInnerHTML={{ __html: `
        if (!CSS.supports('animation-timeline', 'scroll()')) {
          const progress = document.querySelector('#reading-progress');
          if (progress) {
            window.addEventListener('scroll', () => {
              const scrollable = document.documentElement.scrollHeight - window.innerHeight;
              const scrolled = window.scrollY;
              const progressPercentage = scrollable > 0 ? (scrolled / scrollable) : 0;
              progress.style.transform = 'scaleX(' + progressPercentage + ')';
            });
          }
        }
      `}} />
    </div>
  );
}

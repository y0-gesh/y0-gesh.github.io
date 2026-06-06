import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { NarratorBox } from '@/components/ui/NarratorBox';
import { SoundEffectBadge } from '@/components/ui/SoundEffectBadge';
import { ComicButton } from '@/components/ui/ComicButton';
import { getAllProjects, getAllBlogPosts } from '@/lib/content';
import { ArrowRight, Mail, Terminal, Cpu } from 'lucide-react';
import { HeroThreeCanvas } from '@/components/three/HeroThreeCanvas';
import { ContactForm } from '@/components/sections/ContactForm';
import { SpiderWebOverlay } from '@/components/ui/SpiderWebOverlay';

export default function HomePage() {
  const projects = getAllProjects().slice(0, 3); // Get top 3 projects
  const blogPosts = getAllBlogPosts().slice(0, 3); // Get top 3 blog posts

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SpiderWebOverlay />
      <Header />

      <main className="grow">
        {/* HERO SECTION */}
        <section className="relative py-12 md:py-24 border-b-4 border-border-color bg-halftone overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              
              <div className="relative">
                {/* Floating "POW!" splash */}
                <div className="absolute -top-12 -left-12 hidden sm:block">
                  <SoundEffectBadge text="HELLO!" color="yellow" size="sm" className="transform -rotate-12" />
                </div>
                
                <h1 className="font-comic-header text-6xl sm:text-8xl tracking-tight uppercase leading-none text-stroke-black text-primary select-none pt-4">
                  YOGESH TANDAN
                </h1>
              </div>

              {/* Narrator block */}
              <NarratorBox title="THE STORY BEGINS..." className="w-full">
                “A full-stack web engineer from Raipur, building visual react canvases, node graph editors, and microservice marketplaces. Operating under the ultimate directive: &apos;With great power comes great clean code.&apos;...”
              </NarratorBox>

              {/* Sub-capabilities list */}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-border-color bg-panel-bg font-semibold text-xs uppercase shadow-comic-md">
                  <Terminal size={14} className="text-primary" /> Full Stack Developer
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-border-color bg-panel-bg font-semibold text-xs uppercase shadow-comic-md">
                  <Cpu size={14} className="text-secondary" /> Node Editor Developer
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-border-color bg-panel-bg font-semibold text-xs uppercase shadow-comic-md">
                  <span className="text-accent">🕸️</span> React Flow Specialist
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/projects">
                  <ComicButton variant="primary" size="md">
                    Explore Gallery <ArrowRight size={16} className="inline-block ml-1 stroke-[3px]" />
                  </ComicButton>
                </Link>
                <Link href="/about">
                  <ComicButton variant="outline" size="md">
                    Read Origin Story
                  </ComicButton>
                </Link>
              </div>

            </div>

            {/* Right Three.js Column */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="w-full max-w-[400px] border-4 border-border-color bg-panel-bg shadow-comic p-4 relative transform rotate-1">
                {/* Yellow caption title */}
                <div className="absolute -top-3 left-4 bg-accent text-accent-foreground border-2 border-border-color px-2 py-0.5 text-xs font-comic-title uppercase">
                  Amazing Fantasy #15
                </div>
                <HeroThreeCanvas />
              </div>
            </div>

          </div>
        </section>

        {/* ORIGIN STORY BRIEF */}
        <section className="py-16 bg-muted border-b-4 border-border-color">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 flex justify-center">
                <SoundEffectBadge text="BOOM!" color="red" size="md" className="transform rotate-6" />
              </div>

              <div className="md:col-span-8 flex flex-col gap-4">
                <h2 className="font-comic-header text-4xl uppercase text-secondary">
                  Who is this engineer?
                </h2>
                <ComicPanel skewAngle="left">
                  <p className="font-semibold text-sm md:text-base leading-relaxed">
                    Yogesh Tandan is a software engineering student at Government Engineering College, Raipur. Specializing in Next.js, React Flow, and Docker architectures, he develops visual workspace tools, location-based service marketplaces, and automated deployment integrations.
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Link href="/about">
                      <ComicButton variant="accent" size="sm">
                        Read Full Journey
                      </ComicButton>
                    </Link>
                  </div>
                </ComicPanel>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section className="py-20 bg-background border-b-4 border-border-color">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-comic-header text-5xl uppercase tracking-wider text-primary">
                S.H.I.E.L.D. Mission Archive
              </h2>
              <Link href="/projects" className="hidden sm:block">
                <ComicButton variant="outline" size="sm">
                  View Database
                </ComicButton>
              </Link>
            </div>

            {/* Skewed panels grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((proj, idx) => (
                <ComicPanel
                  key={proj.slug}
                  skewAngle={idx % 2 === 0 ? 'right' : 'left'}
                  className="flex flex-col h-full"
                >
                  <div className="relative aspect-video w-full border-2 border-border-color mb-4 bg-muted flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-halftone"></div>
                    {/* Render actual Marvel/comic illustration if available */}
                    {proj.slug === 'think-canvas' && (
                      <img src="/images/think-canvas.png" alt={proj.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {proj.slug === 'node-editor-flow' && (
                      <img src="/images/node-flow.png" alt={proj.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {proj.slug === 'devops-cicd-journey' && (
                      <img src="/images/devops-journey.png" alt={proj.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {/* Fallback if not one of these slugs */}
                    {!['think-canvas', 'node-editor-flow', 'devops-cicd-journey'].includes(proj.slug) && (
                      <span className="font-comic-title text-xl text-muted-foreground z-10">
                        {proj.title} Screen
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-white border-2 border-border-color px-2 py-0.5 text-xs font-comic-title uppercase">
                    Mission {idx + 1}
                  </div>
                  <h3 className="font-comic-header text-2xl uppercase mb-2 text-foreground">
                    {proj.title}
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-4 flex-grow line-clamp-3">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 border border-border-color bg-muted text-[10px] uppercase font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/projects/${proj.slug}`} className="w-full">
                    <ComicButton variant="secondary" size="sm" className="w-full">
                      Access File
                    </ComicButton>
                  </Link>
                </ComicPanel>
              ))}
            </div>

          </div>
        </section>

        {/* NEWSROOM / RECENT BLOGS */}
        <section className="py-20 bg-muted border-b-4 border-border-color bg-halftone">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-comic-header text-5xl uppercase tracking-wider text-secondary">
                Daily Planet Newsroom
              </h2>
              <Link href="/blog" className="hidden sm:block">
                <ComicButton variant="outline" size="sm">
                  View Archives
                </ComicButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, idx) => (
                <ComicPanel key={post.slug} className="flex flex-col h-full hover:rotate-1 transition-transform">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground mb-2">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-comic-header text-2xl uppercase mb-2 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-4 flex-grow line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] font-comic-title uppercase bg-accent text-accent-foreground border border-border-color px-2 py-0.5">
                      {post.category}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-primary hover:underline uppercase inline-flex items-center gap-1">
                      Read Article →
                    </Link>
                  </div>
                </ComicPanel>
              ))}
            </div>

          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-20 bg-background relative overflow-hidden" id='message-section'>
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="font-comic-header text-5xl uppercase text-primary mb-2 text-stroke-black">
                Send a Message!
              </h2>
              <p className="font-bold text-muted-foreground">
                HAVE A MISSION FOR YOGESH? COMPOSE YOUR DIRECTIVES BELOW.
              </p>
            </div>

            <ContactForm />

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

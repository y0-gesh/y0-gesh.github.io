import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { NarratorBox } from '@/components/ui/NarratorBox';
import { SoundEffectBadge } from '@/components/ui/SoundEffectBadge';
import { ComicButton } from '@/components/ui/ComicButton';
import { getAllProjects, getAllBlogPosts } from '@/lib/content';
import { ArrowRight, Terminal, Cpu, Download, Server, ShieldCheck, ExternalLink } from 'lucide-react';
import { HeroThreeCanvas } from '@/components/three/HeroThreeCanvas';
import { ContactForm } from '@/components/sections/ContactForm';
import { SpiderWebOverlay } from '@/components/ui/SpiderWebOverlay';

export default function HomePage() {
  const projects = getAllProjects().slice(0, 4); // Top featured projects
  const blogPosts = getAllBlogPosts().slice(0, 3); // Top 3 blog posts

  const cloudHighlights = [
    { name: 'AWS Cloud Services', desc: 'EC2, ECS Fargate, API Gateway, WAF, Cognito, DynamoDB' },
    { name: 'Terraform IaC', desc: 'Declarative VPCs, security groups, & container clusters' },
    { name: 'OIDC Security', desc: 'GitHub-to-AWS Auth (zero static IAM credentials stored)' },
    { name: 'CI/CD Pipelines', desc: 'GitHub Actions test automation & multi-stage Docker builds' },
  ];

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
              <NarratorBox title="OPERATIONAL DOSSIER" className="w-full">
                “Software Engineer at eigenstudio and former developer at Avkalan Labs. Building production-grade multi-tenant SaaS interfaces, optimizing 3D rendering engines (~60% speedup), and authoring AWS/Terraform CI/CD pipelines.”
              </NarratorBox>

              {/* Sub-capabilities list */}
              <div className="flex flex-wrap gap-2.5">
                <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-border-color bg-panel-bg font-semibold text-xs uppercase shadow-comic-md">
                  <Terminal size={14} className="text-primary" /> Software Engineer @ eigenstudio
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-border-color bg-panel-bg font-semibold text-xs uppercase shadow-comic-md">
                  <Server size={14} className="text-secondary" /> AWS & Terraform DevOps
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-border-color bg-panel-bg font-semibold text-xs uppercase shadow-comic-md">
                  <Cpu size={14} className="text-accent-foreground" /> Next.js & Multi-Tenant SaaS
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="/resume/yogesh.pdf" target="_blank" download="Yogesh_Tandan_Resume.pdf">
                  <ComicButton variant="accent" size="md" className="gap-2">
                    <Download size={16} className="stroke-[3px]" /> Download Resume
                  </ComicButton>
                </a>
                <Link href="/projects">
                  <ComicButton variant="primary" size="md">
                    Explore Missions <ArrowRight size={16} className="inline-block ml-1 stroke-[3px]" />
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
                  Amazing Engineering #15
                </div>
                <HeroThreeCanvas />
              </div>
            </div>

          </div>
        </section>

        {/* ORIGIN BRIEF & METRICS */}
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
                  <p className="font-semibold text-sm md:text-base leading-relaxed text-foreground">
                    Yogesh Tandan holds a <strong>B.Tech in Electronics & Telecommunication Engineering</strong> from Government Engineering College, Raipur (2021–2025). Currently Software Engineer at <strong>eigenstudio</strong>, he builds multi-tenant SaaS frontend modules, integrates Cognito MFA, and authors Terraform AWS deployment workflows.
                  </p>
                  
                  {/* Quick Highlight Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-border-color/20">
                    <div className="bg-background border border-border-color p-2 text-center">
                      <span className="font-comic-header text-xl text-primary block">~60% Boost</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Electron 3D Renderer</span>
                    </div>
                    <div className="bg-background border border-border-color p-2 text-center">
                      <span className="font-comic-header text-xl text-secondary block">Zero Static Keys</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">OIDC GitHub to AWS</span>
                    </div>
                    <div className="bg-background border border-border-color p-2 text-center">
                      <span className="font-comic-header text-xl text-amber-600 block">B.Tech E&TC</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">GEC Raipur &apos;25</span>
                    </div>
                  </div>

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

        {/* VISUAL INFRASTRUCTURE & CLOUD PANEL */}
        <section className="py-16 bg-panel-bg border-b-4 border-border-color bg-halftone">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <span className="text-xs font-comic-title text-primary uppercase tracking-widest block">Operational Tech Stack</span>
                <h2 className="font-comic-header text-4xl sm:text-5xl uppercase text-foreground">
                  Cloud & Infrastructure Operations
                </h2>
              </div>
              <a href="/resume/yogesh.pdf" target="_blank" download="Yogesh_Tandan_Resume.pdf">
                <ComicButton variant="accent" size="sm" className="gap-1.5">
                  <Download size={14} className="stroke-[3px]" /> Download Resume PDF
                </ComicButton>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cloudHighlights.map((item) => (
                <div 
                  key={item.name}
                  className="border-3 border-border-color bg-background p-5 shadow-comic-md hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="text-secondary" size={20} />
                    <span className="text-[10px] font-comic-title uppercase bg-primary text-white border border-border-color px-2 py-0.5">
                      Verified
                    </span>
                  </div>
                  <h3 className="font-comic-title text-lg uppercase text-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS / MISSIONS */}
        <section className="py-20 bg-background border-b-4 border-border-color">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-comic-title text-primary uppercase tracking-widest block">Featured Case Studies</span>
                <h2 className="font-comic-header text-5xl uppercase tracking-wider text-primary">
                  S.H.I.E.L.D. Mission Archive
                </h2>
              </div>
              <Link href="/projects" className="hidden sm:block">
                <ComicButton variant="outline" size="sm">
                  View Full Database
                </ComicButton>
              </Link>
            </div>

            {/* Skewed panels grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((proj, idx) => (
                <ComicPanel
                  key={proj.slug}
                  skewAngle={idx % 2 === 0 ? 'right' : 'left'}
                  className="flex flex-col h-full"
                >
                  <div className="relative aspect-video w-full border-2 border-border-color mb-4 bg-muted flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-halftone"></div>
                    {proj.slug === 'think-canvas' && (
                      <img src="/images/think-canvas.png" alt={proj.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {proj.slug === 'node-editor-flow' && (
                      <img src="/images/node-flow.png" alt={proj.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {proj.slug === 'cicd-infrastructure-automation' && (
                      <img src="/images/devops-journey.png" alt={proj.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {!['think-canvas', 'node-editor-flow', 'cicd-infrastructure-automation'].includes(proj.slug) && (
                      <span className="font-comic-title text-lg text-muted-foreground z-10 text-center px-2">
                        {proj.title}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 left-4 bg-primary text-white border-2 border-border-color px-2 py-0.5 text-xs font-comic-title uppercase">
                    Mission {idx + 1}
                  </div>

                  <h3 className="font-comic-header text-xl uppercase mb-2 text-foreground line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground mb-4 flex-grow line-clamp-3">
                    {proj.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {proj.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 border border-border-color bg-muted text-[9px] uppercase font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions: Live Demo + GitHub + Case Study */}
                  <div className="flex flex-col gap-2 mt-auto pt-2">
                    <div className="flex gap-2 w-full">
                      {proj.liveUrl ? (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <ComicButton variant="accent" size="sm" className="w-full text-[10px] py-1 px-1.5 gap-1">
                            Demo <ExternalLink size={10} className="stroke-[3px]" />
                          </ComicButton>
                        </a>
                      ) : null}
                      {proj.githubUrl ? (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <ComicButton variant="outline" size="sm" className="w-full text-[10px] py-1 px-1.5 gap-1">
                            GitHub <svg className="w-3 h-3 fill-current inline-block" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                          </ComicButton>
                        </a>
                      ) : null}
                    </div>

                    <Link href={`/projects/${proj.slug}`} className="w-full">
                      <ComicButton variant="secondary" size="sm" className="w-full text-xs py-1.5">
                        Case Study <ArrowRight size={12} className="inline ml-1 stroke-[3px]" />
                      </ComicButton>
                    </Link>
                  </div>

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
              <p className="font-bold text-muted-foreground uppercase">
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

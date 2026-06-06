import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { NarratorBox } from '@/components/ui/NarratorBox';
import { SoundEffectBadge } from '@/components/ui/SoundEffectBadge';
import { ComicButton } from '@/components/ui/ComicButton';
import Link from 'next/link';

export default function AboutPage() {
  // Marvel Power Grid Stats (Scale 1 to 7)
  const powerGrid = [
    { skill: 'React / Next.js Framework', score: 6, desc: 'Dynamic server-rendered shells, responsive rendering, and Tailwind integration.' },
    { skill: 'React Flow / Node Graphs', score: 6, desc: 'Visual workflow builders, graph state sync (Zustand), and visual canvases.' },
    { skill: 'TypeScript & Node.js', score: 5, desc: 'Type-safe architectures, Express API routing, and backend systems.' },
    { skill: 'Micro-containers (Docker)', score: 5, desc: 'Multi-stage builds, container networks, and microservices links.' },
    { skill: 'Database Structures', score: 5, desc: 'MongoDB indexes, document schemas, and SQL relational pipelines.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="grow py-12 bg-halftone">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Page Masthead */}
          <div className="text-center mb-12">
            <h1 className="font-comic-header text-6xl uppercase text-primary mb-2 text-stroke-black select-none">
              Origin Story
            </h1>
            <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs md:text-sm">
              The Dossier and Chronicles of Yogesh Tandan
            </p>
          </div>

          {/* Chronological Origin Sections */}
          <div className="flex flex-col gap-16 mb-16">
            
            {/* 1. CURRENTLY WORKING */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex justify-center order-2 md:order-1">
                <SoundEffectBadge text="ACTIVE!" color="yellow" size="md" className="transform rotate-3" />
              </div>
              
              <div className="md:col-span-8 order-1 md:order-3">
                <ComicPanel skewAngle="right">
                  <div className="absolute top-3 left-4 bg-primary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase tracking-wider">
                    Status: Currently Active
                  </div>
                  <h3 className="font-comic-header text-2xl uppercase mt-8 mb-2 text-secondary">
                    Currently Deployed
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed">
                    Yogesh is currently operating as a <strong>Full Stack & Web Developer</strong>, specializing in React, Next.js, and visual graph architectures. He is actively designing and deploying visual system solutions, visual node editors (like <strong>think-canvas</strong>), and hyper-local marketplace engines (like <strong>ENM</strong>).
                  </p>
                </ComicPanel>
              </div>
            </div>

            {/* 2. EXPERIENCE */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 order-1">
                <ComicPanel skewAngle="left">
                  <div className="absolute top-3 left-4 bg-secondary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase tracking-wider">
                    Mission Log: Experience
                  </div>
                  <h3 className="font-comic-header text-2xl uppercase mt-8 mb-3 text-primary">
                    Professional Operations
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-3 border-primary pl-3">
                      <span className="font-comic-title text-sm uppercase tracking-wide block text-foreground">
                        Web Engineer Intern & BDA — GRADGURU
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground block mb-1">2024 - PRESENT | RAIPUR, INDIA</span>
                      <p className="text-xs font-semibold text-muted-foreground leading-snug">
                        Collaborated in creating web features, optimizing client-side interfaces, and translating product specifications into functional React code. Supported business development pipelines to align client requirements with engineering builds.
                      </p>
                    </div>

                    <div className="border-l-3 border-secondary pl-3">
                      <span className="font-comic-title text-sm uppercase tracking-wide block text-foreground">
                        Freelance Software Developer — INDEPENDENT
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground block mb-1">2022 - PRESENT</span>
                      <p className="text-xs font-semibold text-muted-foreground leading-snug">
                        Engineered custom web interfaces, productivity sandboxes, and interactive scripts. Notable projects include TypeFlow, a retro typing practice tool, and node flowchart frameworks.
                      </p>
                    </div>
                  </div>
                </ComicPanel>
              </div>

              <div className="md:col-span-4 flex justify-center order-2">
                <SoundEffectBadge text="KLING!" color="blue" size="md" className="transform -rotate-6" />
              </div>
            </div>

            {/* 3. EDUCATION COLLEGE */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex justify-center order-2 md:order-1">
                <SoundEffectBadge text="GRAD!" color="red" size="md" className="transform rotate-6" />
              </div>

              <div className="md:col-span-8 order-1 md:order-3">
                <ComicPanel skewAngle="right">
                  <div className="absolute top-3 left-4 bg-accent text-accent-foreground border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase tracking-wider">
                    Academy: Education
                  </div>
                  <h3 className="font-comic-header text-2xl uppercase mt-8 mb-2 text-secondary">
                    College Training
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed">
                    Our hero holds a <strong>Bachelor of Technology (B.Tech) in Computer Science & Engineering</strong> from <strong>Government Engineering College, Raipur</strong> (Batch of 2021 - 2025).
                  </p>
                  <p className="text-xs font-bold text-muted-foreground mt-2 leading-relaxed">
                    Rigorous courses completed in Data Structures, Algorithm Design, Operating Systems, Database Management Systems, and Object-Oriented Architectures.
                  </p>
                </ComicPanel>
              </div>
            </div>

          </div>

          {/* Capabilities Grid */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="font-comic-header text-4xl uppercase text-foreground">
                Capability Power Grid
              </h2>
              <p className="text-xs font-bold text-muted-foreground">
                CLASSIFIED TECHNICAL DOSSIERS & KEY CAPABILITIES
              </p>
            </div>

            <ComicPanel skewAngle="none" className="bg-panel-bg p-8 border-3">
              <div className="flex flex-col gap-6">
                {powerGrid.map((row) => (
                  <div key={row.skill} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-border-color/10 pb-4 last:border-b-0 last:pb-0">
                    
                    <div className="md:col-span-4">
                      <span className="font-comic-title text-lg uppercase tracking-wider text-primary">
                        {row.skill}
                      </span>
                    </div>

                    <div className="md:col-span-8">
                      <span className="text-sm font-semibold text-muted-foreground leading-snug block">
                        {row.desc}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </ComicPanel>
          </div>

          {/* Footer Call to Action */}
          <div className="text-center pt-8">
            <NarratorBox title="COMMUNICATION CAPABILITIES" className="max-w-md mx-auto mb-6">
              “Transmissions verified. Ready to collaborate on full-stack pipelines, React Flow visualizations, and microservices. Access database or deploy contact form below.”
            </NarratorBox>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/projects">
                <ComicButton variant="primary" size="lg">
                  Explore Projects Database
                </ComicButton>
              </Link>
              <Link href="/#message-section">
                <ComicButton variant="outline" size="lg">
                  Send Directive Message
                </ComicButton>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { NarratorBox } from '@/components/ui/NarratorBox';
import { SoundEffectBadge } from '@/components/ui/SoundEffectBadge';
import { ComicButton } from '@/components/ui/ComicButton';
import Link from 'next/link';
import { Download, Server, Cpu, Layers, ShieldCheck, Terminal, ArrowRight, ExternalLink } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Origin Story — Yogesh Tandan, Software Engineer",
  description: "The origin story, technical powers, engineering background, and experience of Yogesh Tandan — Software Engineer at eigenstudio specializing in Next.js multi-tenant SaaS, WebGL 3D rendering engines, and AWS/Terraform DevOps.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Origin Story — Yogesh Tandan, Software Engineer",
    description: "The origin story, technical powers, engineering background, and experience of Yogesh Tandan — Software Engineer at eigenstudio specializing in Next.js multi-tenant SaaS, WebGL 3D rendering engines, and AWS/Terraform DevOps.",
    url: `${seoConfig.siteUrl}/about`,
  },
};

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": seoConfig.authorName,
    "url": `${seoConfig.siteUrl}/about`,
    "jobTitle": seoConfig.jobTitle,
    "worksFor": {
      "@type": "Organization",
      "name": seoConfig.company,
    },
    "alumniOf": {
      "@type": "Organization",
      "name": seoConfig.previousCompany,
    },
    "sameAs": [
      seoConfig.socialLinks.github,
      seoConfig.socialLinks.linkedin,
      seoConfig.socialLinks.twitter,
    ],
  };
  // Marvel Power Grid Capability Facts
  const powerGrid = [
    { 
      category: 'Cloud & Infrastructure',
      skill: 'AWS & Terraform Automation', 
      desc: 'Provisioning AWS ECS, Fargate, VPCs, API Gateway, WAF & DynamoDB with Terraform IaC. Configured OIDC GitHub-to-AWS authentication (zero static keys).' 
    },
    { 
      category: 'Frontend & SaaS Architecture',
      skill: 'Next.js, React & Multi-Tenant SaaS', 
      desc: 'Building multi-tenant SaaS frontend modules, Figma-aligned Cognito MFA auth flows, incident management screens, and reusable UI components.' 
    },
    { 
      category: 'Interactive Visualizations',
      skill: 'React Flow, Two.js & Recharts', 
      desc: 'Node graph editors, visual workflow state relays, Attio-inspired motion physics, and domain-specific 2D/SVG data analytics.' 
    },
    { 
      category: 'Desktop & Computational Apps',
      skill: 'Electron.js & Performance Optimization', 
      desc: 'Optimized 3D rendering engine for computational engineering tools, delivering a ~60% performance improvement in rendering FPS.' 
    },
    { 
      category: 'APIs & Backend Integration',
      skill: 'REST APIs & Schema Analysis', 
      desc: 'Reverse-engineering backend User Service APIs, inspecting Postman collections, and enforcing type-safe client contracts.' 
    },
  ];

  // AWS & Infrastructure Matrix Services
  const infraServices = [
    { name: 'AWS ECS & Fargate', role: 'Container Orchestration', tag: 'Compute' },
    { name: 'Terraform (HCL)', role: 'Infrastructure as Code', tag: 'IaC' },
    { name: 'OIDC Federation', role: 'GitHub-to-AWS Auth', tag: 'Security' },
    { name: 'AWS API Gateway', role: 'REST API Proxy & Routing', tag: 'Networking' },
    { name: 'AWS WAF', role: 'Web Application Firewall', tag: 'Security' },
    { name: 'AWS Cognito', role: 'Identity & MFA Auth', tag: 'Auth' },
    { name: 'AWS DynamoDB', role: 'NoSQL Data Store', tag: 'Database' },
    { name: 'GitHub Actions', role: 'Automated CI/CD Pipelines', tag: 'Automation' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={personJsonLd} />
      <Header />

      <main className="grow py-12 bg-halftone">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Page Masthead */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <SoundEffectBadge text="VERIFIED DOSSIER" color="yellow" size="sm" className="transform -rotate-3" />
            </div>
            <h1 className="font-comic-header text-6xl uppercase text-primary mb-2 text-stroke-black select-none">
              Origin Story
            </h1>
            <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs md:text-sm mb-6">
              The Dossier and Chronicles of Yogesh Tandan
            </p>
            
            {/* Resume Download CTA at top */}
            <div className="flex justify-center">
              <a href="/resume/yogesh.pdf" target="_blank" download="Yogesh_Tandan_Resume.pdf">
                <ComicButton variant="accent" size="md" className="gap-2">
                  <Download size={18} className="stroke-[3px]" /> Download Resume (PDF)
                </ComicButton>
              </a>
            </div>
          </div>

          {/* Chronological Origin Sections */}
          <div className="flex flex-col gap-14 mb-16">
            
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
                    Software Engineer @ <Link href="https://eigenstudio.com/" target="_blank" className='lowercase!'>eigenstudio</Link>
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed mb-3">
                    Operating as a Software Engineer building production-grade frontend systems for multi-tenant SaaS applications, integrating backend APIs, and authoring cloud infrastructure CI/CD pipelines.
                  </p>
                  <ul className="list-disc pl-5 text-xs md:text-sm font-semibold text-foreground space-y-1">
                    <li>Built Next.js frontend modules for multi-tenant SaaS workflows & incident management dashboards.</li>
                    <li>Implemented Cognito MFA flows aligned precisely with Figma design systems.</li>
                    <li>Reverse-engineered backend User Service REST APIs from schemas and Postman collections.</li>
                    <li>Extended GitHub Actions CI/CD pipelines & Terraform-based AWS deployments (OIDC auth).</li>
                  </ul>
                </ComicPanel>
              </div>
            </div>

            {/* 2. EXPERIENCE LOG */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 order-1">
                <ComicPanel skewAngle="left">
                  <div className="absolute top-3 left-4 bg-secondary text-white border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase tracking-wider">
                    Mission Log: Experience
                  </div>
                  <h3 className="font-comic-header text-2xl uppercase mt-8 mb-4 text-primary">
                    Professional Operations
                  </h3>
                  
                  <div className="space-y-6">

                    {/* eigenstudio */}
                    <div className="border-l-3 border-primary pl-3">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <span className="font-comic-title text-base uppercase tracking-wide text-foreground">
                          Software Engineer — eigenstudio
                        </span>
                        <span className="text-[10px] font-bold text-primary">NOV 2025 – PRESENT</span>
                      </div>
                      <ul className="list-disc pl-4 text-xs font-semibold text-muted-foreground mt-1 space-y-1">
                        <li>Engineered multi-tenant SaaS frontend modules with tenant isolation & Cognito MFA auth.</li>
                        <li>Built interactive data visualizations using Two.js and Recharts for domain analytics.</li>
                        <li>Configured OIDC-based GitHub-to-AWS authentication with Terraform deployments.</li>
                      </ul>
                    </div>

                    {/* Avkalan Labs Junior Dev */}
                    <div className="border-l-3 border-secondary pl-3">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <span className="font-comic-title text-base uppercase tracking-wide text-foreground">
                          Junior Software Developer — Avkalan Labs (Raipur)
                        </span>
                        <span className="text-[10px] font-bold text-secondary">APR 2025 – NOV 2025</span>
                      </div>
                      <ul className="list-disc pl-4 text-xs font-semibold text-muted-foreground mt-1 space-y-1">
                        <li>Developed Next.js, React, React Native, and Electron.js computational engineering apps.</li>
                        <li>Enhanced application responsiveness, usability, and UI component architecture.</li>
                      </ul>
                    </div>

                    {/* Avkalan Labs Intern */}
                    <div className="border-l-3 border-accent pl-3">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <span className="font-comic-title text-base uppercase tracking-wide text-foreground">
                          Frontend Developer Intern — Avkalan Labs (Roorkee)
                        </span>
                        <span className="text-[10px] font-bold text-amber-600">NOV 2023 – APR 2025</span>
                      </div>
                      <ul className="list-disc pl-4 text-xs font-semibold text-muted-foreground mt-1 space-y-1">
                        <li><strong className="text-foreground">Optimized Electron.js-based 3D rendering software, achieving ~60% performance improvement.</strong></li>
                        <li>Designed user-friendly interfaces for technically complex 3D software products.</li>
                      </ul>
                    </div>

                    {/* Leadership */}
                    <div className="border-l-3 border-foreground/40 pl-3">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <span className="font-comic-title text-base uppercase tracking-wide text-foreground">
                          Chief Technical Executive — Code For Community (GEC Raipur)
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">APR 2022 – JUN 2025</span>
                      </div>
                      <ul className="list-disc pl-4 text-xs font-semibold text-muted-foreground mt-1 space-y-1">
                        <li>Led design and development of the community website; organized coding workshops & events.</li>
                      </ul>
                    </div>

                  </div>
                </ComicPanel>
              </div>

              <div className="md:col-span-4 flex justify-center order-2">
                <SoundEffectBadge text="KABOOM!" color="blue" size="md" className="transform -rotate-6" />
              </div>
            </div>

            {/* 3. EDUCATION */}
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
                    Engineering Credentials
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-foreground leading-relaxed">
                    Bachelor of Technology (B.Tech) in Electronics and Telecommunication Engineering
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">
                    Government Engineering College, Raipur | Batch of 2021 – 2025
                  </p>
                </ComicPanel>
              </div>
            </div>

          </div>

          {/* DEDICATED VISUAL CLOUD & INFRASTRUCTURE PANEL */}
          <div className="mb-14">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <Server className="text-primary" size={24} />
                <h2 className="font-comic-header text-4xl uppercase text-foreground">
                  Cloud & Infrastructure Operations
                </h2>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                AWS SERVICES, TERRAFORM IAC & OIDC SECURITY MATRIX
              </p>
            </div>

            <ComicPanel skewAngle="none" className="bg-panel-bg p-6 md:p-8 border-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {infraServices.map((srv) => (
                  <div 
                    key={srv.name} 
                    className="border-2 border-border-color bg-background p-3.5 shadow-comic-md hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-comic-title uppercase px-1.5 py-0.5 bg-primary text-white border border-border-color">
                        {srv.tag}
                      </span>
                      <ShieldCheck size={14} className="text-secondary" />
                    </div>
                    <h4 className="font-comic-title text-sm uppercase text-foreground mt-1">
                      {srv.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-snug">
                      {srv.role}
                    </p>
                  </div>
                ))}
              </div>

              {/* Infrastructure metrics callout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-border-color pt-6">
                <div className="bg-accent/20 border-2 border-border-color p-3 text-center">
                  <span className="font-comic-header text-2xl text-primary block">OIDC Federated</span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">Zero Static AWS Keys</span>
                </div>
                <div className="bg-accent/20 border-2 border-border-color p-3 text-center">
                  <span className="font-comic-header text-2xl text-secondary block">Terraform HCL</span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">100% Codified Infrastructure</span>
                </div>
                <div className="bg-accent/20 border-2 border-border-color p-3 text-center">
                  <span className="font-comic-header text-2xl text-amber-600 block">GitHub Actions</span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">Automated CI/CD Builds</span>
                </div>
              </div>
            </ComicPanel>
          </div>

          {/* Capabilities Grid */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="font-comic-header text-4xl uppercase text-foreground">
                Capability Power Grid
              </h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                VERIFIED SKILL METRICS & ENGINEERING CAPACITY
              </p>
            </div>

            <ComicPanel skewAngle="none" className="bg-panel-bg p-6 md:p-8 border-3">
              <div className="flex flex-col gap-6">
                {powerGrid.map((row) => (
                  <div key={row.skill} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-border-color/10 pb-5 last:border-b-0 last:pb-0">
                    
                    <div className="md:col-span-5 flex flex-col">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {row.category}
                      </span>
                      <span className="font-comic-title text-lg uppercase tracking-wider text-foreground">
                        {row.skill}
                      </span>
                    </div>

                    <div className="md:col-span-7">
                      <span className="text-xs md:text-sm font-semibold text-muted-foreground leading-snug block">
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
              “Transmissions verified. Ready to collaborate on full-stack pipelines, React Flow visualizations, and cloud deployments. Download resume dossier or initiate message transmission below.”
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
              {/* <a href="/resume/yogesh.pdf" target="_blank" download="Yogesh_Tandan_Resume.pdf">
                <ComicButton variant="accent" size="lg" className="gap-2">
                  <Download size={20} className="stroke-[3px]" /> Download Resume (PDF)
                </ComicButton>
              </a> */}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

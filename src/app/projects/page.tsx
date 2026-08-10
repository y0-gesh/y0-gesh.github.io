import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllProjects } from '@/lib/content';
import { ProjectsList } from './ProjectsList';
import { JsonLd } from '@/components/seo/JsonLd';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Project Database & Engineering Missions — Yogesh Tandan",
  description: "Explore engineering case studies, multi-tenant SaaS applications, WebGL 3D rendering engines, and AWS/Terraform infrastructure projects built by Yogesh Tandan.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Project Database & Engineering Missions — Yogesh Tandan",
    description: "Explore engineering case studies, multi-tenant SaaS applications, WebGL 3D rendering engines, and AWS/Terraform infrastructure projects built by Yogesh Tandan.",
    url: `${seoConfig.siteUrl}/projects`,
    siteName: seoConfig.siteName,
    images: [
      {
        url: seoConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Project Database - Yogesh Tandan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Database & Engineering Missions — Yogesh Tandan",
    description: "Explore engineering case studies, multi-tenant SaaS applications, WebGL 3D rendering engines, and AWS/Terraform infrastructure projects built by Yogesh Tandan.",
    images: [seoConfig.defaultOgImage],
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Project Database & Engineering Missions",
    "description": "Software engineering case studies, 3D web engines, and cloud infrastructure projects by Yogesh Tandan.",
    "url": `${seoConfig.siteUrl}/projects`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${seoConfig.siteUrl}/projects/${p.slug}`,
        "name": p.title,
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={collectionJsonLd} />
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

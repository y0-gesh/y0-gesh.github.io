import React from "react";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/content";
import { BlogList } from "../../components/blog/BlogList";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Daily Planet Newsroom & Technical Chronicles — Yogesh Tandan",
  description:
    "Read software engineering articles on System Design, Automation, WebGL 3D Physics, Next.js, and AWS DevOps written by Yogesh Tandan.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Daily Planet Newsroom & Technical Chronicles — Yogesh Tandan",
    description:
      "Read software engineering articles on System Design, Automation, WebGL 3D Physics, Next.js, and AWS DevOps written by Yogesh Tandan.",
    url: `${seoConfig.siteUrl}/blog`,
    siteName: seoConfig.siteName,
    images: [
      {
        url: seoConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Daily Planet Newsroom - Yogesh Tandan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Planet Newsroom & Technical Chronicles — Yogesh Tandan",
    description:
      "Read software engineering articles on System Design, Automation, WebGL 3D Physics, Next.js, and AWS DevOps written by Yogesh Tandan.",
    images: [seoConfig.defaultOgImage],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Daily Planet Newsroom & Technical Chronicles",
    description:
      "Engineering articles and software architecture guides by Yogesh Tandan.",
    url: `${seoConfig.siteUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${seoConfig.siteUrl}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={collectionJsonLd} />

      <main className="flex-grow py-12 bg-halftone">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Newspaper Masthead Banner */}
          <div className="border-y-4 border-double border-border-color py-6 mb-12 text-center bg-panel-bg shadow-comic-md select-none">
            <h1 className="font-comic-header text-6xl md:text-8xl tracking-widest uppercase text-foreground leading-none">
              Daily Planet Newsroom
            </h1>

            <div className="flex items-center justify-between border-t-2 border-border-color mt-4 pt-2 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest px-4">
              <span>VOL. XXVI... NO. 142</span>
              <span className="hidden sm:inline">
                PUBLISHED DIRECTLY FROM THE SOURCE CODE
              </span>
              <span>PRICE: FREE EDITION</span>
            </div>
          </div>

          {/* Render Interactive Listing */}
          <BlogList initialPosts={posts} />
        </div>
      </main>
    </div>
  );
}

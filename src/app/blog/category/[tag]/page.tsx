import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogList } from "@/components/blog/BlogList";
import { getAllCategories, getBlogPostsByCategory } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoConfig } from "@/lib/seo";
import { ComicButton } from "@/components/ui/ComicButton";
import { ArrowLeft, Tag } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    tag: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { tag } = await params;
  const { categoryName, posts } = getBlogPostsByCategory(tag);

  if (!posts || posts.length === 0) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${categoryName} Articles — Yogesh Tandan`;
  const description = `Explore ${categoryName} technical articles, architecture guides, and engineering chronicles written by Yogesh Tandan.`;
  const canonicalUrl = `/blog/category/${tag.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: `${seoConfig.siteUrl}${canonicalUrl}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { tag } = await params;
  const { categoryName, posts } = getBlogPostsByCategory(tag);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Articles by Yogesh Tandan`,
    description: `Technical chronicles and articles tagged under ${categoryName}.`,
    url: `${seoConfig.siteUrl}/blog/category/${tag}`,
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
      <Header />

      <main className="flex-grow py-12 bg-halftone">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/blog">
              <ComicButton variant="outline" size="sm">
                <ArrowLeft
                  size={14}
                  className="inline-block mr-1 stroke-[3px]"
                />{" "}
                All Chronicles
              </ComicButton>
            </Link>
          </div>

          {/* Category Banner */}
          <div className="border-3 border-border-color bg-panel-bg p-6 md:p-8 shadow-comic mb-10 relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase mb-3 shadow-comic-sm">
              <Tag size={14} /> Topic Archive
            </div>

            <h1 className="font-comic-header text-4xl sm:text-6xl uppercase leading-tight text-primary">
              {categoryName} Articles
            </h1>
            <p className="text-sm font-semibold text-muted-foreground mt-2 uppercase">
              Showing {posts.length}{" "}
              {posts.length === 1 ? "chronicle" : "chronicles"} tagged under{" "}
              {categoryName}
            </p>
          </div>

          {/* Category Posts List */}
          <BlogList initialPosts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

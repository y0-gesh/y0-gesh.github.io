import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { ComicButton } from "@/components/ui/ComicButton";
import { NarratorBox } from "@/components/ui/NarratorBox";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { getBlogPostBySlug, getAllBlogPosts, getRelatedBlogPosts } from "@/lib/content";
import { ArrowLeft, Calendar, Clock, BookOpen, Tag } from "lucide-react";
import CodeBlockCopy from "@/components/sections/CodeBlockCopy";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoConfig } from "@/lib/seo";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const rawDescription = post.description || post.title;
  const description = rawDescription.length > 155
    ? `${rawDescription.slice(0, 152)}...`
    : rawDescription;

  const canonicalUrl = `/blog/${post.slug}`;
  const ogImage = post.coverImage && post.coverImage !== "/placeholder.jpg"
    ? `${seoConfig.siteUrl}${post.coverImage}`
    : seoConfig.defaultOgImage;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${seoConfig.siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [seoConfig.authorName],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
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
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Related articles
  const relatedPosts = getRelatedBlogPosts(slug, post.category, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.coverImage && post.coverImage !== "/placeholder.jpg"
      ? `${seoConfig.siteUrl}${post.coverImage}`
      : seoConfig.defaultOgImage,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": seoConfig.authorName,
      "url": seoConfig.siteUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": seoConfig.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${seoConfig.siteUrl}/images/blog-3.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${seoConfig.siteUrl}/blog/${post.slug}`,
    },
    "keywords": [post.category, ...post.tags].join(", "),
  };

  const categorySlug = post.category.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <JsonLd data={articleJsonLd} />
      {/* Scroll Reading Progress Bar */}
      <div
        id="reading-progress"
        className="fixed top-0 left-0 h-1.5 bg-primary z-999 w-full transform scale-x-0 origin-left"
        aria-hidden="true"
      ></div>

      <Header />
      <CodeBlockCopy />
      <main className="grow py-12 bg-halftone">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/blog">
              <ComicButton variant="outline" size="sm">
                <ArrowLeft
                  size={14}
                  className="inline-block mr-1 stroke-[3px]"
                />{" "}
                Back to Archives
              </ComicButton>
            </Link>
          </div>

          {/* Masthead Headline */}
          <div className="border-3 border-border-color bg-panel-bg shadow-comic mb-12 relative overflow-hidden">
            {post.coverImage && (
              <div className="relative w-full h-56 sm:h-80 border-b-3 border-border-color overflow-hidden group">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <h1 className="font-comic-header text-3xl sm:text-5xl uppercase text-white tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {post.title}
                  </h1>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <Link
                  href={`/blog/category/${categorySlug}`}
                  className="bg-accent hover:bg-primary hover:text-white transition-colors text-accent-foreground border-2 border-border-color px-2.5 py-0.5 text-xs font-comic-title uppercase shadow-comic-sm flex items-center gap-1"
                >
                  <Tag size={12} /> {post.category}
                </Link>

                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {post.readTime}
                  </span>
                </div>
              </div>

              {!post.coverImage && (
                <h1 className="font-comic-header text-4xl sm:text-6xl uppercase leading-tight mt-4">
                  {post.title}
                </h1>
              )}
            </div>
          </div>

          {/* Grid: Article Body + Table of Contents Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Left Column: Markdown content (order-2 on mobile, lg:order-1 on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
              <ComicPanel skewAngle="none" className="bg-panel-bg p-6 md:p-8">
                <div
                  className="
                    markdown-content
                    font-sans text-sm md:text-base leading-relaxed font-semibold text-foreground
                    space-y-6
                    [&>h1]:hidden
                    [&>h2]:font-comic-header [&>h2]:text-3xl [&>h2]:uppercase [&>h2]:text-secondary [&>h2]:mt-8 [&>h2]:mb-2 [&>h2]:border-b-2 [&>h2]:border-border-color [&>h2]:pb-1 [&>h2]:scroll-mt-24
                    [&>h3]:font-comic-title [&>h3]:text-xl [&>h3]:uppercase [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-1 [&>h3]:scroll-mt-24
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

            {/* Right Column: Sidebar Table of Contents (order-1 on mobile, lg:order-2 on desktop) */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="sticky top-24 flex flex-col gap-6">
                <ComicPanel
                  skewAngle="none"
                  className="bg-panel-bg border-3 p-5 shadow-comic"
                >
                  <TableOfContents headings={post.headings} articleTitle={post.title} />
                </ComicPanel>

                {/* Comic Bulletin box */}
                <NarratorBox title="COMIC BULLETIN">
                  “Follow details sequentially. Click any index heading above to jump directly to that section.”
                </NarratorBox>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mb-12 border-t-3 border-border-color pt-10">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="text-primary" size={24} />
                <h3 className="font-comic-header text-3xl uppercase text-foreground">
                  Related Chronicles ({post.category})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relPost) => (
                  <Link
                    key={relPost.slug}
                    href={`/blog/${relPost.slug}`}
                    className="group"
                  >
                    <ComicPanel skewAngle="none" className="h-full bg-panel-bg p-5 hover:bg-accent/20 transition-colors">
                      <span className="text-[10px] font-comic-title uppercase bg-primary text-white px-2 py-0.5 border border-border-color inline-block mb-2">
                        {relPost.category}
                      </span>
                      <h4 className="font-comic-header text-lg uppercase text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {relPost.title}
                      </h4>
                      <p className="text-xs font-semibold text-muted-foreground line-clamp-2">
                        {relPost.description}
                      </p>
                    </ComicPanel>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t-3 border-border-color pt-12">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group">
                <ComicPanel
                  skewAngle="left"
                  className="h-full hover:bg-muted/30"
                >
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">
                    ← Previous Story
                  </span>
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
                <ComicPanel
                  skewAngle="right"
                  className="h-full text-right hover:bg-muted/30"
                >
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">
                    Next Story →
                  </span>
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
    </div>
  );
}

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

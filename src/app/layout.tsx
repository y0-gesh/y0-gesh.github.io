import type { Metadata } from "next";
import { Bangers, Bebas_Neue, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { WebShooterListener } from "@/components/ui/WebShooterListener";
import { seoConfig } from "@/lib/seo";
import "@/styles/globals.css";

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  authors: [{ name: seoConfig.authorName, url: seoConfig.siteUrl }],
  creator: seoConfig.authorName,
  publisher: seoConfig.authorName,
  keywords: [
    "Yogesh Tandan",
    "Software Engineer",
    "eigenstudio",
    "Avkalan Labs",
    "Next.js",
    "Multi-Tenant SaaS",
    "3D Engine",
    "Rapier Physics",
    "Three.js",
    "AWS",
    "Terraform",
    "DevOps",
    "System Design",
    "Frontend Engineering",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${seoConfig.siteUrl}/rss.xml`,
    },
  },
  openGraph: {
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: seoConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Yogesh Tandan - Software Engineering Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    creator: seoConfig.twitterHandle,
    site: seoConfig.twitterHandle,
    images: [seoConfig.defaultOgImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${bebasNeue.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Yogesh Tandan Chronicles — RSS Feed"
          href={`${seoConfig.siteUrl}/rss.xml`}
        />
      </head>
      <body className="min-h-full flex flex-col paper-texture bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <WebShooterListener />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { ComicButton } from "@/components/ui/ComicButton";
import { NarratorBox } from "@/components/ui/NarratorBox";
import { SoundEffectBadge } from "@/components/ui/SoundEffectBadge";
import { SpiderWebOverlay } from "@/components/ui/SpiderWebOverlay";
import {
  Home,
  ArrowLeft,
  Compass,
  FolderGit2,
  Newspaper,
  ShieldAlert,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <SpiderWebOverlay />
      <Header />

      <main className="flex-grow py-12 md:py-20 bg-halftone flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 md:px-8 w-full">
          {/* Main 404 Hero Panel */}
          <ComicPanel
            skewAngle="none"
            className="bg-panel-bg p-6 md:p-12 shadow-comic relative overflow-hidden text-center flex flex-col items-center gap-6"
          >
            {/* Top Comic Badge */}
            <div className="relative mb-2">
              <div className="absolute -top-6 -left-12 hidden sm:block">
                <SoundEffectBadge
                  text="LOST!"
                  color="red"
                  size="sm"
                  className="transform -rotate-12"
                />
              </div>
              <div className="absolute -top-6 -right-12 hidden sm:block">
                <SoundEffectBadge
                  text="404!"
                  color="yellow"
                  size="sm"
                  className="transform rotate-12"
                />
              </div>

              {/* <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-border-color bg-accent text-accent-foreground font-comic-title text-xs uppercase shadow-comic-sm">
                <ShieldAlert size={14} className="stroke-[3px]" /> Anomaly
                Detected • Error 404
              </div> */}
              <div className="w-max bg-primary inline-flex items-center gap-2 text-white border-2 border-border-color px-3 py-0.5 text-xs font-comic-title uppercase tracking-widest">
                <ShieldAlert size={14} className="stroke-[3px]" />
                Anomaly Detected • Error 404
              </div>
            </div>

            {/* Giant 404 Header */}
            <h1 className="font-comic-header text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight leading-none text-primary text-stroke-black select-none">
              404
            </h1>

            <h2 className="font-comic-header text-2xl sm:text-4xl uppercase tracking-wide text-foreground">
              Oops! This Page Got Lost In The Code.
            </h2>

            {/* Narrator Box explanation */}
            {/* <NarratorBox title="MULTIVERSE ADVISORY" className="w-full max-w-2xl text-left my-2">
              &ldquo;Looks like this route doesn&apos;t exist. The requested coordinates lead into uncharted digital void. The page you&apos;re looking for has wandered off or was refactored into non-existence.&rdquo;
            </NarratorBox> */}

            <p className="font-bold text-muted-foreground uppercase text-xs sm:text-sm max-w-lg mt-4 mb-2 leading-relaxed">
              Don&apos;t panic, agent! You can return to safe ground or explore
              other active mission logs across the portfolio.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 w-full">
              <Link href="/">
                <ComicButton variant="primary" size="md" className="gap-2">
                  <Home size={18} className="stroke-[3px]" /> Back to Base
                  (Home)
                </ComicButton>
              </Link>

              <ComicButton
                variant="outline"
                size="md"
                className="gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft size={18} className="stroke-[3px]" /> Go Back
              </ComicButton>
            </div>

            {/* Popular Alternate Routes */}
            <div className="w-full pt-10 mt-4">
              <p className="font-comic-title text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Recommended Alternative Destinations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-border-color pt-6">
                <Link
                  href="/about"
                  className="bg-accent/20 border-2 border-border-color p-3 text-center"
                >
                  <span className="font-comic-header text-2xl text-primary block">
                    {" "}
                    Origin Story
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    View my profile
                  </span>
                </Link>
                <Link
                  href="/projects"
                  className="bg-accent/20 border-2 border-border-color p-3 text-center"
                >
                  <span className="font-comic-header text-2xl text-secondary block">
                    Mission Logs
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    Projects I&apos;ve worked on
                  </span>
                </Link>
                <Link
                  href="/blog"
                  className="bg-accent/20 border-2 border-border-color p-3 text-center"
                >
                  <span className="font-comic-header text-2xl text-amber-600 block">
                    Daily Planet
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    Tech insights
                  </span>
                </Link>
              </div>
            </div>
          </ComicPanel>
        </div>
      </main>

      <Footer />
    </div>
  );
}

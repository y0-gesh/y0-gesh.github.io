'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ComicBookScene = dynamic(
  () => import('./ComicBookScene'),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-[320px] md:h-[400px] flex items-center justify-center font-comic-title text-xl text-muted-foreground uppercase">
        Loading 3D Canvas...
      </div>
    ) 
  }
);

export function HeroThreeCanvas() {
  return <ComicBookScene />;
}
export default HeroThreeCanvas;

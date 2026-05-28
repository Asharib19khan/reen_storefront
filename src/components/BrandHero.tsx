"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

interface Banner {
  id: string;
  title: string;
  media_url: string;
  media_type: "image" | "video";
}

export function BrandHero({ desktopBanner, mobileBanner, title }: { desktopBanner: Banner | null, mobileBanner: Banner | null, title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
  }, [desktopBanner, mobileBanner]);

  if (!desktopBanner && !mobileBanner) return null;

  return (
    <div ref={containerRef} className="relative w-full bg-background border-b border-border/50 flex flex-col items-center">
      
      {/* Desktop Media */}
      {desktopBanner && (
        <div className="hidden md:block w-full">
          {desktopBanner.media_type === 'video' ? (
            <video src={desktopBanner.media_url} autoPlay muted loop playsInline className="w-full h-auto max-h-[80vh] object-cover transition-opacity duration-1000" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={desktopBanner.media_url} alt={desktopBanner.title} className="w-full h-auto object-contain transition-opacity duration-1000" />
          )}
        </div>
      )}

      {/* Mobile Media */}
      {mobileBanner && (
        <div className="block md:hidden w-full">
          {mobileBanner.media_type === 'video' ? (
            <video src={mobileBanner.media_url} autoPlay muted loop playsInline className="w-full h-auto object-cover transition-opacity duration-1000" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={mobileBanner.media_url} alt={mobileBanner.title} className="w-full h-auto object-contain transition-opacity duration-1000" />
          )}
        </div>
      )}
    </div>
  );
}

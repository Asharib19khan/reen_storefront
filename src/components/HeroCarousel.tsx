"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  media_url: string;
  media_type: "image" | "video";
}

export function HeroCarousel({ desktopBanner, mobileBanner }: { desktopBanner: Banner | null, mobileBanner: Banner | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // No text animation needed since text was removed

    if (!desktopBanner && !mobileBanner) {
      anime({
        targets: '.floating-particle',
        translateY: () => anime.random(-30, 30),
        translateX: () => anime.random(-30, 30),
        scale: () => anime.random(0.8, 1.5),
        opacity: [0.1, 0.6],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: () => anime.random(3000, 6000),
        delay: () => anime.random(0, 2000)
      });
    }
  }, [desktopBanner, mobileBanner]);

  return (
    <div ref={containerRef} className="relative w-full h-[100svh] bg-background flex items-center justify-center overflow-hidden">
      
      {/* Desktop Media */}
      {desktopBanner ? (
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="hidden md:block absolute inset-0"
        >
          {/* Subtle gradient so the transparent navbar text is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
          {desktopBanner.media_type === 'video' ? (
            <video src={desktopBanner.media_url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <Image fill src={desktopBanner.media_url} alt={desktopBanner.title} priority quality={100} className="object-cover" />
          )}
        </motion.div>
      ) : (
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background"></div>
      )}

      {/* Mobile Media */}
      {mobileBanner ? (
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="block md:hidden absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
          {mobileBanner.media_type === 'video' ? (
            <video src={mobileBanner.media_url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <Image fill src={mobileBanner.media_url} alt={mobileBanner.title} priority quality={100} className="object-cover" />
          )}
        </motion.div>
      ) : (
        <div className="block md:hidden absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background"></div>
      )}

      {/* Floating particles fallback if no banners */}
      {(!desktopBanner && !mobileBanner) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-particle absolute rounded-full bg-primary/30 blur-[2px]"
              style={{
                width: ((i * 17) % 40 + 10) + 'px',
                height: ((i * 17) % 40 + 10) + 'px',
                top: ((i * 23) % 100) + '%',
                left: ((i * 31) % 100) + '%',
              }}
            />
          ))}
        </div>
      )}

      {/* Content Overlay Removed as requested */}
    </div>
  );
}

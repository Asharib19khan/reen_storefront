"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

export function AnimatedHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // AnimeJS timeline for hero section
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1500
    });

    tl.add({
      targets: '.hero-title',
      translateY: [50, 0],
      opacity: [0, 1],
      delay: 200
    })
    .add({
      targets: '.hero-subtitle',
      translateY: [30, 0],
      opacity: [0, 1],
    }, '-=1000')
    .add({
      targets: '.hero-button',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(150)
    }, '-=1200');

    // Floating particles/sparkles animation
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

  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[40vh] flex items-center justify-center">
      {/* Decorative particles */}
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
      {children}
    </div>
  );
}

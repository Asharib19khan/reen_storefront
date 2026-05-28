"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

export function AnimatedProductGrid({ children }: { children: React.ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        anime({
          targets: '.product-card-anim',
          translateY: [60, 0],
          opacity: [0, 1],
          delay: anime.stagger(120),
          easing: 'easeOutCubic',
          duration: 1000
        });
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(gridRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef}>
      {children}
    </div>
  );
}

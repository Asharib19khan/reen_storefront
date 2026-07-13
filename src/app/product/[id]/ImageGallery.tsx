"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayImages = images.length > 0 ? images : ["https://placehold.co/600x600/fbcfe8/831843?text=Reens"];

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square relative overflow-hidden rounded-2xl bg-muted border shadow-sm">
        <Image unoptimized 
          src={displayImages[currentIndex]} 
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative flex-shrink-0 w-20 sm:w-auto aspect-square rounded-md overflow-hidden border-2 transition-all snap-start",
                currentIndex === idx ? "border-primary" : "border-transparent hover:border-primary/50"
              )}
            >
              <Image unoptimized src={img} alt={`${title} ${idx}`} fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayImages = images.length > 0 ? images : ["https://placehold.co/600x600/fbcfe8/831843?text=Reens"];

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square relative overflow-hidden rounded-2xl bg-muted border shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={displayImages[currentIndex]} 
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all",
                currentIndex === idx ? "border-primary" : "border-transparent hover:border-primary/50"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${title} ${idx}`} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

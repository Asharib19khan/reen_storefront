"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ShopChip } from "@/lib/product-types";

export function ShopCategoryChips({
  chips,
  baseHref,
  variant = "default",
}: {
  chips: ShopChip[];
  baseHref: string;
  variant?: "default" | "byreen";
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveId(hash || null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (chips.length === 0) return null;

  const isByreen = variant === "byreen";

  return (
    <div
      className={
        isByreen
          ? "sticky top-[4.5rem] md:top-20 z-40 -mx-4 px-4 py-3 bg-[#fdf2f8]/95 backdrop-blur-md border-b border-[#fbcfe8]/60 mb-6"
          : "sticky top-20 md:top-24 z-40 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50 mb-8"
      }
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide max-w-7xl mx-auto">
        <Link
          href={baseHref}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors",
            !activeId
              ? isByreen
                ? "bg-[#be185d] text-white border-[#be185d]"
                : "bg-primary text-primary-foreground border-primary"
              : isByreen
                ? "bg-white/80 text-[#9d174d] border-[#fbcfe8] hover:border-[#f9a8d4] hover:text-[#be185d]"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
          )}
          onClick={() => setActiveId(null)}
        >
          All
        </Link>
        {chips.map((chip) => (
          <Link
            key={chip.id}
            href={`${baseHref}#${chip.id}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap",
              activeId === chip.id
                ? isByreen
                  ? "bg-[#be185d] text-white border-[#be185d]"
                  : "bg-primary text-primary-foreground border-primary"
                : isByreen
                  ? "bg-white/80 text-[#9d174d] border-[#fbcfe8] hover:border-[#f9a8d4] hover:text-[#be185d]"
                  : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
            )}
            onClick={() => setActiveId(chip.id)}
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

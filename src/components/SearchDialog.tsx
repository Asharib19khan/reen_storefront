"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Search products"
      >
        <Search className="h-5 w-5 text-foreground" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close search"
          />
          <div className="relative w-full max-w-lg rounded-xl border bg-background shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Search products</h2>
              <button type="button" onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rings, corset, kurti..."
                className={cn(
                  "flex h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              />
              <button
                type="submit"
                className="h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

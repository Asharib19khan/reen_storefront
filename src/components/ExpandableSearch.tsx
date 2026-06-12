"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TRENDING_SEARCHES = ["Corset", "Rings", "Kurti", "Co-ord Sets", "Bracelets"];

export function ExpandableSearch({ isTransparent }: { isTransparent?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setIsExpanded(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  const handleToggle = () => {
    if (isExpanded) {
      if (query) {
        setQuery("");
      } else {
        setIsExpanded(false);
      }
    } else {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setIsExpanded(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end z-50">
      <motion.form
        onSubmit={handleSubmit}
        initial={false}
        animate={{ width: isExpanded ? "280px" : "36px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative flex items-center h-9 md:h-10 rounded-full overflow-hidden transition-colors",
          isExpanded ? "bg-background border shadow-sm" : "bg-transparent border-transparent"
        )}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="absolute left-0 top-0 h-full w-9 md:w-10 flex items-center justify-center rounded-full z-10 group"
          aria-label="Search"
        >
          <Search
            className={cn(
              "h-4 w-4 md:h-5 md:w-5 transition-colors duration-300",
              isExpanded
                ? "text-foreground"
                : isTransparent
                ? "text-white group-hover:opacity-80"
                : "text-foreground group-hover:text-primary"
            )}
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className={cn(
            "w-full h-full pl-9 md:pl-10 pr-8 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none",
            !isExpanded && "cursor-pointer"
          )}
          readOnly={!isExpanded}
        />

        {isExpanded && query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </motion.form>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-64 md:w-80 bg-background border rounded-xl shadow-xl overflow-hidden text-foreground"
          >
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 pb-2 mb-2 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Trending Searches
              </div>
              <ul className="space-y-1">
                {TRENDING_SEARCHES.filter((term) =>
                  term.toLowerCase().includes(query.toLowerCase())
                ).map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      {term}
                      <Search className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                  </li>
                ))}
                {query && TRENDING_SEARCHES.filter((term) =>
                  term.toLowerCase().includes(query.toLowerCase())
                ).length === 0 && (
                  <li className="px-3 py-4 text-sm text-center text-muted-foreground">
                    Press enter to search for "{query}"
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

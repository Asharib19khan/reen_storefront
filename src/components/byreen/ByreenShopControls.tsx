"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/lib/shop-utils";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  price_asc: "Price ↑",
  price_desc: "Price ↓",
  title: "A–Z",
};

export function ByreenShopControls({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = (searchParams.get("sort") as SortOption) || "newest";
  const activeCategory = searchParams.get("category");
  const isNew = searchParams.get("filter") === "new";
  const inStock = searchParams.get("stock") === "in";

  const baseParams = () => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("brand", "byreen_xo");
    return p;
  };

  const hrefFor = (mutate: (p: URLSearchParams) => void) => {
    const p = baseParams();
    mutate(p);
    const qs = p.toString();
    return `/shop?${qs}`;
  };

  const updateSort = (value: string) => {
    const p = baseParams();
    if (value === "newest") p.delete("sort");
    else p.set("sort", value);
    router.replace(`/shop?${p.toString()}`, { scroll: false });
  };

  const toggleStock = () => {
    const p = baseParams();
    if (inStock) p.delete("stock");
    else p.set("stock", "in");
    router.replace(`/shop?${p.toString()}`, { scroll: false });
  };

  const pills: { label: string; href: string; active: boolean }[] = [
    {
      label: "All",
      href: hrefFor((p) => {
        p.delete("category");
        p.delete("filter");
      }),
      active: !activeCategory && !isNew,
    },
    {
      label: "New",
      href: hrefFor((p) => {
        p.delete("category");
        p.set("filter", "new");
      }),
      active: isNew,
    },
    ...categories.map((c) => ({
      label: c,
      href: hrefFor((p) => {
        p.delete("filter");
        p.set("category", c);
      }),
      active: activeCategory === c,
    })),
  ];

  return (
    <div className="sticky top-[4.25rem] md:top-20 z-40 -mx-4 px-4 py-3 mb-8 bg-[#fdf2f8]/95 backdrop-blur-lg border-b border-[#fbcfe8]/50 shadow-sm shadow-[#be185d]/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {pills.map((pill) => (
            <a
              key={pill.label}
              href={pill.href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all",
                pill.active
                  ? "bg-[#be185d] text-white shadow-md shadow-[#be185d]/25"
                  : "bg-white/90 text-[#9d174d] border border-[#fbcfe8] hover:border-[#f9a8d4] hover:text-[#be185d]"
              )}
            >
              {pill.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#9d174d]/80 tracking-wide">
            Tap a category · scroll the mood board
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sort}
              onChange={(e) => updateSort(e.target.value)}
              className="h-8 rounded-full border border-[#fbcfe8] bg-white/95 pl-3 pr-8 text-xs text-[#831843] cursor-pointer"
              aria-label="Sort products"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleStock}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium border transition-colors",
                inStock
                  ? "bg-[#be185d] text-white border-[#be185d]"
                  : "bg-white/90 text-[#9d174d] border-[#fbcfe8] hover:border-[#f9a8d4]"
              )}
            >
              In stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

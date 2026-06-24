"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, Filter, X } from "lucide-react";
import { useState } from "react";
import type { SortOption } from "@/lib/shop-utils";

export function ShopToolbar({
  categories,
  showCategoryFilter = true,
  variant = "default",
}: {
  categories: string[];
  showCategoryFilter?: boolean;
  variant?: "default" | "byreen";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = (searchParams.get("sort") as SortOption) || "newest";
  const category = searchParams.get("category") || "all";
  const stock = searchParams.get("stock") === "in";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const sizes = searchParams.get("sizes")?.split(",") || [];
  const colors = searchParams.get("colors")?.split(",") || [];

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const toggleArrayParam = (key: string, value: string, current: string[]) => {
    let next = [...current];
    if (next.includes(value)) {
      next = next.filter((v) => v !== value);
    } else {
      next.push(value);
    }
    updateParam(key, next.length > 0 ? next.join(",") : null);
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localMin) params.set("min_price", localMin);
    else params.delete("min_price");
    
    if (localMax) params.set("max_price", localMax);
    else params.delete("max_price");
    
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const isByreen = variant === "byreen";

  return (
    <div
      className={
        isByreen
          ? "flex flex-col sm:flex-row sm:items-center gap-3 mb-6 p-3 md:p-4 rounded-2xl border border-[#fbcfe8]/80 bg-white/90 shadow-sm"
          : "flex flex-col sm:flex-row sm:items-center gap-3 mb-8 p-4 rounded-xl border bg-card/50"
      }
    >
      <div
        className={
          isByreen
            ? "flex items-center gap-2 text-sm font-medium text-[#9d174d] shrink-0"
            : "flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0"
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        Sort
      </div>
      <div className="flex flex-wrap gap-2 flex-1">
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className={
            isByreen
              ? "h-9 rounded-full border border-[#fbcfe8] bg-[#fffafb] px-4 text-sm text-[#831843]"
              : "h-9 rounded-md border border-input bg-background px-3 text-sm"
          }
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title">Name A–Z</option>
        </select>

        {showCategoryFilter && categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className={
              isByreen
                ? "h-9 rounded-full border border-[#fbcfe8] bg-[#fffafb] px-4 text-sm max-w-[200px] text-[#831843]"
                : "h-9 rounded-md border border-input bg-background px-3 text-sm max-w-[200px]"
            }
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        <label
          className={
            isByreen
              ? "inline-flex items-center gap-2 h-9 px-4 rounded-full border border-[#fbcfe8] bg-[#fffafb] text-sm text-[#831843] cursor-pointer"
              : "inline-flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm cursor-pointer"
          }
        >
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => updateParam("stock", e.target.checked ? "in" : null)}
            className="rounded border-input"
          />
          In stock only
        </label>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={
            isByreen
              ? "inline-flex items-center gap-2 h-9 px-4 rounded-full border border-[#fbcfe8] bg-[#fffafb] text-sm text-[#831843] transition-colors hover:bg-[#fbcfe8]/20"
              : "inline-flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent"
          }
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
        </button>
      </div>

      {showAdvanced && (
        <div className="w-full mt-4 pt-4 border-t border-border/50 grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Size</h4>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "Free Size"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleArrayParam("sizes", s, sizes)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    sizes.includes(s)
                      ? isByreen ? "bg-[#831843] text-white border-[#831843]" : "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Color Family</h4>
            <div className="flex flex-wrap gap-2">
              {["Black", "White", "Red", "Blue", "Green", "Gold", "Silver", "Pink"].map((c) => (
                <button
                  key={c}
                  onClick={() => toggleArrayParam("colors", c, colors)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    colors.includes(c)
                      ? isByreen ? "bg-[#831843] text-white border-[#831843]" : "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Price Range (Rs.)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full h-8 px-2 text-sm border rounded-md"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full h-8 px-2 text-sm border rounded-md"
              />
              <button
                onClick={applyPriceRange}
                className={`h-8 px-3 text-xs font-medium rounded-md ${
                  isByreen ? "bg-[#831843] text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

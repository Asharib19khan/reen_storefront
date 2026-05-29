"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
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
      </div>
    </div>
  );
}

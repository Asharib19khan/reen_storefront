import type { StoreProduct } from "./product-types";

export type SortOption = "newest" | "price_asc" | "price_desc" | "title";

export function filterProducts(
  products: StoreProduct[],
  opts: {
    q?: string;
    category?: string;
    inStockOnly?: boolean;
    newArrivalsOnly?: boolean;
  }
): StoreProduct[] {
  let result = [...products];

  if (opts.newArrivalsOnly) {
    result = result.filter((p) => p.is_new_arrival);
  }

  if (opts.q?.trim()) {
    const term = opts.q.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.category?.toLowerCase().includes(term) ?? false) ||
        p.brand.replace("_", " ").includes(term)
    );
  }

  if (opts.category && opts.category !== "all") {
    result = result.filter((p) => p.category === opts.category);
  }

  if (opts.inStockOnly) {
    result = result.filter((p) => p.quantity > 0);
  }

  return result;
}

export function sortProducts(products: StoreProduct[], sort: SortOption): StoreProduct[] {
  const copy = [...products];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => Number(a.price) - Number(b.price));
    case "price_desc":
      return copy.sort((a, b) => Number(b.price) - Number(a.price));
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return copy.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
  }
}

export function getUniqueCategories(products: StoreProduct[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => {
    if (p.category && p.category !== "Uncategorized") set.add(p.category);
  });
  return Array.from(set).sort();
}

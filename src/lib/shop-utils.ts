import type { StoreProduct } from "./product-types";

export type SortOption = "newest" | "price_asc" | "price_desc" | "title";

export function filterProducts(
  products: StoreProduct[],
  opts: {
    q?: string;
    category?: string;
    inStockOnly?: boolean;
    newArrivalsOnly?: boolean;
    sizes?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
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

  if (opts.minPrice !== undefined && opts.minPrice >= 0) {
    result = result.filter((p) => Number(p.price) >= opts.minPrice!);
  }

  if (opts.maxPrice !== undefined && opts.maxPrice > 0) {
    result = result.filter((p) => Number(p.price) <= opts.maxPrice!);
  }

  if (opts.sizes && opts.sizes.length > 0) {
    result = result.filter((p) => {
      if (!p.size_matrix) return false;
      const productSizes = p.size_matrix.split(',').map(s => s.trim().toUpperCase());
      return opts.sizes!.some(s => productSizes.includes(s.toUpperCase()));
    });
  }

  if (opts.colors && opts.colors.length > 0) {
    result = result.filter((p) => {
      if (!p.color_options) return false;
      const productColors = p.color_options.split(',').map(c => c.trim().toLowerCase());
      return opts.colors!.some(c => productColors.includes(c.toLowerCase()));
    });
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

export function buildCartPayload(product: StoreProduct | any) {
  const defaultColor = product.color_options ? product.color_options.split(",")[0].trim() : "";
  const defaultSize = product.size_matrix ? product.size_matrix.split(",")[0].trim() : "";
  const defaultAddon = product.interactive_addons ? product.interactive_addons.split(",")[0].trim() : "";
  const priceValue = Number(product.price) || 0;

  return {
    product_id: String(product.id),
    title: product.title,
    price: priceValue,
    brand: product.brand || "luxereen_wears",
    image_url: product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens",
    quantity: 1,
    selected_color: defaultColor,
    selected_size: defaultSize,
    selected_addon: defaultAddon,
    custom_measurement: "",
  };
}

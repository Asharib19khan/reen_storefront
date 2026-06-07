import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { ByreenHoverCard } from "@/components/byreen/ByreenHoverCard";
import { BrandHero } from "@/components/BrandHero";
import { LuxereenCarousel } from "@/components/LuxereenCarousel";
import { ShopCategoryChips } from "@/components/ShopCategoryChips";
import { ShopToolbar } from "@/components/ShopToolbar";
import { pickLatestBanner } from "@/lib/utils";
import { filterProducts, sortProducts, getUniqueCategories, type SortOption } from "@/lib/shop-utils";
import type { StoreProduct, ShopChip } from "@/lib/product-types";
import { getStorefrontSettings } from "@/lib/settings";

export const revalidate = 60;

const BYREEN_CHIPS: ShopChip[] = [
  { id: "new-arrivals", label: "New Arrival" },
  { id: "rings", label: "Rings" },
  { id: "bracelets-anklets", label: "Bracelets & Anklets" },
  { id: "earrings", label: "Earrings" },
  { id: "necklaces", label: "Necklaces" },
  { id: "bangles", label: "Bangles" },
  { id: "other-pieces", label: "Other Pieces" },
];

const LUXEREEN_CHIPS: ShopChip[] = [
  { id: "new-arrivals", label: "New Arrival" },
  { id: "corset-co-ord-sets", label: "Corset Co-ords" },
  { id: "solid-casual-two-piece-co-ords", label: "Two-Piece Sets" },
  { id: "fusion-printed-kurtis", label: "Fusion Kurtis" },
  { id: "traditional-fusion-coordinates", label: "Traditional Fusion" },
  { id: "western-fusion-skirt-outfits", label: "Western Fusion" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    brand?: string;
    sort?: string;
    category?: string;
    stock?: string;
    filter?: string;
    q?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const brand = resolvedParams.brand;
  const sort = (resolvedParams.sort as SortOption) || "newest";
  const categoryFilter = resolvedParams.category;
  const inStockOnly = resolvedParams.stock === "in";
  const newArrivalsOnly = resolvedParams.filter === "new";
  const searchQuery = resolvedParams.q;

  const { hideByreenXo, hideLuxereenWears } = await getStorefrontSettings();

  if (brand === "byreen_xo" && hideByreenXo) {
    redirect("/shop");
  }
  if (brand === "luxereen_wears" && hideLuxereenWears) {
    redirect("/shop");
  }

  const supabase = getSupabase();

  let desktopBannerTitle = null;
  let mobileBannerTitle = null;
  let displayTitle = "Shop All";

  if (brand === "byreen_xo") {
    desktopBannerTitle = "byreen.xo_page_hero_desktop";
    mobileBannerTitle = "byreen.xo_page_hero_mobile";
    displayTitle = "byreen.xo";
  } else if (brand === "luxereen_wears") {
    desktopBannerTitle = "luxereen.wears_page_hero_desktop";
    mobileBannerTitle = "luxereen.wears_page_hero_mobile";
    displayTitle = "luxereen.wears";
  }

  const { data: rawProducts } = supabase
    ? await (async () => {
        let query = supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (brand === "byreen_xo" || brand === "luxereen_wears") {
          query = query.eq("brand", brand);
        }
        return query;
      })()
    : { data: null };

  let products = (rawProducts || []) as StoreProduct[];
  products = filterProducts(products, {
    q: searchQuery,
    category: categoryFilter,
    inStockOnly,
    newArrivalsOnly,
  });
  products = sortProducts(products, sort);

  let desktopBanner = null;
  let mobileBanner = null;
  if (supabase && desktopBannerTitle && mobileBannerTitle) {
    const { data: bData } = await supabase
      .from("hero_banners")
      .select("*")
      .in("title", [desktopBannerTitle, mobileBannerTitle])
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    desktopBanner = pickLatestBanner(bData, desktopBannerTitle);
    mobileBanner = pickLatestBanner(bData, mobileBannerTitle);
  }

  const newArrivals = products.filter((p) => p.is_new_arrival);
  const rings = products.filter((p) => p.category === "Rings");
  const bracelets = products.filter((p) => p.category === "Bracelets & Anklets");
  const earrings = products.filter((p) => p.category === "Earrings");
  const necklaces = products.filter((p) => p.category === "Necklaces");
  const bangles = products.filter((p) => p.category === "Bangles (Churiyaan)");
  const corsets = products.filter((p) => p.category === "Corset Co-ord Sets");
  const solidSets = products.filter((p) => p.category === "Solid & Casual Two-Piece Co-ords");
  const fusionKurtis = products.filter((p) => p.category === "Fusion & Printed Kurtis");
  const traditionalFusion = products.filter((p) => p.category === "Traditional Fusion Coordinates");
  const westernFusion = products.filter(
    (p) => p.category === "Western-Fusion Styling & Skirt Outfits"
  );
  const otherPieces = products.filter(
    (p) => p.category === "Other" || !p.category || p.category === "Uncategorized"
  );

  const categories = getUniqueCategories((rawProducts || []) as StoreProduct[]);

  const toolbarQuery = new URLSearchParams();
  if (brand) toolbarQuery.set("brand", brand);
  if (searchQuery) toolbarQuery.set("q", searchQuery);
  if (resolvedParams.sort) toolbarQuery.set("sort", resolvedParams.sort);
  if (categoryFilter) toolbarQuery.set("category", categoryFilter);
  if (inStockOnly) toolbarQuery.set("stock", "in");
  if (newArrivalsOnly) toolbarQuery.set("filter", "new");
  const toolbarBase = toolbarQuery.toString() ? `/shop?${toolbarQuery}` : "/shop";

  const brandChips =
    brand === "byreen_xo" ? BYREEN_CHIPS : brand === "luxereen_wears" ? LUXEREEN_CHIPS : null;

  const hasBrandCarousel = brand === "luxereen_wears";

  const renderByreenSection = (title: string, items: StoreProduct[], id?: string) => {
    if (!items.length) return null;
    return (
      <div id={id} className="mb-20 pt-20 -mt-20 scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-serif mb-8 pb-4 border-b border-border/50 uppercase tracking-widest">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {items.map((product) => (
            <ByreenHoverCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <BrandHero desktopBanner={desktopBanner} mobileBanner={mobileBanner} title={displayTitle} />

      <div className="w-full py-8 max-w-7xl mx-auto px-4">
        {brandChips && (
          <Suspense fallback={null}>
            <ShopCategoryChips chips={brandChips} baseHref={toolbarBase} />
          </Suspense>
        )}

        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            Search results for &ldquo;{searchQuery}&rdquo; — {products.length} item
            {products.length !== 1 ? "s" : ""}
          </p>
        )}

        <Suspense fallback={null}>
          <ShopToolbar categories={categories} showCategoryFilter={!brand} />
        </Suspense>

        {!desktopBanner && !mobileBanner && !brand && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 uppercase tracking-widest">
              Shop All
            </h1>
          </div>
        )}

        {products.length > 0 ? (
          <>
            {brand === "luxereen_wears" && (
              <>
                <LuxereenCarousel title="New Arrival" products={newArrivals} id="new-arrivals" />
                <div className="luxereen-carousel-sections overflow-hidden">
                  <LuxereenCarousel title="Corset Co-ord Sets" products={corsets} id="corset-co-ord-sets" />
                  <LuxereenCarousel
                    title="Solid & Casual Two-Piece Co-ords"
                    products={solidSets}
                    id="solid-casual-two-piece-co-ords"
                  />
                  <LuxereenCarousel
                    title="Fusion & Printed Kurtis"
                    products={fusionKurtis}
                    id="fusion-printed-kurtis"
                  />
                  <LuxereenCarousel
                    title="Traditional Fusion Coordinates"
                    products={traditionalFusion}
                    id="traditional-fusion-coordinates"
                  />
                  <LuxereenCarousel
                    title="Western-Fusion & Skirt Outfits"
                    products={westernFusion}
                    id="western-fusion-skirt-outfits"
                  />
                </div>
              </>
            )}

            {brand === "byreen_xo" && (
              <>
                {renderByreenSection("New Arrivals", newArrivals, "new-arrivals")}
                {renderByreenSection("Rings", rings, "rings")}
                {renderByreenSection("Bracelets & Anklets", bracelets, "bracelets-anklets")}
                {renderByreenSection("Earrings", earrings, "earrings")}
                {renderByreenSection("Necklaces", necklaces, "necklaces")}
                {renderByreenSection("Bangles (Churiyaan)", bangles, "bangles")}
                {renderByreenSection("Other Pieces", otherPieces, "other-pieces")}
              </>
            )}

            {!hasBrandCarousel && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-muted/50 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No products match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

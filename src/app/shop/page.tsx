import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { BrandHero } from "@/components/BrandHero";
import Link from "next/link";
import { LuxereenCarousel } from "@/components/LuxereenCarousel";

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const resolvedParams = await searchParams;
  const brand = resolvedParams.brand;

  let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });

  let desktopBannerTitle = null;
  let mobileBannerTitle = null;
  let displayTitle = "Shop All";

  if (brand === "byreen_xo") {
    query = query.eq("brand", brand);
    desktopBannerTitle = "byreen.xo_page_hero_desktop";
    mobileBannerTitle = "byreen.xo_page_hero_mobile";
    displayTitle = "byreen.xo";
  } else if (brand === "luxereen_wears") {
    query = query.eq("brand", brand);
    desktopBannerTitle = "luxereen.wears_page_hero_desktop";
    mobileBannerTitle = "luxereen.wears_page_hero_mobile";
    displayTitle = "luxereen.wears";
  }

  const { data: products } = await query;

  let desktopBanner = null;
  let mobileBanner = null;
  if (desktopBannerTitle && mobileBannerTitle) {
    const { data: bData } = await supabase
      .from("hero_banners")
      .select("*")
      .in("title", [desktopBannerTitle, mobileBannerTitle])
      .eq("is_active", true);
    
    desktopBanner = bData?.find(b => b.title === desktopBannerTitle) || null;
    mobileBanner = bData?.find(b => b.title === mobileBannerTitle) || null;
  }

  // Grouping Logic
  const newArrivals = products?.filter(p => p.is_new_arrival) || [];
  
  // byreen.xo categories
  const rings = products?.filter(p => p.category === "Rings") || [];
  const bracelets = products?.filter(p => p.category === "Bracelets & Anklets") || [];
  const earrings = products?.filter(p => p.category === "Earrings") || [];
  const necklaces = products?.filter(p => p.category === "Necklaces") || [];
  const bangles = products?.filter(p => p.category === "Bangles (Churiyaan)") || [];

  // luxereen.wears categories
  const corsets = products?.filter(p => p.category === "Corset Co-ord Sets") || [];
  const solidSets = products?.filter(p => p.category === "Solid & Casual Two-Piece Co-ords") || [];
  const fusionKurtis = products?.filter(p => p.category === "Fusion & Printed Kurtis") || [];
  const traditionalFusion = products?.filter(p => p.category === "Traditional Fusion Coordinates") || [];
  const westernFusion = products?.filter(p => p.category === "Western-Fusion Styling & Skirt Outfits") || [];

  // Other fallback
  const others = products?.filter(p => p.category === "Other") || [];
  const uncategorized = products?.filter(p => (!p.category || p.category === "Uncategorized")) || [];

  const renderSection = (title: string, items: any[], id?: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div id={id} className="mb-20 pt-20 -mt-20"> {/* pt-20 -mt-20 accounts for sticky header offset */}
        <h2 className="text-2xl md:text-3xl font-serif mb-8 pb-4 border-b border-border/50 uppercase tracking-widest">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <BrandHero desktopBanner={desktopBanner} mobileBanner={mobileBanner} title={displayTitle} />
      
      <div className="w-full py-16 max-w-7xl mx-auto px-4">
        {(!desktopBanner && !mobileBanner && !brand) && (
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6 uppercase tracking-widest">Shop All</h1>
          </div>
        )}

        {products && products.length > 0 ? (
          <>
            {brand === "luxereen_wears" ? (
              <LuxereenCarousel title="New Arrivals" products={newArrivals} id="new-arrivals" />
            ) : (
              renderSection("New Arrivals", newArrivals, "new-arrivals")
            )}

            {brand === "byreen_xo" && (
              <>
                {renderSection("Rings", rings, "rings")}
                {renderSection("Bracelets & Anklets", bracelets, "bracelets-anklets")}
                {renderSection("Earrings", earrings, "earrings")}
                {renderSection("Necklaces", necklaces, "necklaces")}
                {renderSection("Bangles (Churiyaan)", bangles, "bangles")}
              </>
            )}

            {brand === "luxereen_wears" && (
              <div className="luxereen-carousel-sections overflow-hidden">
                <LuxereenCarousel title="Corset Co-ord Sets" products={corsets} id="corset-co-ord-sets" />
                <LuxereenCarousel title="Solid & Casual Two-Piece Co-ords" products={solidSets} id="solid-casual-two-piece-co-ords" />
                <LuxereenCarousel title="Fusion & Printed Kurtis" products={fusionKurtis} id="fusion-printed-kurtis" />
                <LuxereenCarousel title="Traditional Fusion Coordinates" products={traditionalFusion} id="traditional-fusion-coordinates" />
                <LuxereenCarousel title="Western-Fusion & Skirt Outfits" products={westernFusion} id="western-fusion-skirt-outfits" />
              </div>
            )}

            {/* Fallback for general "Shop All" or uncategorized items */}
            {(!brand) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.filter(p => !p.is_new_arrival).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {brand !== "luxereen_wears" && renderSection("Other Pieces", [...others, ...uncategorized])}
          </>
        ) : (
          <div className="text-center py-20 bg-muted/50 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No products found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

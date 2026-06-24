import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { ByreenHoverCard } from "@/components/byreen/ByreenHoverCard";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { AnimatedProductGrid } from "@/components/AnimatedProductGrid";
import { pickLatestBanner } from "@/lib/utils";
import { getStorefrontSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function Home() {
  const supabase = getSupabase();
  const empty = { data: null as null };
  const { hideByreenXo, hideLuxereenWears } = await getStorefrontSettings();

  const [
    { data: bestSelling },
    { data: newArrivals },
    { data: byreenFeatured },
    { data: luxereenFeatured },
    { data: banners },
    { data: reviews }
  ] = supabase
    ? await Promise.all([
        supabase.from("products").select("*").eq("is_active", true).eq("is_best_selling", true).limit(4),
        supabase.from("products").select("*").eq("is_active", true).eq("is_new_arrival", true).limit(4),
        hideByreenXo ? Promise.resolve(empty) : supabase.from("products").select("*").eq("is_active", true).eq("brand", "byreen_xo").limit(3),
        hideLuxereenWears ? Promise.resolve(empty) : supabase.from("products").select("*").eq("is_active", true).eq("brand", "luxereen_wears").limit(3),
        supabase.from("hero_banners").select("*").in("title", ["Home_page_hero_desktop", "Home_page_hero_mobile"]).eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("customer_reviews").select("*").eq("is_approved", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(3),
      ])
    : [empty, empty, empty, empty, empty, empty];

  const desktopBanner = pickLatestBanner(banners, "Home_page_hero_desktop");
  const mobileBanner = pickLatestBanner(banners, "Home_page_hero_mobile");

  return (
    <div className="flex flex-col w-full -mt-[112px]">
      {/* Hero Section */}
      <section className="relative w-full border-b border-border/30">
        <HeroCarousel desktopBanner={desktopBanner} mobileBanner={mobileBanner} />
      </section>

      {/* Best Selling Section */}
      {bestSelling && bestSelling.length > 0 && (
        <section id="best-selling" className="py-12 md:py-16 bg-background w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 border-b border-border/30 pb-6 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight">Best Selling</h2>
                <p className="text-muted-foreground mt-3 font-sans uppercase tracking-widest text-xs">Our most loved signature pieces.</p>
              </div>
              <Link href="/shop" className="text-primary font-medium hover:underline text-sm uppercase tracking-widest transition-colors">Shop All &rarr;</Link>
            </div>
            <AnimatedProductGrid>
              <div className="columns-2 md:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                {bestSelling.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0 break-inside-avoid mb-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {!hideByreenXo && byreenFeatured && byreenFeatured.length > 0 && (
        <section id="byreen-xo-featured" className="py-12 md:py-16 bg-muted/30 w-full border-y border-border/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
              <div>
                <h2 className="text-5xl md:text-6xl font-serif text-foreground">byreen.xo</h2>
                <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
                  Curated premium jewelry. From seamless permanent bracelets to elegant daily-wear chains
                  and traditional jhumkas.
                </p>
              </div>
              <Link href="/shop?brand=byreen_xo">
                <Button variant="outline" className="rounded-full uppercase tracking-widest text-xs px-10 h-12 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                  Explore byreen.xo
                </Button>
              </Link>
            </div>
            <AnimatedProductGrid>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {byreenFeatured.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0 w-full max-w-[20rem]">
                    <ByreenHoverCard product={product} />
                  </div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {!hideLuxereenWears && luxereenFeatured && luxereenFeatured.length > 0 && (
        <section id="luxereen-wears-featured" className="py-12 md:py-16 bg-background w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
              <div>
                <h2 className="text-5xl md:text-6xl font-serif text-foreground">luxereen.wears</h2>
                <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
                  The clothing collective. Discover signature corset co-ords, modern printed kurtis, and
                  elegant traditional fusion wear.
                </p>
              </div>
              <Link href="/shop?brand=luxereen_wears">
                <Button variant="outline" className="rounded-full uppercase tracking-widest text-xs px-10 h-12 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                  Explore luxereen.wears
                </Button>
              </Link>
            </div>
            <AnimatedProductGrid>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {luxereenFeatured.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals && newArrivals.length > 0 && (
        <section id="new-arrival" className="py-12 md:py-16 bg-muted/10 w-full border-t border-border/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-foreground">New Arrivals</h2>
              <p className="text-muted-foreground mt-3 font-sans uppercase tracking-widest text-xs">Fresh drops for the season.</p>
              <div className="w-12 h-[2px] bg-primary mx-auto mt-8"></div>
            </div>
            <AnimatedProductGrid>
              <div className="columns-2 md:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                {newArrivals.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0 break-inside-avoid mb-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {reviews && reviews.length > 0 && (
        <section id="reviews" className="py-16 md:py-24 bg-[#1A1517] text-white w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-serif mb-12 text-white/90">Loved by our clients</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {reviews.map((review) => (
                <div key={review.id} className="flex flex-col items-center space-y-4">
                  <div className="text-primary text-2xl">
                    {Array(review.rating).fill('★').join('')}
                    {Array(5 - review.rating).fill('☆').join('')}
                  </div>
                  <p className="text-background/80 italic">"{review.review_text}"</p>
                  <p className="font-semibold uppercase tracking-widest text-sm">— {review.customer_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

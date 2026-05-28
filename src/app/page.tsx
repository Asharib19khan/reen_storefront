import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { AnimatedProductGrid } from "@/components/AnimatedProductGrid";

export const revalidate = 60;

export default async function Home() {
  // Fetch everything in parallel for maximum speed
  const [
    { data: bestSelling },
    { data: newArrivals },
    { data: byreenFeatured },
    { data: luxereenFeatured },
    { data: banners },
    { data: reviews }
  ] = await Promise.all([
    supabase.from("products").select("*").eq("is_active", true).eq("is_best_selling", true).limit(4),
    supabase.from("products").select("*").eq("is_active", true).eq("is_new_arrival", true).limit(4),
    supabase.from("products").select("*").eq("is_active", true).eq("brand", "byreen_xo").limit(3),
    supabase.from("products").select("*").eq("is_active", true).eq("brand", "luxereen_wears").limit(3),
    supabase.from("hero_banners").select("*").in("title", ["Home_page_hero_desktop", "Home_page_hero_mobile"]).eq("is_active", true),
    supabase.from("customer_reviews").select("*").eq("is_approved", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(3)
  ]);

  const desktopBanner = banners?.find(b => b.title === "Home_page_hero_desktop") || null;
  const mobileBanner = banners?.find(b => b.title === "Home_page_hero_mobile") || null;

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full border-b border-border/50">
        <HeroCarousel desktopBanner={desktopBanner} mobileBanner={mobileBanner} />
      </section>

      {/* Best Selling Section */}
      {bestSelling && bestSelling.length > 0 && (
        <section id="best-selling" className="py-20 bg-background w-full">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10 border-b border-border/50 pb-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest">Best Selling</h2>
                <p className="text-muted-foreground mt-2">Our most loved signature pieces.</p>
              </div>
              <Link href="/shop" className="hidden md:block text-primary font-medium hover:underline text-sm uppercase tracking-widest">Shop All &rarr;</Link>
            </div>
            <AnimatedProductGrid>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {bestSelling.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0"><ProductCard product={product} /></div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {/* byreen.xo Featured Section */}
      {byreenFeatured && byreenFeatured.length > 0 && (
        <section id="byreen-xo-featured" className="py-20 bg-muted/20 w-full border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-serif text-foreground">byreen.xo</h2>
                <p className="text-muted-foreground mt-2 max-w-xl">Curated premium jewelry. From seamless permanent bracelets to elegant daily-wear chains and traditional jhumkas.</p>
              </div>
              <Link href="/shop?brand=byreen_xo">
                <Button variant="outline" className="rounded-full uppercase tracking-widest text-xs px-8">Explore byreen.xo</Button>
              </Link>
            </div>
            <AnimatedProductGrid>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {byreenFeatured.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0"><ProductCard product={product} /></div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {/* luxereen.wears Featured Section */}
      {luxereenFeatured && luxereenFeatured.length > 0 && (
        <section id="luxereen-wears-featured" className="py-20 bg-background w-full">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-serif text-foreground">luxereen.wears</h2>
                <p className="text-muted-foreground mt-2 max-w-xl">The clothing collective. Discover signature corset co-ords, modern printed kurtis, and elegant traditional fusion wear.</p>
              </div>
              <Link href="/shop?brand=luxereen_wears">
                <Button variant="outline" className="rounded-full uppercase tracking-widest text-xs px-8">Explore luxereen.wears</Button>
              </Link>
            </div>
            <AnimatedProductGrid>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {luxereenFeatured.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0"><ProductCard product={product} /></div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals && newArrivals.length > 0 && (
        <section id="new-arrival" className="py-20 bg-muted/10 w-full border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest">New Arrivals</h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
            </div>
            <AnimatedProductGrid>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <div key={product.id} className="product-card-anim opacity-0"><ProductCard product={product} /></div>
                ))}
              </div>
            </AnimatedProductGrid>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {reviews && reviews.length > 0 && (
        <section id="reviews" className="py-24 bg-foreground text-background w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-serif mb-16">Loved by our clients</h2>
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

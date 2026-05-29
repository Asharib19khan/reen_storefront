import { Suspense } from "react";
import { ByreenShopShell } from "./ByreenShopShell";
import { ByreenBrandHero } from "./ByreenBrandHero";
import { ByreenShopControls } from "./ByreenShopControls";
import { ByreenProductPin, type ByreenProduct } from "./ByreenProductPin";

interface Banner {
  id: string;
  title: string;
  media_url: string;
  media_type: "image" | "video";
}

export function ByreenShopView({
  desktopBanner,
  mobileBanner,
  products,
  categories,
  searchQuery,
}: {
  desktopBanner: Banner | null;
  mobileBanner: Banner | null;
  products: ByreenProduct[];
  categories: string[];
  searchQuery?: string;
}) {
  return (
    <ByreenShopShell>
      <ByreenBrandHero desktopBanner={desktopBanner} mobileBanner={mobileBanner} />

      <div className="max-w-7xl mx-auto px-4 pb-16 w-full">
        <Suspense fallback={null}>
          <ByreenShopControls categories={categories} />
        </Suspense>

        {searchQuery && (
          <p className="text-sm text-[#9d174d]/90 mb-6 text-center">
            Results for &ldquo;{searchQuery}&rdquo; · {products.length} piece
            {products.length !== 1 ? "s" : ""}
          </p>
        )}

        {products.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-[#fbcfe8] bg-white/50">
            <p className="byreen-section-title text-2xl text-[#831843] mb-2">Nothing here yet</p>
            <p className="text-[#9d174d]/80 text-sm">
              Try another category or follow @byreen.xo for new drops ✨
            </p>
          </div>
        ) : (
          <div className="byreen-masonry">
            {products.map((product, i) => (
              <ByreenProductPin key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </ByreenShopShell>
  );
}

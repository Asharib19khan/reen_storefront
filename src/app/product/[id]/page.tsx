import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./AddToCartButton";
import { ImageGallery } from "./ImageGallery";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WishlistButton } from "@/components/WishlistButton";
import { ProductTrustBlock } from "@/components/ProductTrustBlock";
import { RelatedProducts } from "@/components/RelatedProducts";
import { MobileStickyAddToCart } from "@/components/MobileStickyAddToCart";
import type { StoreProduct } from "@/lib/product-types";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = getSupabase();

  const { data: product } = supabase
    ? await supabase.from("products").select("*").eq("id", resolvedParams.id).single()
    : { data: null };

  if (!product || !product.is_active) {
    notFound();
  }

  let relatedProducts: StoreProduct[] = [];
  if (supabase) {
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("brand", product.brand)
      .neq("id", product.id)
      .limit(4);

    relatedProducts = (related || []) as StoreProduct[];

    if (relatedProducts.length < 4 && product.category) {
      const { data: byCategory } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("category", product.category)
        .neq("id", product.id)
        .limit(4 - relatedProducts.length);

      const ids = new Set(relatedProducts.map((p) => p.id));
      (byCategory || []).forEach((p) => {
        if (!ids.has(p.id)) relatedProducts.push(p as StoreProduct);
      });
    }
  }

  const isSoldOut = product.quantity === 0;

  return (
    <div className="w-full bg-background min-h-screen pb-24 md:pb-10">
      {product.hero_image_concept && (
        <div className="w-full h-[40vh] md:h-[600px] bg-muted relative mb-10 overflow-hidden">
          {product.hero_image_concept.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.hero_image_concept} alt="Hero Concept" className="w-full h-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_urls[0]} alt="Hero Image" className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 md:p-16 text-white max-w-4xl">
              <Badge variant="secondary" className="mb-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none">
                {product.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-serif tracking-wide">{product.title}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="flex flex-col gap-8 md:sticky md:top-24">
            {!product.hero_image_concept && (
              <ImageGallery images={product.image_urls} title={product.title} />
            )}

            {product.hero_image_concept && (
              <div className="grid grid-cols-2 gap-4">
                {product.image_urls.map((url: string, idx: number) => (
                  <div key={idx} className="aspect-[3/4] bg-muted overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${product.title} - view ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            )}

            {product.video_url && (
              <div className="w-full aspect-video bg-muted rounded-xl overflow-hidden relative group border">
                {product.video_url.includes("youtube") || product.video_url.includes("vimeo") ? (
                  <iframe src={product.video_url} className="w-full h-full" allowFullScreen title="Product video" />
                ) : (
                  <video src={product.video_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                )}
              </div>
            )}

            {product.view_360_url && (
              <div className="w-full aspect-square bg-muted rounded-xl overflow-hidden border p-2">
                <iframe src={product.view_360_url} className="w-full h-full border-0" title="360 View" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {!product.hero_image_concept && (
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4">
                  {product.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif">{product.title}</h1>
                <p className="text-2xl font-semibold text-primary">Rs. {product.price}</p>
              </div>
            )}

            {product.hero_image_concept && (
              <div className="mb-6">
                <p className="text-3xl font-semibold text-primary">Rs. {product.price}</p>
              </div>
            )}

            <ProductTrustBlock />

            {product.hook_text && (
              <p className="text-lg md:text-xl font-medium text-foreground mb-6 italic border-l-4 border-primary pl-4 leading-relaxed">
                {product.hook_text}
              </p>
            )}

            {product.deep_dive_description ? (
              <div className="prose prose-sm text-muted-foreground mb-10">
                <p className="whitespace-pre-wrap leading-relaxed">{product.deep_dive_description}</p>
              </div>
            ) : (
              <div className="prose prose-sm text-muted-foreground mb-10">
                <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="bg-muted/30 p-6 rounded-xl border border-border/50 mb-10">
              {isSoldOut ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-destructive/10 text-destructive font-medium p-4 rounded-md w-full">
                    This signature piece is currently sold out.
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Save it to your wishlist so we can follow up when it&apos;s available again.
                  </p>
                  <WishlistButton
                    product={{
                      id: String(product.id),
                      title: product.title,
                      price: product.price,
                      brand: product.brand,
                      image_urls: product.image_urls,
                    }}
                  />
                </div>
              ) : (
                <AddToCartButton product={product} />
              )}
            </div>

            <Accordion type="single" collapsible className="w-full border-t border-border">
              {product.fabric_care && (
                <AccordionItem value="fabric-care">
                  <AccordionTrigger className="text-base font-semibold">Fabric & Care Guide</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground prose prose-sm whitespace-pre-wrap">
                    {product.fabric_care}
                  </AccordionContent>
                </AccordionItem>
              )}

              {product.sizing_note && (
                <AccordionItem value="sizing-note">
                  <AccordionTrigger className="text-base font-semibold">Sizing Note & Fit Guide</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground prose prose-sm whitespace-pre-wrap">
                    {product.sizing_note}
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="shipping">
                <AccordionTrigger className="text-base font-semibold">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-muted-foreground prose prose-sm">
                  We offer nationwide shipping across Pakistan. Standard delivery takes 3-5 business days.
                  Due to the bespoke nature of our pieces, all custom-measured items are non-refundable.
                  Standard sizes may be exchanged within 7 days of delivery with tags attached.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts.slice(0, 4)} />

      {!isSoldOut && (
        <MobileStickyAddToCart
          product={{
            id: String(product.id),
            title: product.title,
            price: product.price,
            brand: product.brand,
            quantity: product.quantity,
            image_urls: product.image_urls,
          }}
        />
      )}
    </div>
  );
}

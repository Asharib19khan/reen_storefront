"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "@/components/WishlistButton";
import { QuickViewModal } from "@/components/QuickViewModal";
import type { StoreProduct } from "@/lib/product-types";

interface ProductCardProps {
  product: StoreProduct;
  enableQuickView?: boolean;
}

export function ProductCard({ product, enableQuickView = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const isSoldOut = product.quantity === 0;
  const imageUrl = product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens";

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-2 hover:border-primary/30 h-full">
        <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-muted/40 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.title}
            className="object-cover w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit bg-white/90 text-[10px] uppercase tracking-widest text-primary shadow-sm backdrop-blur-md rounded-full px-3 py-1">
              {product.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
            </Badge>
            {isSoldOut && (
              <Badge variant="destructive" className="w-fit rounded-full px-3 py-1 uppercase tracking-widest text-[10px] shadow-sm">Sold Out</Badge>
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <WishlistButton product={product} size="sm" />
            {enableQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewProduct(product);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/90 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6 z-10 bg-gradient-to-t from-card/80 to-transparent">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-serif font-medium text-lg md:text-xl line-clamp-1 group-hover:text-primary transition-colors duration-500">
                {product.title}
              </h3>
            </Link>
            <span className="font-medium text-primary ml-2 shrink-0 text-lg">Rs. {product.price}</span>
          </div>
          <p className="text-sm text-muted-foreground/80 mb-6 line-clamp-1">{product.category}</p>

          <div className="mt-auto overflow-hidden">
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <Button
                className="w-full h-12 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl"
                disabled={isSoldOut}
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    product_id: product.id,
                    title: product.title,
                    price: product.price,
                    brand: product.brand,
                    quantity: 1,
                    image_url: imageUrl,
                  });
                }}
              >
                {isSoldOut ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

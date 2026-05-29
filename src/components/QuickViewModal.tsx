"use client";

import Link from "next/link";
import { X, ShoppingCart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "@/components/WishlistButton";
import type { StoreProduct } from "@/lib/product-types";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: StoreProduct | null;
  onClose: () => void;
}) {
  const { addToCart } = useCart();

  if (!product) return null;

  const imageUrl = product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens";
  const isSoldOut = product.quantity === 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-background shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/90 border hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square md:aspect-auto bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <Badge variant="secondary" className="w-fit mb-3 text-[10px] uppercase tracking-widest">
              {product.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
            </Badge>
            <h2 className="text-2xl font-serif font-semibold mb-2">{product.title}</h2>
            <p className="text-xl text-primary font-semibold mb-2">Rs. {product.price}</p>
            {product.category && (
              <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
            )}
            {product.hook_text && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 italic">{product.hook_text}</p>
            )}
            <div className="mt-auto flex flex-col gap-3 pt-4">
              <Button
                disabled={isSoldOut}
                onClick={() => {
                  addToCart({
                    product_id: product.id,
                    title: product.title,
                    price: Number(product.price),
                    brand: product.brand,
                    quantity: 1,
                    image_url: imageUrl,
                  });
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isSoldOut ? "Out of Stock" : "Add to Cart"}
              </Button>
              <div className="flex gap-3">
                <Link href={`/product/${product.id}`} className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Details
                  </Button>
                </Link>
                <WishlistButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

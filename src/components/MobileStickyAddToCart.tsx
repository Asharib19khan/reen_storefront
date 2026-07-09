"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

import type { StoreProduct } from "@/lib/product-types";
import Image from "next/image";

export function MobileStickyAddToCart({
  product,
}: {
  product: StoreProduct;
}) {
  const { addToCart, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const isSoldOut = product.quantity === 0;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isSoldOut) return null;

  const hasVariants = 
    Boolean(product.color_options) || 
    Boolean(product.size_matrix) || 
    Boolean(product.interactive_addons) || 
    product.has_custom_measurement;

  const imageUrl = product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens";

  return (
    <div className={`fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-20 opacity-0 pointer-events-none'} 
      md:bottom-8 md:right-8 md:left-auto md:w-[380px] md:rounded-none md:border md:border-border/50 md:shadow-2xl md:p-6
      bottom-0 left-0 right-0 w-full rounded-none border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4
      bg-background/95 backdrop-blur-xl`}
    >
      <div className="flex items-center gap-4">
        <Image src={imageUrl} alt={product.title} width={64} height={64} className="hidden md:block object-cover bg-muted" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">{product.title}</p>
          <p className="text-primary font-bold text-sm tracking-wide mt-1">Rs. {product.price}</p>
        </div>
        <Button
          size="lg"
          className="shrink-0 rounded-none px-6 font-semibold tracking-wider text-xs uppercase h-12"
          onClick={() => {
            if (hasVariants) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              addToCart({
                product_id: String(product.id),
                title: product.title,
                price: Number(product.price),
                brand: product.brand,
                quantity: 1,
                image_url: imageUrl,
              });
              openCart();
            }
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {hasVariants ? "Select Options" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

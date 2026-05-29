"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export function MobileStickyAddToCart({
  product,
}: {
  product: {
    id: string;
    title: string;
    price: number;
    brand: string;
    quantity: number;
    image_urls: string[] | null;
  };
}) {
  const { addToCart, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const isSoldOut = product.quantity === 0;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isSoldOut || !visible) return null;

  const imageUrl = product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">{product.title}</p>
          <p className="text-primary font-semibold text-sm">Rs. {product.price}</p>
        </div>
        <Button
          size="lg"
          className="shrink-0 rounded-full px-6"
          onClick={() => {
            addToCart({
              product_id: String(product.id),
              title: product.title,
              price: Number(product.price),
              brand: product.brand,
              quantity: 1,
              image_url: imageUrl,
            });
            openCart();
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

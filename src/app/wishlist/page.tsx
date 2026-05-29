"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Tap the heart on any product to save it here. We&apos;ll keep your picks for next time.
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">Browse Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card shadow-sm"
          >
            <Link href={`/product/${item.product_id}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="h-32 w-32 sm:h-24 sm:w-24 object-cover rounded-lg border"
              />
            </Link>
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">
                  {item.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
                </Badge>
              </div>
              <Link href={`/product/${item.product_id}`}>
                <h2 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h2>
              </Link>
              <p className="text-primary font-medium mt-1">Rs. {item.price}</p>
            </div>
            <div className="flex sm:flex-col gap-2 sm:justify-center shrink-0">
              <Button
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() =>
                  addToCart({
                    product_id: item.product_id,
                    title: item.title,
                    price: item.price,
                    brand: item.brand,
                    quantity: 1,
                    image_url: item.image_url,
                  })
                }
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => removeFromWishlist(item.product_id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

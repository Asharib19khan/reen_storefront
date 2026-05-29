"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    brand: string;
    image_urls?: string[] | null;
  };
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ product, className, size = "md" }: WishlistButtonProps) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isWishlisted(String(product.id));
  const imageUrl =
    product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens";

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = String(product.id);

    if (wishlisted) {
      await removeFromWishlist(productId);
      return;
    }

    await addToWishlist({
      product_id: productId,
      title: product.title,
      price: Number(product.price) || 0,
      brand: product.brand,
      image_url: imageUrl,
    });
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border bg-background/90 backdrop-blur-sm shadow-sm transition-all hover:scale-105 hover:shadow-md",
        buttonSize,
        wishlisted && "border-primary bg-primary/10 text-primary",
        className
      )}
    >
      <Heart className={cn(iconSize, wishlisted && "fill-current")} />
    </button>
  );
}

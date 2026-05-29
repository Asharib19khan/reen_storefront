"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "@/components/WishlistButton";
import { cn } from "@/lib/utils";

export type ByreenProduct = {
  id: string;
  title: string;
  price: number;
  image_urls: string[];
  quantity: number;
  brand: "byreen_xo" | "luxereen_wears";
  category: string;
};

const aspectClasses = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[2/3]",
  "aspect-[5/7]",
] as const;

export function ByreenProductPin({
  product,
  index = 0,
}: {
  product: ByreenProduct;
  index?: number;
}) {
  const { addToCart } = useCart();
  const isSoldOut = product.quantity === 0;
  const imageUrl =
    product.image_urls?.[0] || "https://placehold.co/600x800/fbcfe8/831843?text=byreen.xo";
  const aspect = aspectClasses[index % aspectClasses.length];

  return (
    <article className="byreen-masonry-item">
      <div className="byreen-pin group relative overflow-hidden rounded-[1.25rem]">
        <Link href={`/product/${product.id}`} className="block">
          <div className={cn("relative overflow-hidden bg-[#fce7f3]", aspect)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#4a044e]/75 via-[#4a044e]/10 to-transparent" />

            <div className="absolute top-2.5 right-2.5 z-10">
              <WishlistButton
                product={{ ...product, brand: "byreen_xo" }}
                size="sm"
                className="bg-white/95 shadow-sm border-0 hover:bg-white h-8 w-8"
              />
            </div>

            {isSoldOut && (
              <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#9d174d]">
                Sold out
              </span>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
              <p className="text-white/90 text-[10px] uppercase tracking-widest mb-0.5 line-clamp-1">
                {product.category || "byreen.xo"}
              </p>
              <p className="text-white text-sm font-medium leading-snug line-clamp-2 byreen-section-title">
                {product.title}
              </p>
              <p className="text-[#fbcfe8] text-sm font-semibold mt-1">Rs. {product.price}</p>
            </div>
          </div>
        </Link>

        {!isSoldOut && (
          <button
            type="button"
            aria-label="Add to bag"
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                product_id: product.id,
                title: product.title,
                price: product.price,
                brand: "byreen_xo",
                quantity: 1,
                image_url: imageUrl,
              });
            }}
            className="absolute bottom-3 right-3 z-20 h-9 w-9 rounded-full bg-white text-[#be185d] shadow-lg flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#be185d] hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        )}
      </div>
    </article>
  );
}

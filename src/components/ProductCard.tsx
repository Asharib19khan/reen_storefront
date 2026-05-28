"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image_urls: string[];
    quantity: number;
    brand: "byreen_xo" | "luxereen_wears";
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isSoldOut = product.quantity === 0;
  const imageUrl = product.image_urls?.[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 shadow-sm transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/20 h-full">
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-muted/30 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit bg-white/90 text-[10px] uppercase tracking-widest text-primary shadow-sm backdrop-blur-md rounded-full px-3 py-1">
            {product.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
          </Badge>
          {isSoldOut && (
            <Badge variant="destructive" className="w-fit rounded-full px-3 py-1 uppercase tracking-widest text-[10px]">Sold Out</Badge>
          )}
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.title}
            </h3>
          </Link>
          <span className="font-medium text-primary ml-2 shrink-0 text-lg">Rs. {product.price}</span>
        </div>
        <p className="text-sm text-muted-foreground/80 mb-6 line-clamp-1">{product.category}</p>
        
        <div className="mt-auto">
          <Button 
            className="w-full h-12 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5" 
            disabled={isSoldOut}
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                product_id: product.id,
                title: product.title,
                price: product.price,
                brand: product.brand,
                quantity: 1,
                image_url: imageUrl
              });
            }}
          >
            {isSoldOut ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import type { StoreProduct } from "@/lib/product-types";
import { buildCartPayload } from "@/lib/shop-utils";
import "./ByreenHoverCard.css";

export function ByreenHoverCard({ product }: { product: StoreProduct }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isSoldOut = product.quantity === 0;
  const imageUrl =
    product.image_urls?.[0] || "https://placehold.co/600x900/fbcfe8/831843?text=byreen.xo";
  const description =
    product.hook_text?.trim() ||
    product.category?.trim() ||
    "byreen.xo — modern minimals & permanent jewellery";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSoldOut) return;
    addToCart(buildCartPayload(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="byreen-hover-card group">
      <Link href={`/product/${product.id}`} className="byreen-hover-card__image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={product.title} className="byreen-hover-card__image" />
      </Link>

      <section className="byreen-hover-card__section">
        <Link href={`/product/${product.id}`}>
          <h2 className="byreen-hover-card__title">{product.title}</h2>
        </Link>
        <p className="byreen-hover-card__desc">{description}</p>
        <div className="byreen-hover-card__footer">
          <div className="byreen-hover-card__tag">Rs. {product.price}</div>
          <button
            type="button"
            className={`byreen-hover-card__btn${added ? " byreen-hover-card__btn--added" : ""}`}
            disabled={isSoldOut}
            onClick={handleAdd}
          >
            {isSoldOut ? "Sold out" : added ? "Added" : "Add to bag"}
          </button>
        </div>
      </section>
    </article>
  );
}

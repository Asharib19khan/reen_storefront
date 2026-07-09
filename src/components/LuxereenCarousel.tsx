"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import "./LuxereenCarousel.css";

type Product = {
  id: string | number;
  title: string;
  price?: number | string | null;
  quantity?: number | string | null;
  brand?: string | null;
  image_urls?: string[] | null;
  color_options?: string | null;
  size_matrix?: string | null;
  interactive_addons?: string | null;
};

type CarouselSlide = {
  product: Product;
  key: string;
  isActive: boolean;
};

const REFERENCE_LAYOUT_MIN = 5;

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    const id = String(product.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function buildCarouselSlides(products: Product[]): { slides: CarouselSlide[]; isCompact: boolean } {
  const unique = dedupeProducts(products);
  if (!unique.length) return { slides: [], isCompact: true };

  const isCompact = unique.length < REFERENCE_LAYOUT_MIN;

  if (isCompact) {
    return {
      isCompact: true,
      slides: unique.map((product, idx) => ({
        product,
        key: String(product.id),
        isActive: idx === 0,
      })),
    };
  }

  const featured = unique[0];
  let ordered = [...unique];
  const activeIndex = 4;
  const featuredIndex = ordered.findIndex((product) => product.id === featured.id);
  const rotateBy = (featuredIndex - activeIndex + ordered.length) % ordered.length;
  ordered = [...ordered.slice(rotateBy), ...ordered.slice(0, rotateBy)];

  return {
    isCompact: false,
    slides: ordered.map((product, idx) => ({
      product,
      key: String(product.id),
      isActive: idx === activeIndex,
    })),
  };
}

function buildCartPayload(product: Product) {
  const defaultColor = product.color_options ? product.color_options.split(",")[0].trim() : "";
  const defaultSize = product.size_matrix ? product.size_matrix.split(",")[0].trim() : "";
  const defaultAddon = product.interactive_addons ? product.interactive_addons.split(",")[0].trim() : "";
  const priceValue = Number(product.price) || 0;

  return {
    product_id: String(product.id),
    title: product.title,
    price: priceValue,
    brand: product.brand || "luxereen_wears",
    image_url: product.image_urls?.[0] || "",
    quantity: 1,
    selected_color: defaultColor,
    selected_size: defaultSize,
    selected_addon: defaultAddon,
    custom_measurement: "",
  };
}

function isInteractiveTarget(target: EventTarget | null) {
  return Boolean((target as HTMLElement | null)?.closest("a, button, input, textarea, select, label"));
}

const CarouselInstance = memo(function CarouselInstance({
  slides,
  isCompact,
  onAddToCartRef,
}: {
  slides: CarouselSlide[];
  isCompact: boolean;
  onAddToCartRef: React.RefObject<(product: Product) => void>;
}) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauserRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompactRef = useRef(isCompact);
  isCompactRef.current = isCompact;

  const getSlides = useCallback(() => Array.from(listRef.current?.querySelectorAll(".carousel__item") || []), []);

  const getSlideIndex = useCallback(
    ($slide: Element | null) => {
      if (!$slide) return -1;
      return getSlides().indexOf($slide as HTMLElement);
    },
    [getSlides]
  );

  const getActiveIndex = useCallback(() => {
    const $active = listRef.current?.querySelector("[data-active]") || null;
    return getSlideIndex($active);
  }, [getSlideIndex]);

  const activateSlide = useCallback(
    ($slide: Element | null) => {
      if (!$slide) return;
      const $slides = getSlides();
      $slides.forEach((el) => el.removeAttribute("data-active"));
      $slide.setAttribute("data-active", "true");
      ($slide as HTMLElement).focus({ preventScroll: true });
    },
    [getSlides]
  );

  const prevSlide = useCallback(() => {
    const $slides = getSlides();
    if (!$slides.length) return;

    if (isCompactRef.current) {
      const index = getActiveIndex();
      const nextIndex = (index - 1 + $slides.length) % $slides.length;
      activateSlide($slides[nextIndex]);
      return;
    }

    const index = getActiveIndex();
    const $last = $slides[$slides.length - 1];
    if (!$last || !listRef.current) return;
    $last.remove();
    listRef.current.prepend($last);
    activateSlide(getSlides()[index]);
  }, [activateSlide, getActiveIndex, getSlides]);

  const nextSlide = useCallback(() => {
    const $slides = getSlides();
    if (!$slides.length) return;

    if (isCompactRef.current) {
      const index = getActiveIndex();
      const nextIndex = (index + 1) % $slides.length;
      activateSlide($slides[nextIndex]);
      return;
    }

    const index = getActiveIndex();
    const $first = $slides[0];
    if (!$first || !listRef.current) return;
    $first.remove();
    listRef.current.append($first);
    activateSlide(getSlides()[index]);
  }, [activateSlide, getActiveIndex, getSlides]);

  const pauseAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (pauserRef.current) clearTimeout(pauserRef.current);
  }, []);

  const startAuto = useCallback(() => {
    pauseAuto();
    if (isCompactRef.current && slides.length < 2) return;
    autoRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  }, [nextSlide, pauseAuto, slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    startAuto();
    return () => {
      pauseAuto();
    };
  }, [pauseAuto, slides.length, startAuto]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const chooseSlide = (e: Event) => {
      if (isCompactRef.current) return;

      const target = e.target as HTMLElement | null;
      if (isInteractiveTarget(target)) return;

      const $slide = target?.closest(".carousel__item") || null;
      if (!$slide) return;

      const max = window.matchMedia("screen and ( max-width: 600px)").matches ? 5 : 8;
      const index = getSlideIndex($slide);
      if (index < 3 || index > max) return;
      if (index === max) nextSlide();
      if (index === 3) prevSlide();
      activateSlide($slide);
    };

    const handleSlideFocus = (e: FocusEvent) => {
      if (isCompactRef.current) return;
      if (isInteractiveTarget(e.target)) return;
      pauseAuto();
      chooseSlide(e);
    };

    const handleSlideKey = (e: KeyboardEvent) => {
      if (isInteractiveTarget(e.target)) return;

      switch (e.keyCode) {
        case 37:
        case 65:
          e.preventDefault();
          pauseAuto();
          prevSlide();
          break;
        case 39:
        case 68:
          e.preventDefault();
          pauseAuto();
          nextSlide();
          break;
      }
    };

    list.addEventListener("focusin", handleSlideFocus);
    list.addEventListener("keyup", handleSlideKey);

    return () => {
      list.removeEventListener("focusin", handleSlideFocus);
      list.removeEventListener("keyup", handleSlideKey);
    };
  }, [activateSlide, getSlideIndex, nextSlide, pauseAuto, prevSlide]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slide = e.currentTarget.closest(".carousel__item");
    if (slide && !slide.hasAttribute("data-active")) {
      e.preventDefault();
      pauseAuto();
      activateSlide(slide);
      return;
    }
    pauseAuto();
  };

  const handleProductNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    pauseAuto();
  };

  const handleAddToCartClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const quantity = Number(product.quantity);
    const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
    if (isSoldOut) return;
    onAddToCartRef.current?.(product);
  };

  return (
    <section className={`carousel${isCompact ? " carousel--compact" : ""}`}>
      <ul className="carousel__list" ref={listRef} data-slide-count={slides.length}>
        {slides.map(({ product, key, isActive }) => {
          const imageUrl = product.image_urls?.[0];
          const quantity = Number(product.quantity);
          const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
          const priceValue = Number(product.price);
          const hasPrice = Number.isFinite(priceValue) && priceValue >= 0;
          const productHref = `/product/${product.id}`;

          return (
            <li
              key={key}
              className="carousel__item"
              data-active={isActive ? "true" : undefined}
              tabIndex={-1}
            >
              <Link
                href={productHref}
                className="carousel__image-link relative"
                aria-label={`View ${product.title}`}
                onClick={handleImageClick}
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt={product.title} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover" />
                ) : (
                  <div className="carousel__image-placeholder" aria-hidden="true" />
                )}
              </Link>
              <div className="carousel__contents">
                <Link href={productHref} className="user__name carousel__product-link" onClick={handleProductNavigate}>
                  {product.title}
                </Link>
                <h3 className="user__title">
                  {isSoldOut ? "Sold Out" : hasPrice ? `Rs. ${priceValue.toLocaleString()}` : "Contact"}
                </h3>
                <Link href={productHref} className="carousel__view-details" onClick={handleProductNavigate}>
                  View details
                </Link>
                <button
                  type="button"
                  className="carousel__add-to-cart"
                  disabled={isSoldOut}
                  onClick={(e) => handleAddToCartClick(product, e)}
                >
                  {isSoldOut ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}, (prev, next) => {
  return (
    prev.isCompact === next.isCompact &&
    prev.slides.map((slide) => slide.key).join("|") === next.slides.map((slide) => slide.key).join("|")
  );
});

export function LuxereenCarousel({ products, title, id }: { products: Product[]; title: string; id?: string }) {
  const { addToCart } = useCart();
  const onAddToCartRef = useRef<(product: Product) => void>(() => {});
  const { slides, isCompact } = buildCarouselSlides(products);

  onAddToCartRef.current = (product: Product) => {
    addToCart(buildCartPayload(product));
  };

  if (!slides.length) {
    return null;
  }

  return (
    <div id={id} className="mb-20 pt-20 -mt-20 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-serif mb-8 pb-4 border-b border-border/50 uppercase tracking-widest">{title}</h2>
      <CarouselInstance slides={slides} isCompact={isCompact} onAddToCartRef={onAddToCartRef} />
    </div>
  );
}

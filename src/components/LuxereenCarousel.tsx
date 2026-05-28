"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
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

function productsSignature(products: Product[]) {
  return products.map((p) => p.id).join("|");
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

const CarouselInstance = memo(function CarouselInstance({
  products,
  onAddToCartRef,
}: {
  products: Product[];
  onAddToCartRef: React.RefObject<(product: Product) => void>;
}) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauserRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      ($slide as HTMLElement).focus();
    },
    [getSlides]
  );

  const prevSlide = useCallback(() => {
    const index = getActiveIndex();
    const $slides = getSlides();
    const $last = $slides[$slides.length - 1];
    if (!$last || !listRef.current) return;
    $last.remove();
    listRef.current.prepend($last);
    activateSlide(getSlides()[index]);
  }, [activateSlide, getActiveIndex, getSlides]);

  const nextSlide = useCallback(() => {
    const index = getActiveIndex();
    const $slides = getSlides();
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
    autoRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  }, [nextSlide, pauseAuto]);

  useEffect(() => {
    if (!products.length) return;
    startAuto();
    return () => {
      pauseAuto();
    };
  }, [pauseAuto, products.length, startAuto]);

  useEffect(() => {
    const list = listRef.current;
    const prevBtn = prevRef.current;
    const nextBtn = nextRef.current;
    if (!list || !prevBtn || !nextBtn) return;

    const chooseSlide = (e: Event) => {
      const max = window.matchMedia("screen and ( max-width: 600px)").matches ? 5 : 8;
      const target = e.target as HTMLElement | null;
      const $slide = target?.closest(".carousel__item") || null;
      const index = getSlideIndex($slide);
      if (index < 3 || index > max) return;
      if (index === max) nextSlide();
      if (index === 3) prevSlide();
      activateSlide($slide);
    };

    const handleNextClick = () => {
      pauseAuto();
      nextSlide();
    };

    const handlePrevClick = () => {
      pauseAuto();
      prevSlide();
    };

    const handleSlideClick = (e: Event) => {
      pauseAuto();
      chooseSlide(e);
    };

    const handleSlideKey = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 37:
        case 65:
          handlePrevClick();
          break;
        case 39:
        case 68:
          handleNextClick();
          break;
      }
    };

    nextBtn.addEventListener("click", handleNextClick);
    prevBtn.addEventListener("click", handlePrevClick);
    list.addEventListener("focusin", handleSlideClick);
    list.addEventListener("keyup", handleSlideKey);

    return () => {
      nextBtn.removeEventListener("click", handleNextClick);
      prevBtn.removeEventListener("click", handlePrevClick);
      list.removeEventListener("focusin", handleSlideClick);
      list.removeEventListener("keyup", handleSlideKey);
    };
  }, [activateSlide, getSlideIndex, nextSlide, pauseAuto, prevSlide]);

  const handleImageClick = (product: Product, e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const slide = target?.closest(".carousel__item") || null;
    if (!slide) return;

    if (slide.hasAttribute("data-active")) {
      const quantity = Number(product.quantity);
      const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
      if (isSoldOut) return;
      onAddToCartRef.current?.(product);
      return;
    }

    (slide as HTMLElement).focus();
  };

  const handleAddToCartClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const quantity = Number(product.quantity);
    const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
    if (isSoldOut) return;
    onAddToCartRef.current?.(product);
  };

  return (
    <section className="carousel">
      <ul className="carousel__list" ref={listRef}>
        {products.map((product, idx) => {
          const imageUrl = product.image_urls?.[0];
          const quantity = Number(product.quantity);
          const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
          const priceValue = Number(product.price);
          const hasPrice = Number.isFinite(priceValue) && priceValue >= 0;

          return (
            <li
              key={product.id}
              className="carousel__item"
              data-active={idx === 0 ? "true" : undefined}
              tabIndex={0}
            >
              <div className="carousel__image" onClick={(e) => handleImageClick(product, e)}>
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={product.title} />
                ) : null}
              </div>
              <div className="carousel__contents">
                <h2 className="user__name">{product.title}</h2>
                <h3 className="user__title">
                  {isSoldOut ? "Sold Out" : hasPrice ? `Rs. ${priceValue.toLocaleString()}` : "Contact"}
                </h3>
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
      <div className="carousel__nav">
        <button type="button" className="prev" ref={prevRef}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z" />
          </svg>
          <span>prev</span>
        </button>
        <button type="button" className="next" ref={nextRef}>
          <span>next</span>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z" />
          </svg>
        </button>
      </div>
    </section>
  );
}, (prev, next) => productsSignature(prev.products) === productsSignature(next.products));

export function LuxereenCarousel({ products, title, id }: { products: Product[]; title: string; id?: string }) {
  const { addToCart } = useCart();
  const onAddToCartRef = useRef<(product: Product) => void>(() => {});

  onAddToCartRef.current = (product: Product) => {
    addToCart(buildCartPayload(product));
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div id={id} className="mb-20 pt-20 -mt-20">
      <h2 className="text-2xl md:text-3xl font-serif mb-8 pb-4 border-b border-border/50 uppercase tracking-widest">{title}</h2>
      <CarouselInstance products={products} onAddToCartRef={onAddToCartRef} />
    </div>
  );
}

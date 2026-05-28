"use client";

import React, { useCallback, useEffect, useRef } from "react";
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

export function LuxereenCarousel({ products, title, id }: { products: Product[]; title: string; id?: string }) {
  const { addToCart } = useCart();
  const listRef = useRef<HTMLUListElement | null>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const pauserRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [products.length, pauseAuto, startAuto]);

  const chooseSlide = (e: React.FocusEvent | React.MouseEvent) => {
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

  const handleSlideClick = (e: React.FocusEvent | React.MouseEvent) => {
    pauseAuto();
    chooseSlide(e);
  };

  const handleSlideKey = (e: React.KeyboardEvent) => {
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

  const handleAddToCart = (product: Product) => {
    const defaultColor = product.color_options ? product.color_options.split(",")[0].trim() : "";
    const defaultSize = product.size_matrix ? product.size_matrix.split(",")[0].trim() : "";
    const defaultAddon = product.interactive_addons ? product.interactive_addons.split(",")[0].trim() : "";
    const priceValue = Number(product.price) || 0;

    addToCart({
      product_id: String(product.id),
      title: product.title,
      price: priceValue,
      brand: product.brand || "Luxereen",
      image_url: product.image_urls?.[0] || "",
      quantity: 1,
      selected_color: defaultColor,
      selected_size: defaultSize,
      selected_addon: defaultAddon,
      custom_measurement: "",
    });
  };

  const handleImageClick = (product: Product, e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const slide = target?.closest(".carousel__item") || null;
    if (!slide) return;

    if (slide.hasAttribute("data-active")) {
      const quantity = Number(product.quantity);
      const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
      if (isSoldOut) return;
      handleAddToCart(product);
      return;
    }

    (slide as HTMLElement).focus();
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div id={id} className="mb-20 pt-20 -mt-20">
      <h2 className="text-2xl md:text-3xl font-serif mb-8 pb-4 border-b border-border/50 uppercase tracking-widest">{title}</h2>

      <section className="carousel">
        <ul className="carousel__list" ref={listRef} onFocus={handleSlideClick} onKeyUp={handleSlideKey}>
          {products.map((product, idx) => {
            const imageUrl = product.image_urls?.[0];
            const quantity = Number(product.quantity);
            const isSoldOut = !Number.isFinite(quantity) || quantity <= 0;
            const priceValue = Number(product.price);
            const hasPrice = Number.isFinite(priceValue) && priceValue >= 0;

            return (
              <li
                key={`${product.id}-${idx}`}
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
                    {isSoldOut ? (
                      "Sold Out"
                    ) : hasPrice ? (
                      `Rs. ${priceValue.toLocaleString()}`
                    ) : (
                      "Contact"
                    )}
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

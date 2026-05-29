"use client";

import { Sparkles } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  media_url: string;
  media_type: "image" | "video";
}

function BannerMedia({ banner, className }: { banner: Banner; className?: string }) {
  if (banner.media_type === "video") {
    return (
      <video
        src={banner.media_url}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={banner.media_url} alt={banner.title} className={className} />
  );
}

export function ByreenBrandHero({
  desktopBanner,
  mobileBanner,
}: {
  desktopBanner: Banner | null;
  mobileBanner: Banner | null;
}) {
  if (!desktopBanner && !mobileBanner) {
    return (
      <header className="text-center px-4 pt-12 pb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#be185d]/80 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          modern minimals
          <Sparkles className="h-3.5 w-3.5" />
        </p>
        <h1 className="byreen-section-title text-5xl md:text-6xl text-[#831843] font-semibold">
          byreen.xo
        </h1>
      </header>
    );
  }

  const showDesktop = desktopBanner ?? mobileBanner;
  const showMobile = mobileBanner ?? desktopBanner;

  return (
    <header className="w-full bg-[#fdf2f8]">
      {showDesktop && (
        <div className="hidden md:flex w-full justify-center">
          <BannerMedia
            banner={showDesktop}
            className="w-full max-h-[min(72vh,820px)] h-auto object-contain"
          />
        </div>
      )}
      {showMobile && (
        <div className="flex md:hidden w-full justify-center">
          <BannerMedia banner={showMobile} className="w-full h-auto object-contain" />
        </div>
      )}
    </header>
  );
}

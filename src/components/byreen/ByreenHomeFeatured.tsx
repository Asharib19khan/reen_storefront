import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ByreenProductPin, type ByreenProduct } from "./ByreenProductPin";
import { byreenFontClassName } from "./byreen-fonts";
import "./byreen-theme.css";

export function ByreenHomeFeatured({ products }: { products: ByreenProduct[] }) {
  return (
    <section
      id="byreen-xo-featured"
      className={`${byreenFontClassName} py-20 w-full border-y border-[#fbcfe8]/60 bg-gradient-to-b from-[#fff5f9] via-[#fdf2f8] to-[#fce7f3]/30 relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(251,207,232,0.35),transparent_45%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-center md:text-left">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#be185d] mb-3 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              jewellery mood board
            </p>
            <h2 className="byreen-section-title text-4xl md:text-5xl text-[#831843] font-semibold">
              byreen.xo
            </h2>
            <p className="text-[#9d174d]/90 mt-3 max-w-xl mx-auto md:mx-0 text-sm md:text-base leading-relaxed">
              Permanent bracelets, delicate chains, and traditional jhumkas — curated like your
              favourite Pinterest board.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#fbcfe8] bg-white/80 text-[#831843] hover:bg-[#fce7f3] uppercase tracking-widest text-xs px-8 shrink-0"
          >
            <Link href="/shop?brand=byreen_xo">Explore all pins</Link>
          </Button>
        </div>

        <div className="byreen-masonry">
          {products.map((product, i) => (
            <ByreenProductPin key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

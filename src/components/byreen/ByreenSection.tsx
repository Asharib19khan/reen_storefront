import { Sparkles } from "lucide-react";
import { ByreenProductPin, type ByreenProduct } from "./ByreenProductPin";

export function ByreenSection({
  title,
  products,
  id,
  startIndex = 0,
}: {
  title: string;
  products: ByreenProduct[];
  id?: string;
  startIndex?: number;
}) {
  if (!products.length) return null;

  return (
    <section id={id} className="mb-16 md:mb-20 pt-16 -mt-16 scroll-mt-28">
      <div className="flex flex-col items-center text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#fbcfe8] bg-white/80 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-[#be185d] mb-4">
          <Sparkles className="h-3 w-3" />
          collection
        </span>
        <h2 className="byreen-section-title text-3xl md:text-4xl text-[#831843] font-semibold">
          {title}
        </h2>
        <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#f9a8d4] to-transparent" />
      </div>

      <div className="byreen-masonry max-w-7xl mx-auto">
        {products.map((product, i) => (
          <ByreenProductPin
            key={product.id}
            product={product}
            index={startIndex + i}
          />
        ))}
      </div>
    </section>
  );
}

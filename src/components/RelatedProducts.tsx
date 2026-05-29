import { ProductCard } from "@/components/ProductCard";
import type { StoreProduct } from "@/lib/product-types";

export function RelatedProducts({
  products,
  title = "You May Also Like",
}: {
  products: StoreProduct[];
  title?: string;
}) {
  if (!products.length) return null;

  return (
    <section className="border-t border-border py-16 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as Parameters<typeof ProductCard>[0]["product"]} />
          ))}
        </div>
      </div>
    </section>
  );
}

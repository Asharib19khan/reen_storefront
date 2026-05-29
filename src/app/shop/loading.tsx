import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 w-full">
      <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-8" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}

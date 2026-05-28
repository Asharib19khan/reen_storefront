"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, ShoppingCart, Ruler } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Variant States
  const colors = product.color_options ? product.color_options.split(',').map((s: string) => s.trim()) : [];
  const sizes = product.size_matrix ? product.size_matrix.split(',').map((s: string) => s.trim()) : [];
  const addons = product.interactive_addons ? product.interactive_addons.split(',').map((s: string) => s.trim()) : [];

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedAddon, setSelectedAddon] = useState(addons[0] || "");
  const [customMeasurement, setCustomMeasurement] = useState("");

  const handleAdd = () => {
    const priceValue = Number(product.price) || 0;

    addToCart({
      product_id: String(product.id),
      title: product.title,
      price: priceValue,
      brand: product.brand || "Luxereen",
      quantity: qty,
      image_url: product.image_urls[0] || "https://placehold.co/600x600/fbcfe8/831843?text=Reens",
      selected_color: selectedColor,
      selected_size: selectedSize,
      selected_addon: selectedAddon,
      custom_measurement: customMeasurement
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Variant Selectors */}
      <div className="space-y-4">
        {colors.length > 0 && (
          <div className="space-y-2">
            <Label>Color / Finish</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${selectedColor === c ? 'border-primary bg-primary/10 font-medium' : 'hover:border-primary/50'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="space-y-2">
            <Label>Size Matrix</Label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors min-w-[3rem] ${selectedSize === s ? 'border-primary bg-primary/10 font-medium' : 'hover:border-primary/50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {addons.length > 0 && (
          <div className="space-y-2">
            <Label>Custom Add-ons</Label>
            <div className="flex flex-wrap gap-2">
              {addons.map((a: string) => (
                <button
                  key={a}
                  onClick={() => setSelectedAddon(a)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${selectedAddon === a ? 'border-primary bg-primary/10 font-medium' : 'hover:border-primary/50'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.has_custom_measurement && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              Custom Measurements
            </Label>
            <Textarea 
              placeholder="e.g. Bust: 34, Waist: 28, Hips: 38 (inches)..." 
              className="resize-none h-20"
              value={customMeasurement}
              onChange={(e: any) => setCustomMeasurement(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Provide exact measurements for a bespoke fit.</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border mt-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border rounded-md h-12 w-32 bg-background">
            <button 
              type="button" 
              className="flex-1 flex justify-center items-center h-full hover:bg-muted text-muted-foreground transition-colors rounded-l-md"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center font-medium">{qty}</div>
            <button 
              type="button" 
              className="flex-1 flex justify-center items-center h-full hover:bg-muted text-muted-foreground transition-colors rounded-r-md"
              onClick={() => setQty(Math.min(product.quantity, qty + 1))}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {product.quantity} in stock
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full text-base h-12" 
          onClick={handleAdd}
          variant={added ? "secondary" : "default"}
        >
          <ShoppingCart className="mr-2 h-5 w-5" /> 
          {added ? "Added to Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

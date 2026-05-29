"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function CartItemsList({ compact = false }: { compact?: boolean }) {
  const { items, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8 text-sm">
        Your cart is empty.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item: CartItem) => (
        <div
          key={item.cart_item_id}
          className={`flex gap-3 items-start ${compact ? "py-3 border-b border-border last:border-0" : "py-6 border-b border-border"}`}
        >
          <div className={`shrink-0 bg-muted rounded-md overflow-hidden border ${compact ? "w-16 h-16" : "w-24 h-24 md:w-32 md:h-32"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
              {item.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
            </span>
            <h3 className={`font-medium line-clamp-2 mt-1 ${compact ? "text-sm" : "text-lg"}`}>{item.title}</h3>
            <p className="text-primary font-semibold text-sm mt-0.5">Rs. {item.price}</p>
            {!compact && (
              <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                {item.selected_color && <p>Color: {item.selected_color}</p>}
                {item.selected_size && <p>Size: {item.selected_size}</p>}
              </div>
            )}
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center border rounded-md h-8 w-24 bg-background">
                <button
                  type="button"
                  className="flex-1 flex justify-center items-center h-full hover:bg-muted text-muted-foreground"
                  onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="flex-1 text-center text-xs font-medium">{item.quantity}</div>
                <button
                  type="button"
                  className="flex-1 flex justify-center items-center h-full hover:bg-muted text-muted-foreground"
                  onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.cart_item_id)}
                className="text-xs text-destructive hover:underline flex items-center"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSummary({ onCheckout }: { onCheckout?: () => void }) {
  const { totalAmount, items } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span className="text-primary">Rs. {totalAmount}</span>
      </div>
      <Link href="/checkout" onClick={onCheckout} className="block">
        <Button size="lg" className="w-full">Proceed to Checkout</Button>
      </Link>
      <Link href="/cart" onClick={onCheckout} className="block text-center text-sm text-muted-foreground hover:text-primary">
        View full cart
      </Link>
    </div>
  );
}

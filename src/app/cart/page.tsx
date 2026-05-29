"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItemsList, CartSummary } from "@/components/CartItemsList";

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-muted/30 p-8 rounded-full mb-6">
          <Trash2 className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Let&apos;s get you some beautiful items!
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full pb-24">
      <h1 className="text-3xl font-bold text-foreground mb-10">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <CartItemsList />
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-muted/20 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

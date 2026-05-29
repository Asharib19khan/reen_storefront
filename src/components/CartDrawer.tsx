"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemsList, CartSummary } from "./CartItemsList";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isCartOpen, closeCart } = useCart();
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[80] flex flex-col shadow-2xl border-l"
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Your Cart ({itemCount})</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground mb-6">Your cart is empty.</p>
                  <Link href="/shop" onClick={closeCart}>
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <CartItemsList compact />
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t bg-muted/20">
                <CartSummary onCheckout={closeCart} />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

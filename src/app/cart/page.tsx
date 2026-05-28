"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-muted/30 p-8 rounded-full mb-6">
          <Trash2 className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Let's get you some beautiful items!
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full">
      <h1 className="text-3xl font-bold text-foreground mb-10">Your Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.cart_item_id} className="flex gap-4 md:gap-6 items-start py-6 border-b border-border">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-muted rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-1 rounded">
                        {item.brand === 'byreen_xo' ? 'byreen.xo' : 'luxereen.wears'}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg md:text-xl line-clamp-1">{item.title}</h3>
                    <p className="text-primary font-semibold mt-1">Rs. {item.price}</p>
                    
                    {/* Variant Details */}
                    <div className="mt-2 text-sm text-muted-foreground space-y-1">
                      {item.selected_color && <p>Color: {item.selected_color}</p>}
                      {item.selected_size && <p>Size: {item.selected_size}</p>}
                      {item.custom_measurement && <p>Measurements: {item.custom_measurement}</p>}
                      {item.selected_addon && <p>Add-on: {item.selected_addon}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center border rounded-md h-10 w-28 bg-background">
                    <button 
                      className="flex-1 flex justify-center items-center h-full hover:bg-muted text-muted-foreground transition-colors rounded-l-md"
                      onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="flex-1 text-center font-medium text-sm">{item.quantity}</div>
                    <button 
                      className="flex-1 flex justify-center items-center h-full hover:bg-muted text-muted-foreground transition-colors rounded-r-md"
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.cart_item_id)}
                    className="text-sm text-destructive hover:underline font-medium flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-muted/20 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-4 text-muted-foreground text-sm">
              <span>Subtotal</span>
              <span>Rs. {totalAmount}</span>
            </div>
            <div className="flex justify-between mb-6 text-muted-foreground text-sm">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-4 mb-8">
              <span>Total</span>
              <span className="text-primary">Rs. {totalAmount}</span>
            </div>
            <Link href="/checkout" className="w-full block">
              <Button size="lg" className="w-full text-base">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

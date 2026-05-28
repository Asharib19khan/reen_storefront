"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, Loader2, CreditCard, Banknote } from "lucide-react";

export function CheckoutClient({ paymentDetails }: { paymentDetails: string }) {
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    payment_method: "COD" // Default to Cash on Delivery
  });

  if (items.length === 0 && !orderId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mb-2">Your order ID is: <span className="font-mono font-medium text-foreground">{orderId}</span></p>
        <p className="text-muted-foreground mb-8">Thank you for shopping with us.</p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // NOTE: We pass payment_method alongside address to process_checkout.
      // Since process_checkout might not explicitly have a parameter for payment_method yet,
      // we append it to the address string for now, or update the RPC. 
      // For safety, appending to address:
      const fullAddress = `${formData.customer_address}\n\n[Payment Method: ${formData.payment_method}]`;

      const { data, error: rpcError } = await supabase.rpc("process_checkout", {
        p_customer_name: formData.customer_name,
        p_customer_phone: formData.customer_phone,
        p_customer_address: fullAddress,
        p_total_amount: totalAmount,
        p_cart_items: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price_at_purchase: i.price
        }))
      });

      if (rpcError) throw rpcError;

      setOrderId(data);
      clearCart();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">1. Shipping Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Full Name</Label>
                <Input 
                  id="customer_name" 
                  required 
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone Number</Label>
                <Input 
                  id="customer_phone" 
                  required 
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="0300 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_address">Complete Delivery Address</Label>
                <textarea 
                  id="customer_address" 
                  required 
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  placeholder="House 123, Street 4, Sector ABC, City"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">2. Payment Method</h3>
            <div className="grid gap-4">
              {/* COD Option */}
              <label 
                className={`relative flex cursor-pointer rounded-lg border bg-card p-4 shadow-sm hover:border-primary/50 ${formData.payment_method === 'COD' ? 'border-primary ring-1 ring-primary' : ''}`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="COD" 
                  className="sr-only"
                  checked={formData.payment_method === 'COD'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Banknote className="h-5 w-5 text-primary" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="mt-1 flex items-center text-sm text-muted-foreground">
                      Pay with cash upon delivery.
                    </span>
                  </span>
                </span>
                <CheckCircle2 className={`h-5 w-5 ${formData.payment_method === 'COD' ? 'text-primary' : 'text-transparent'}`} />
              </label>

              {/* Online Option */}
              <label 
                className={`relative flex cursor-pointer rounded-lg border bg-card p-4 shadow-sm hover:border-primary/50 ${formData.payment_method === 'ONLINE' ? 'border-primary ring-1 ring-primary' : ''}`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="ONLINE" 
                  className="sr-only"
                  checked={formData.payment_method === 'ONLINE'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Online Payment (Bank Transfer)
                    </span>
                    <span className="mt-1 flex items-center text-sm text-muted-foreground">
                      Transfer directly to our bank account.
                    </span>
                  </span>
                </span>
                <CheckCircle2 className={`h-5 w-5 ${formData.payment_method === 'ONLINE' ? 'text-primary' : 'text-transparent'}`} />
              </label>
            </div>

            {formData.payment_method === 'ONLINE' && (
              <Card className="border-primary/20 shadow-sm bg-primary/5 mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary text-sm uppercase tracking-widest">Bank Transfer Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                    {paymentDetails}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm font-medium bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full text-base h-12" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Confirm Order — Rs. {totalAmount}
          </Button>
        </form>
      </div>

      <div>
        <div className="border rounded-xl p-6 bg-muted/20 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="flex flex-col gap-6 mb-6">
            {items.map(item => (
              <div key={item.product_id} className="flex gap-4">
                <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-background border px-1.5 py-0.5 rounded">
                      {item.brand === 'byreen_xo' ? 'byreen.xo' : 'luxereen.wears'}
                    </span>
                  </div>
                  <p className="font-medium line-clamp-1">{item.title}</p>
                  
                  {/* Display Variants if any */}
                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    {item.selected_color && <p>Color: {item.selected_color}</p>}
                    {item.selected_size && <p>Size: {item.selected_size}</p>}
                    {item.selected_addon && <p>Add-on: {item.selected_addon}</p>}
                    {item.custom_measurement && <p className="truncate" title={item.custom_measurement}>Measurements: {item.custom_measurement}</p>}
                  </div>
                  
                  <p className="text-muted-foreground mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="font-medium text-sm">
                  Rs. {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>Rs. {totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">Rs. {totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

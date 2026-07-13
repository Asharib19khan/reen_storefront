"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, Loader2, CreditCard, Banknote, MapPin, Copy, Check } from "lucide-react";
import Image from "next/image";

export function CheckoutClient({ paymentDetails }: { paymentDetails: string }) {
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationTracked, setIsLocationTracked] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    house_address: "",
    area: "",
    city: "",
    province: "",
    country: "",
    zipcode: "",
    payment_method: "COD" // Default to Cash on Delivery
  });
  
  const [transactionId, setTransactionId] = useState("");
  const [paymentPlatform, setPaymentPlatform] = useState("");

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    
    const supabase = getSupabase();
    if (!supabase) return;
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCodeInput.trim().toUpperCase())
      .single();

    setPromoLoading(false);

    if (error || !data) {
      setPromoError("Invalid promo code.");
      return;
    }

    if (!data.is_active) {
      setPromoError("This promo code is inactive.");
      return;
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      setPromoError("This promo code has reached its usage limit.");
      return;
    }

    if (totalAmount < data.min_order_value) {
      setPromoError(`Minimum order value of Rs. ${data.min_order_value} required.`);
      return;
    }

    if (data.valid_until && new Date() > new Date(data.valid_until)) {
      setPromoError("This promo code has expired.");
      return;
    }

    setAppliedPromo(data);
    setPromoCodeInput("");
  };

  const isKarachi = formData.city?.toLowerCase().includes('karachi');
  const deliveryCharge = formData.city.trim() ? (isKarachi ? 300 : 400) : 0;
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      discountAmount = Math.floor(totalAmount * (appliedPromo.discount_value / 100));
    } else {
      discountAmount = appliedPromo.discount_value;
    }
  }

  const finalTotal = Math.max(0, totalAmount + deliveryCharge - discountAmount);

  if (items.length === 0 && !orderId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/">
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

  const validatePakistaniPhone = (phone: string) => {
    // Allows formats like 03001234567, 0300 1234567, 0300-1234567, +923001234567
    const regex = /^((\+92)|(0092))?-?0?3[0-9]{2}-?[ ]?[0-9]{7}$/;
    return regex.test(phone.replace(/\s+/g, ''));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            setFormData(prev => ({
              ...prev,
              house_address: prev.house_address || data.address.house_number || "",
              area: data.address.suburb || data.address.neighbourhood || data.address.residential || "",
              city: data.address.city || data.address.town || data.address.village || "",
              province: data.address.state || "",
              country: data.address.country || "",
              zipcode: data.address.postcode || ""
            }));
            setIsLocationTracked(true);
          }
        } catch (err) {
          console.error("Error fetching location data:", err);
          setError("Failed to fetch address details. Please enter manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setError("Location access denied or failed.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePakistaniPhone(formData.customer_phone)) {
      setPhoneError("Please enter a valid Pakistani phone number (e.g., 03001234567)");
      return;
    }
    
    setLoading(true);
    setError(null);
    setPhoneError(null);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Store is not configured. Please try again later.");
      }

      let paymentInfo = `[Payment Method: ${formData.payment_method}]`;
      if (formData.payment_method === 'ONLINE') {
        paymentInfo += `\n[Sent Via: ${paymentPlatform}]\n[Transaction ID: ${transactionId}]`;
      }
      paymentInfo += `\n[Delivery Charge: Rs. ${deliveryCharge}]`;

      let promoInfo = "";
      if (appliedPromo) {
        promoInfo = `\n[Promo Applied: ${appliedPromo.code} (-Rs. ${discountAmount})]`;
      }

      const fullAddress = `${formData.house_address}, ${formData.area}\n${formData.city}, ${formData.province} ${formData.zipcode}\n${formData.country}\n\n${paymentInfo}${promoInfo}`;

      const { data, error: rpcError } = await supabase.rpc("process_checkout", {
        p_customer_name: formData.customer_name,
        p_customer_phone: formData.customer_phone,
        p_customer_address: fullAddress,
        p_total_amount: finalTotal,
        p_cart_items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price_at_purchase: i.price,
          selected_color: i.selected_color || null,
          selected_size: i.selected_size || null,
          custom_measurement: i.custom_measurement || null,
          selected_addon: i.selected_addon || null,
        })),
      });

      if (rpcError) throw rpcError;

      if (data && appliedPromo) {
        const { error: promoError } = await supabase.rpc('increment_promo_usage', { p_promo_code: appliedPromo.code });
        if (promoError) console.error("Failed to increment promo usage:", promoError);
      }

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
                  onChange={(e) => {
                    setFormData({ ...formData, customer_phone: e.target.value });
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="0300 1234567"
                  className={phoneError ? "border-destructive ring-1 ring-destructive" : ""}
                />
                {phoneError && <p className="text-xs text-destructive mt-1 font-medium">{phoneError}</p>}
              </div>

              <div className="pt-4 border-t border-border/50">
                <Label className="text-base font-semibold mb-4 block">
                  Delivery Address <span className="text-destructive">*</span>
                </Label>
                
                {!isLocationTracked ? (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-xl bg-muted/10 gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground max-w-sm">
                      For accurate delivery, please allow us to track your exact location first.
                    </p>
                    <Button 
                      type="button" 
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="gap-2 w-full max-w-xs shadow-md"
                    >
                      {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                      {isLocating ? "Locating..." : "Track My Location"}
                    </Button>
                    <button 
                      type="button"
                      onClick={() => setIsLocationTracked(true)}
                      className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4 mt-2 transition-colors"
                    >
                      Or enter address manually
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="gap-2 h-8 text-xs text-primary hover:bg-primary/10"
                      >
                        {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
                        {isLocating ? "Locating..." : "Re-track Location"}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="house_address">House / Building Address</Label>
                        <Input 
                          id="house_address" 
                          required 
                          value={formData.house_address}
                          onChange={(e) => setFormData({ ...formData, house_address: e.target.value })}
                          placeholder="House 123, Street 4"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="area">Area / Sector / Society</Label>
                        <Input 
                          id="area" 
                          required 
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          placeholder="Sector ABC"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          required 
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Karachi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Province / State</Label>
                        <Input 
                          id="province" 
                          required 
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          placeholder="Sindh"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          required 
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="Pakistan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipcode">Zip / Postal Code</Label>
                        <Input 
                          id="zipcode" 
                          required 
                          value={formData.zipcode}
                          onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                          placeholder="75000"
                        />
                      </div>
                    </div>
                  </>
                )}
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
                  <CardTitle className="text-primary text-sm uppercase tracking-widest">Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-background border rounded-lg shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Bank Transfer</p>
                    <p className="text-sm font-medium">Bank Name: <span className="font-bold">ABL (Allied Bank Limited)</span></p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-mono text-lg font-semibold">01280010098143980019</p>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleCopy("01280010098143980019", "bank")}
                      >
                        {copiedId === "bank" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background border rounded-lg shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Easypaisa</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-base font-semibold">03353963793</p>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => handleCopy("03353963793", "easypaisa")}
                        >
                          {copiedId === "easypaisa" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-background border rounded-lg shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">SadaPay</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-base font-semibold">03342306222</p>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => handleCopy("03342306222", "sadapay")}
                        >
                          {copiedId === "sadapay" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-4">
                    <div>
                      <Label htmlFor="paymentPlatform" className="text-sm font-semibold mb-2 block">
                        I sent the money via <span className="text-destructive">*</span>
                      </Label>
                      <select 
                        id="paymentPlatform"
                        required={formData.payment_method === 'ONLINE'}
                        value={paymentPlatform}
                        onChange={(e) => setPaymentPlatform(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled>Select platform...</option>
                        <option value="ABL Bank Transfer">ABL Bank Transfer</option>
                        <option value="Easypaisa">Easypaisa</option>
                        <option value="SadaPay">SadaPay</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="transactionId" className="text-sm font-semibold mb-2 block">
                        Transaction ID (TID) <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="transactionId" 
                        required={formData.payment_method === 'ONLINE'}
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter 11-14 digit TID here"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 italic bg-background p-3 rounded-lg border border-dashed">
                    Please transfer the exact amount and enter the <span className="font-bold text-foreground">Transaction ID</span> above. Your order will not be shipped until the funds have cleared in our account.
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
            Confirm Order — Rs. {finalTotal}
          </Button>
        </form>
      </div>

      <div>
        <div className="border rounded-xl p-6 bg-muted/20 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="flex flex-col gap-6 mb-6">
            {items.map((item) => (
              <div key={item.cart_item_id} className="flex gap-4">
                <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0 border">
                  <Image unoptimized src={item.image_url} alt={item.title} fill sizes="80px" className="object-cover" />
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
            {appliedPromo && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Discount ({appliedPromo.code})</span>
                <span>-Rs. {discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span>{deliveryCharge > 0 ? `Rs. ${deliveryCharge}` : "Calculated after entering city"}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">Rs. {finalTotal}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Label className="text-sm mb-2 block">Promo Code</Label>
            {!appliedPromo ? (
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code" 
                  value={promoCodeInput}
                  onChange={(e) => { setPromoCodeInput(e.target.value); setPromoError(null); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyPromo();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={handleApplyPromo} disabled={promoLoading || !promoCodeInput.trim()}>
                  {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                <span>{appliedPromo.code} applied!</span>
                <button type="button" onClick={() => setAppliedPromo(null)} className="text-green-600 hover:text-green-800 underline">Remove</button>
              </div>
            )}
            {promoError && <p className="text-xs text-destructive mt-2">{promoError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

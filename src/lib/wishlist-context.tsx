"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import { getVisitorId } from "@/lib/visitor-id";

export interface WishlistItem {
  product_id: string;
  title: string;
  price: number;
  brand: string;
  image_url: string;
}

export interface WishlistCustomer {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  customer: WishlistCustomer | null;
  isWishlisted: (productId: string) => boolean;
  addToWishlist: (item: WishlistItem) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  saveCustomer: (customer: WishlistCustomer) => void;
  pendingProduct: WishlistItem | null;
  clearPendingProduct: () => void;
  showCustomerModal: boolean;
  setShowCustomerModal: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = "reens_wishlist";
const CUSTOMER_KEY = "reens_wishlist_customer";

async function syncWishToDatabase(item: WishlistItem, customer: WishlistCustomer) {
  const supabase = getSupabase();
  if (!supabase) return;

  const visitorId = getVisitorId();
  if (!visitorId) return;

  await supabase.from("customer_wishes").upsert(
    {
      product_id: item.product_id,
      customer_name: customer.customer_name,
      customer_phone: customer.customer_phone,
      customer_email: customer.customer_email || null,
      visitor_id: visitorId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "product_id,visitor_id" }
  );
}

async function removeWishFromDatabase(productId: string) {
  const supabase = getSupabase();
  if (!supabase) return;

  const visitorId = getVisitorId();
  if (!visitorId) return;

  await supabase
    .from("customer_wishes")
    .delete()
    .eq("product_id", productId)
    .eq("visitor_id", visitorId);
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [customer, setCustomer] = useState<WishlistCustomer | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<WishlistItem | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedItems = localStorage.getItem(WISHLIST_KEY);
      const savedCustomer = localStorage.getItem(CUSTOMER_KEY);
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  useEffect(() => {
    if (mounted && customer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    }
  }, [customer, mounted]);

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.product_id === productId),
    [items]
  );

  const saveCustomer = useCallback((nextCustomer: WishlistCustomer) => {
    setCustomer(nextCustomer);
  }, []);

  const clearPendingProduct = useCallback(() => {
    setPendingProduct(null);
  }, []);

  const addToWishlist = useCallback(
    async (item: WishlistItem): Promise<boolean> => {
      if (items.some((i) => i.product_id === item.product_id)) {
        return true;
      }

      if (!customer) {
        setPendingProduct(item);
        setShowCustomerModal(true);
        return false;
      }

      setItems((prev) => [...prev, item]);
      await syncWishToDatabase(item, customer);
      return true;
    },
    [items, customer]
  );

  const completePendingWish = useCallback(
    async (nextCustomer: WishlistCustomer) => {
      if (!pendingProduct) return;

      setCustomer(nextCustomer);
      setItems((prev) => {
        if (prev.some((i) => i.product_id === pendingProduct.product_id)) {
          return prev;
        }
        return [...prev, pendingProduct];
      });
      await syncWishToDatabase(pendingProduct, nextCustomer);
      setPendingProduct(null);
      setShowCustomerModal(false);
    },
    [pendingProduct]
  );

  const removeFromWishlist = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
    await removeWishFromDatabase(productId);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        customer,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        saveCustomer,
        pendingProduct,
        clearPendingProduct,
        showCustomerModal,
        setShowCustomerModal,
      }}
    >
      {children}
      <WishlistCustomerModal onComplete={completePendingWish} />
    </WishlistContext.Provider>
  );
}

function WishlistCustomerModal({
  onComplete,
}: {
  onComplete: (customer: WishlistCustomer) => Promise<void>;
}) {
  const { showCustomerModal, setShowCustomerModal, pendingProduct, clearPendingProduct } =
    useWishlist();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showCustomerModal || !pendingProduct) return null;

  const handleClose = () => {
    setShowCustomerModal(false);
    clearPendingProduct();
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required so we can follow up on your wish.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onComplete({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
      });
      setName("");
      setPhone("");
      setEmail("");
    } catch {
      setError("Could not save your wish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-1">Save to Wishlist</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add <span className="font-medium text-foreground">{pendingProduct.title}</span> to your
          wishlist. We&apos;ll use your details if this item becomes available or goes on sale.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="wish-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="wish-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="wish-phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="wish-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="03XX XXXXXXX"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="wish-email" className="text-sm font-medium">
              Email <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="wish-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="you@email.com"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-10 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Wish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

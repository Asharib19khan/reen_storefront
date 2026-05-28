"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  cart_item_id: string // Unique ID for the cart row
  product_id: string
  title: string
  price: number
  brand: string
  quantity: number
  image_url: string
  selected_color?: string
  selected_size?: string
  custom_measurement?: string
  selected_addon?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'cart_item_id'>) => void
  removeFromCart: (cart_item_id: string) => void
  updateQuantity: (product_id: string, quantity: number) => void
  clearCart: () => void
  totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from local storage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("reens_cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  // Save to local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("reens_cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addToCart = (item: Omit<CartItem, 'cart_item_id'>) => {
    setItems((prev) => {
      // Check if exact same item+variants exists
      const existing = prev.find((i) => 
        i.product_id === item.product_id &&
        i.selected_color === item.selected_color &&
        i.selected_size === item.selected_size &&
        i.custom_measurement === item.custom_measurement &&
        i.selected_addon === item.selected_addon
      )

      if (existing) {
        return prev.map((i) =>
          i.cart_item_id === existing.cart_item_id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      
      const newItem = {
        ...item,
        cart_item_id: Math.random().toString(36).substring(2, 9)
      }
      return [...prev, newItem]
    })
  }

  const removeFromCart = (cart_item_id: string) => {
    setItems((prev) => prev.filter((i) => i.cart_item_id !== cart_item_id))
  }

  const updateQuantity = (cart_item_id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.cart_item_id === cart_item_id ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => setItems([])

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

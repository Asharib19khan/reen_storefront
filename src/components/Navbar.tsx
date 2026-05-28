"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";

export function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("Home");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex min-h-20 py-2 md:h-24 items-center justify-between px-4 w-full overflow-hidden">
        <div className="flex gap-4 md:gap-10 items-center shrink-0">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo.png" alt="Reens Logo" width={250} height={250} className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-xl" priority />
          </Link>
          <nav className="hidden md:flex gap-8 items-center pt-1">
            <Link
              href="/"
              className="flex items-center text-xs tracking-widest uppercase font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/shop?brand=byreen_xo"
              className="flex items-center text-xs tracking-widest uppercase font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              byreen.xo
            </Link>
            <Link
              href="/shop?brand=luxereen_wears"
              className="flex items-center text-xs tracking-widest uppercase font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              luxereen.wears
            </Link>
            <Link
              href="/contact"
              className="flex items-center text-xs tracking-widest uppercase font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className="flex items-center text-xs tracking-widest uppercase font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              About Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/cart" className="relative p-2">
              <ShoppingBag className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute top-0 right-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  variant="default"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 flex flex-col shadow-2xl border-r"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <span className="font-serif text-xl tracking-widest uppercase">Menu</span>
                <button onClick={toggleSidebar} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                {/* Home Section */}
                <div className="px-4 mb-2">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === "Home" ? null : "Home")}
                    className="flex items-center justify-between w-full py-3 text-sm font-semibold tracking-widest uppercase text-foreground/90 hover:text-primary"
                  >
                    Home
                    {expandedSection === "Home" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "Home" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex flex-col pl-4 py-2 border-l border-primary/20 ml-2 space-y-3">
                          <Link href="/#best-selling" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Best Selling</Link>
                          <Link href="/#new-arrival" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrival</Link>
                          <Link href="/#reviews" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Customer Reviews</Link>
                          <Link href="/#byreen-xo-featured" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">byreen.xo Featured</Link>
                          <Link href="/#luxereen-wears-featured" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">luxereen.wears Featured</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* byreen.xo Section */}
                <div className="px-4 mb-2">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === "byreen.xo" ? null : "byreen.xo")}
                    className="flex items-center justify-between w-full py-3 text-sm font-semibold tracking-widest uppercase text-foreground/90 hover:text-primary"
                  >
                    byreen.xo
                    {expandedSection === "byreen.xo" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "byreen.xo" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex flex-col pl-4 py-2 border-l border-primary/20 ml-2 space-y-3">
                          <Link href="/shop?brand=byreen_xo" onClick={toggleSidebar} className="text-sm font-medium text-foreground hover:text-primary transition-colors">Shop All</Link>
                          <Link href="/shop?brand=byreen_xo#new-arrivals" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrival</Link>
                          <Link href="/shop?brand=byreen_xo#rings" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Rings</Link>
                          <Link href="/shop?brand=byreen_xo#bracelets-anklets" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Bracelets & Anklets</Link>
                          <Link href="/shop?brand=byreen_xo#earrings" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Earrings</Link>
                          <Link href="/shop?brand=byreen_xo#necklaces" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Necklaces</Link>
                          <Link href="/shop?brand=byreen_xo#bangles" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Bangles (Churiyaan)</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* luxereen.wears Section */}
                <div className="px-4 mb-2">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === "luxereen.wears" ? null : "luxereen.wears")}
                    className="flex items-center justify-between w-full py-3 text-sm font-semibold tracking-widest uppercase text-foreground/90 hover:text-primary"
                  >
                    luxereen.wears
                    {expandedSection === "luxereen.wears" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "luxereen.wears" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex flex-col pl-4 py-2 border-l border-primary/20 ml-2 space-y-3">
                          <Link href="/shop?brand=luxereen_wears" onClick={toggleSidebar} className="text-sm font-medium text-foreground hover:text-primary transition-colors">Shop All</Link>
                          <Link href="/shop?brand=luxereen_wears#new-arrivals" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrival</Link>
                          <Link href="/shop?brand=luxereen_wears#corset-co-ord-sets" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Corset Co-ord Sets</Link>
                          <Link href="/shop?brand=luxereen_wears#solid-casual-two-piece-co-ords" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Solid & Casual Two-Piece</Link>
                          <Link href="/shop?brand=luxereen_wears#fusion-printed-kurtis" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Fusion & Printed Kurtis</Link>
                          <Link href="/shop?brand=luxereen_wears#traditional-fusion-coordinates" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Traditional Fusion</Link>
                          <Link href="/shop?brand=luxereen_wears#western-fusion-skirt-outfits" onClick={toggleSidebar} className="text-sm text-muted-foreground hover:text-primary transition-colors">Western-Fusion & Skirt Outfits</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="p-6 border-t mt-auto bg-muted/30">
                <Link href="/about" onClick={toggleSidebar} className="block py-2 text-sm font-medium hover:text-primary transition-colors">About Us</Link>
                <Link href="/contact" onClick={toggleSidebar} className="block py-2 text-sm font-medium hover:text-primary transition-colors">Contact Us</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

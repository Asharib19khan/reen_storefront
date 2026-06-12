"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronRight, ChevronDown, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { NavDropdown } from "./NavDropdown";
import { ExpandableSearch } from "./ExpandableSearch";
import {
  BRAND_NAV_SECTIONS,
  TOP_NAV_LINKS,
  type NavSection,
} from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { useStorefrontSettings } from "@/lib/settings-context";

function MobileNavSection({
  section,
  expanded,
  onToggle,
  onNavigate,
}: {
  section: NavSection;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="px-4 mb-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold tracking-widest uppercase text-foreground/90 hover:text-primary"
        aria-expanded={expanded}
      >
        {section.label}
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pl-4 py-2 border-l border-primary/20 ml-2 space-y-3">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "text-sm transition-colors hover:text-primary",
                    link.highlight ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { items, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { hideByreenXo, hideLuxereenWears } = useStorefrontSettings();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleSection = (id: string) => {
    setExpandedSection((current) => (current === id ? null : id));
  };

  const visibleNavSections = BRAND_NAV_SECTIONS.filter((section) => {
    if (section.id === "byreen-xo" && hideByreenXo) return false;
    if (section.id === "luxereen-wears" && hideLuxereenWears) return false;
    return true;
  });

  const isTransparent = isHome && !isScrolled;

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isTransparent 
          ? "bg-transparent text-white border-transparent shadow-none" 
          : "bg-background/80 text-foreground border-b border-border/40 backdrop-blur-3xl shadow-sm"
      )}
    >

      <div className="max-w-[90rem] mx-auto flex min-h-20 md:min-h-24 items-center justify-between px-4 sm:px-6 lg:px-8 w-full py-2">
        <div className="flex gap-4 md:gap-8 lg:gap-10 items-center shrink-0 min-w-0">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Reens Logo"
              width={250}
              height={250}
              className={cn(
                "h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 object-cover rounded-full transition-transform duration-300 hover:scale-105 shadow-sm",
                isTransparent && "drop-shadow-md"
              )}
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center pt-1">
            {visibleNavSections.map((section) => (
              <NavDropdown key={section.id} section={section} isTransparent={isTransparent} />
            ))}
            {TOP_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline flex items-center text-xs tracking-widest uppercase font-semibold transition-colors hover:text-primary py-2",
                  isTransparent ? "text-white drop-shadow-md hover:text-white/80" : "text-foreground/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-2 md:space-x-4 shrink-0">
          <button
            type="button"
            className={cn(
              "md:hidden p-2 rounded-md transition-colors",
              isTransparent ? "text-white hover:bg-white/20" : "hover:bg-muted text-foreground"
            )}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <nav className="flex items-center space-x-1">
            <ExpandableSearch isTransparent={isTransparent} />
            <Link href="/wishlist" className="relative p-2" aria-label="Wishlist">
              <Heart className={cn(
                "h-6 w-6 transition-transform hover:scale-110",
                isTransparent ? "text-white drop-shadow-md" : "text-foreground hover:text-primary"
              )} />
              {wishlistCount > 0 && (
                <Badge
                  className="absolute top-0 right-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  variant="default"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative p-2"
              aria-label="Open cart"
            >
              <ShoppingBag className={cn(
                "h-6 w-6 transition-transform hover:scale-110",
                isTransparent ? "text-white drop-shadow-md" : "text-foreground hover:text-primary"
              )} />
              {itemCount > 0 && (
                <Badge
                  className="absolute top-0 right-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  variant="default"
                >
                  {itemCount}
                </Badge>
              )}
            </button>
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
              onClick={closeSidebar}
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
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {visibleNavSections.map((section) => (
                  <MobileNavSection
                    key={section.id}
                    section={section}
                    expanded={expandedSection === section.id}
                    onToggle={() => toggleSection(section.id)}
                    onNavigate={closeSidebar}
                  />
                ))}
              </div>

              <div className="p-6 border-t mt-auto bg-muted/30">
                {TOP_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSidebar}
                    className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

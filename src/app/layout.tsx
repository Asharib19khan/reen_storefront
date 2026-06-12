import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { getStorefrontSettings } from "@/lib/settings";
import { StorefrontSettingsProvider } from "@/lib/settings-context";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reens | byreen.xo & luxereen.wears",
  description: "Permanent jewelry, bracelet kits, and women's clothing.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStorefrontSettings();

  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StorefrontSettingsProvider settings={settings}>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 flex flex-col pt-[112px]">
                {children}
              </main>
              <SiteFooter />
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </StorefrontSettingsProvider>
      </body>
    </html>
  );
}

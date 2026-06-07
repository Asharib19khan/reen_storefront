import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { getStorefrontSettings } from "@/lib/settings";
import { StorefrontSettingsProvider } from "@/lib/settings-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StorefrontSettingsProvider settings={settings}>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">
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

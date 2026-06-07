import Link from "next/link";
import Image from "next/image";
import { InstagramIcon } from "@/components/icons/social-icons";
import { getStorefrontSettings } from "@/lib/settings";

export async function SiteFooter() {
  const { hideByreenXo, hideLuxereenWears } = await getStorefrontSettings();

  const shopLinks = [];
  if (!hideByreenXo) shopLinks.push({ label: "byreen.xo", href: "/shop?brand=byreen_xo" });
  if (!hideLuxereenWears) shopLinks.push({ label: "luxereen.wears", href: "/shop?brand=luxereen_wears" });
  shopLinks.push({ label: "Shop All", href: "/shop" });
  shopLinks.push({ label: "Wishlist", href: "/wishlist" });

  const FOOTER_LINKS = {
    shop: shopLinks,
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
    policies: [
      { label: "Shipping", href: "/contact#shipping" },
      { label: "Returns & Exchanges", href: "/contact#returns" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-background mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo.png" alt="Reens" width={140} height={140} className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
              byreen.xo jewelry & luxereen.wears clothing — curated for the modern Pakistani woman.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
              <InstagramIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="link-underline">@byreen.xo</span>
            </a>
          </div>

          <div>
            <h3 className="text-sm font-serif font-semibold uppercase tracking-widest mb-6 text-foreground">Shop</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1 text-sm text-muted-foreground hover:text-primary transition-colors link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-serif font-semibold uppercase tracking-widest mb-6 text-foreground">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1 text-sm text-muted-foreground hover:text-primary transition-colors link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-serif font-semibold uppercase tracking-widest mb-6 text-foreground">Policies</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1 text-sm text-muted-foreground hover:text-primary transition-colors link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground/80 mt-8 leading-relaxed font-medium">
              Nationwide delivery across Pakistan. COD available at checkout.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center text-sm font-medium text-muted-foreground/80">
          © {new Date().getFullYear()} Reens · byreen.xo & luxereen.wears. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

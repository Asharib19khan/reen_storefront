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
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="Reens" width={120} height={120} className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              byreen.xo jewelry & luxereen.wears clothing — curated for the modern Pakistani woman.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <InstagramIcon className="h-5 w-5" />
              @byreen.xo
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">Policies</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Nationwide delivery across Pakistan. COD available at checkout.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Reens · byreen.xo & luxereen.wears. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

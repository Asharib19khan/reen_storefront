export type NavLink = {
  label: string;
  href: string;
  highlight?: boolean;
};

export type NavSection = {
  id: string;
  label: string;
  href: string;
  links: NavLink[];
};

export const HOME_NAV: NavSection = {
  id: "home",
  label: "Home",
  href: "/",
  links: [
    { label: "Best Selling", href: "/#best-selling" },
    { label: "New Arrival", href: "/#new-arrival" },
    { label: "Customer Reviews", href: "/#reviews" },
    { label: "byreen.xo Featured", href: "/#byreen-xo-featured" },
    { label: "luxereen.wears Featured", href: "/#luxereen-wears-featured" },
  ],
};

export const BYREEN_NAV: NavSection = {
  id: "byreen-xo",
  label: "byreen.xo",
  href: "/shop?brand=byreen_xo",
  links: [
    { label: "Shop All", href: "/shop?brand=byreen_xo", highlight: true },
    { label: "New Arrival", href: "/shop?brand=byreen_xo#new-arrivals" },
    { label: "Rings", href: "/shop?brand=byreen_xo#rings" },
    { label: "Bracelets & Anklets", href: "/shop?brand=byreen_xo#bracelets-anklets" },
    { label: "Earrings", href: "/shop?brand=byreen_xo#earrings" },
    { label: "Necklaces", href: "/shop?brand=byreen_xo#necklaces" },
    { label: "Bangles (Churiyaan)", href: "/shop?brand=byreen_xo#bangles" },
  ],
};

export const LUXEREEN_NAV: NavSection = {
  id: "luxereen-wears",
  label: "luxereen.wears",
  href: "/shop?brand=luxereen_wears",
  links: [
    { label: "Shop All", href: "/shop?brand=luxereen_wears", highlight: true },
    { label: "New Arrival", href: "/shop?brand=luxereen_wears#new-arrivals" },
    { label: "Corset Co-ord Sets", href: "/shop?brand=luxereen_wears#corset-co-ord-sets" },
    { label: "Solid & Casual Two-Piece", href: "/shop?brand=luxereen_wears#solid-casual-two-piece-co-ords" },
    { label: "Fusion & Printed Kurtis", href: "/shop?brand=luxereen_wears#fusion-printed-kurtis" },
    { label: "Traditional Fusion", href: "/shop?brand=luxereen_wears#traditional-fusion-coordinates" },
    { label: "Western-Fusion & Skirt Outfits", href: "/shop?brand=luxereen_wears#western-fusion-skirt-outfits" },
  ],
};

export const BRAND_NAV_SECTIONS = [HOME_NAV, BYREEN_NAV, LUXEREEN_NAV];

export const TOP_NAV_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
] as const;

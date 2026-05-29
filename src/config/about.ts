/**
 * About page content — edit copy here.
 */

export const aboutHero = {
  eyebrow: "Our story",
  title: "Reens",
  subtitle:
    "Two sister brands — byreen.xo and luxereen.wears — united under one roof for jewelry, clothing, and the soft moments in between.",
};

export const brandStories = [
  {
    id: "byreen_xo",
    name: "byreen.xo",
    founded: "Est. 2023 · by Farheen",
    tagline: "Modern minimals & permanent jewellery",
    description:
      "byreen.xo began as a love letter to everyday elegance — delicate chains, birthstone rings, traditional jhumkas, and the pieces you reach for without thinking. We pioneered Pakistan's first permanent bracelet kit, and we still show up in person through charm bars, jhumka workshops, and event bookings across Karachi.",
    highlights: [
      "Permanent bracelets & the Infinity kit",
      "Rings, necklaces, earrings & bangles",
      "Charm bars, workshops & event bookings",
      "Hand-finished pieces with a modern pink soul",
    ],
    shopHref: "/shop?brand=byreen_xo",
    instagram: "https://www.instagram.com/byreen.xo/",
    instagramHandle: "@byreen.xo",
  },
  {
    id: "luxereen_wears",
    name: "luxereen.wears",
    founded: "Made for soft girl moments ✨",
    tagline: "Fusion co-ords, kurtis & occasion wear",
    description:
      "luxereen.wears is the clothing arm of the Reens family — corset co-ord sets, printed kurtis, traditional fusion coordinates, and western-fusion styling made for girls who like their outfits soft, structured, and a little bit dreamy. Every drop is styled for real life: brunches, Eid tables, and the in-between days.",
    highlights: [
      "Corset & solid co-ord sets",
      "Fusion & printed kurtis",
      "Traditional fusion coordinates",
      "Nationwide shipping across Pakistan",
    ],
    shopHref: "/shop?brand=luxereen_wears",
    instagram: "https://www.instagram.com/luxereen.wears/",
    instagramHandle: "@luxereen.wears",
  },
] as const;

export const values = [
  {
    title: "Craft with intention",
    body: "Whether it's a welded permanent bracelet or a corset co-ord, every piece is chosen and finished with care — not mass-produced noise.",
  },
  {
    title: "Community first",
    body: "From jhumka workshops to charm bars at birthdays, we believe getting dressed is something you share — not something you do alone.",
  },
  {
    title: "Honest service",
    body: "Order updates, sizing notes, and payment proof — we keep it clear. Message us on Instagram with your order ID and we'll take it from there.",
  },
] as const;

export const promise = {
  shipping: "We ship nationwide across Pakistan. Standard delivery is typically 3–5 business days after your order is confirmed.",
  payments: "Cash on delivery and bank transfer options are available at checkout. For transfers, send payment proof via Instagram with your order ID.",
  policy:
    "Because many pieces are made-to-measure or from limited drops, all sales are final unless we agree otherwise in writing. Check product pages for sizing notes before you order.",
};

/**
 * Contact page content — edit links here.
 */

export const brandContacts = [
  {
    id: "byreen_xo",
    name: "byreen.xo",
    tagline: "Premium jewelry — permanent pieces, chains, and traditional elegance.",
    instagram: "https://www.instagram.com/byreen.xo/",
    instagramHandle: "@byreen.xo",
    shopHref: "/shop?brand=byreen_xo",
  },
  {
    id: "luxereen_wears",
    name: "luxereen.wears",
    tagline: "The clothing collective — co-ords, kurtis, and fusion wear.",
    instagram: "https://www.instagram.com/luxereen.wears/",
    instagramHandle: "@luxereen.wears",
    shopHref: "/shop?brand=luxereen_wears",
  },
] as const;

export type BuilderLink = {
  label: string;
  href: string;
  description?: string;
  kind?: "github" | "linkedin" | "instagram";
};

export const studio = {
  name: "YEEZUS",
  tagline: "Digital studio behind this build",
  instagram: "https://www.instagram.com/yeezus_yzs/",
  instagramHandle: "@yeezus_yzs",
};

export const siteCredits = {
  headline: "Storefront designed & engineered with care",
  bio: "From catalog and checkout to the admin vault — this shop was built as a custom experience for Reens. Need something similar for your brand? Reach out below.",
};

export const buildTeam = [
  {
    name: "Asharib Khan",
    role: "Full-Stack Developer",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Asharib19khan",
        description: "@Asharib19khan",
        kind: "github",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/asharib-khan-435230301/",
        description: "Professional profile",
        kind: "linkedin",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/asharibbb_.x/",
        description: "@asharibbb_.x",
        kind: "instagram",
      },
    ],
  },
  {
    name: "Avisha Rizwan",
    role: "Developer",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/avisha-rizwan",
        description: "@avisha-rizwan",
        kind: "github",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/avisha-rizwan/",
        description: "Professional profile",
        kind: "linkedin",
      },
    ],
  },
] as const;

export function getActiveLinks(links: readonly BuilderLink[]): BuilderLink[] {
  return links.filter((link) => link.href.trim().length > 0);
}

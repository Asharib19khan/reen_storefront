import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type HeroBanner = { title: string; created_at?: string };

/** When duplicate slot titles exist, use the most recently created active banner. */
export function pickLatestBanner<T extends HeroBanner>(
  banners: T[] | null | undefined,
  title: string
): T | null {
  if (!banners?.length) return null;
  const matches = banners.filter((b) => b.title === title);
  if (matches.length === 0) return null;
  return matches.sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  )[0];
}

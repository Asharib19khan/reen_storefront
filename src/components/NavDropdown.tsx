"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import type { NavSection } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 150;

export function NavDropdown({ section, isTransparent }: { section: NavSection, isTransparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const showMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <div
      className="relative"
      onMouseEnter={showMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={section.href}
        className={cn(
          "flex items-center gap-1 text-xs tracking-widest uppercase font-semibold transition-colors hover:text-primary py-2",
          isTransparent ? "text-white drop-shadow-md hover:text-white/80" : "text-foreground/80"
        )}
        onFocus={showMenu}
      >
        {section.label}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </Link>

      <div
        className={cn(
          "absolute top-full left-0 pt-2 min-w-[240px] z-[60] transition-all duration-150",
          open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1 pointer-events-none"
        )}
        onMouseEnter={showMenu}
        onMouseLeave={scheduleClose}
      >
        <div
          role="menu"
          aria-label={`${section.label} categories`}
          className="rounded-lg border border-border bg-popover shadow-lg py-2"
        >
          {section.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className={cn(
                "block px-4 py-2.5 text-sm transition-colors hover:bg-muted hover:text-primary",
                link.highlight ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

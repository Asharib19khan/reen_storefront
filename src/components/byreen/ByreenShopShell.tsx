import { byreenFontClassName } from "./byreen-fonts";
import "./byreen-theme.css";

export function ByreenShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${byreenFontClassName} byreen-shop min-h-screen font-[family-name:var(--font-byreen-body)] text-[#5c1a3d]`}
    >
      {children}
    </div>
  );
}

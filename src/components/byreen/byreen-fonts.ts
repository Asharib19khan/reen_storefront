import { Cormorant_Garamond, Nunito } from "next/font/google";

export const byreenDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-byreen-display",
});

export const byreenBody = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-byreen-body",
});

export const byreenFontClassName = `${byreenDisplay.variable} ${byreenBody.variable}`;

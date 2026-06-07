"use client";

import React, { createContext, useContext } from "react";
import type { StorefrontSettings } from "./settings";

const StorefrontSettingsContext = createContext<StorefrontSettings>({
  hideByreenXo: false,
  hideLuxereenWears: false,
});

export function StorefrontSettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: StorefrontSettings;
}) {
  return (
    <StorefrontSettingsContext.Provider value={settings}>
      {children}
    </StorefrontSettingsContext.Provider>
  );
}

export function useStorefrontSettings() {
  return useContext(StorefrontSettingsContext);
}

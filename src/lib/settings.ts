import { getSupabase } from "@/lib/supabase";

export interface StorefrontSettings {
  hideByreenXo: boolean;
  hideLuxereenWears: boolean;
}

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  const supabase = getSupabase();
  if (!supabase) {
    return { hideByreenXo: false, hideLuxereenWears: false };
  }

  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["hide_byreen_xo", "hide_luxereen_wears"]);

  const getSetting = (key: string) => {
    return data?.find((s) => s.key === key)?.value === "true";
  };

  return {
    hideByreenXo: getSetting("hide_byreen_xo"),
    hideLuxereenWears: getSetting("hide_luxereen_wears"),
  };
}

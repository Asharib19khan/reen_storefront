export type StoreProduct = {
  id: string;
  title: string;
  price: number;
  image_urls: string[] | null;
  quantity: number;
  brand: "byreen_xo" | "luxereen_wears";
  category: string | null;
  is_new_arrival?: boolean;
  is_active?: boolean;
  created_at?: string;
  description?: string | null;
  hook_text?: string | null;
  color_options?: string | null;
  size_matrix?: string | null;
  interactive_addons?: string | null;
  has_custom_measurement?: boolean;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  product_id: string;
  color: string | null;
  size: string | null;
  quantity: number;
  sku: string | null;
};

export type ShopChip = {
  id: string;
  label: string;
};

import { createClient } from "@supabase/supabase-js";

const url = "https://axsqlwhreervfzrsqcin.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4c3Fsd2hyZWVydmZ6cnNxY2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTE5OTgsImV4cCI6MjA5OTE4Nzk5OH0.xqm6mn_r6wYpJvErNEnzABwO67tXYVShVNIEcZMfqa4";
const supabase = createClient(url, key);

const tables = [
  "products",
  "product_variants",
  "orders",
  "order_items",
  "customer_reviews",
  "customer_wishes",
  "hero_banners",
  "promo_codes",
  "settings",
  "user_roles"
];

async function verify() {
  console.log("Verifying tables in new project...");
  let allGood = true;
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("id").limit(1);
    if (error) {
      console.log(`❌ Error verifying table '${table}': ${error.message}`);
      allGood = false;
    } else {
      console.log(`✅ Table '${table}' exists and is accessible.`);
    }
  }
  if (allGood) {
    console.log("SUCCESS: All tables are verified and present!");
  }
}

verify();

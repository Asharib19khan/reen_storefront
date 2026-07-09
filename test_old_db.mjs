import { createClient } from "@supabase/supabase-js";

const oldUrl = "https://rojndqmecvvvbupvqspr.supabase.co";
const oldKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvam5kcW1lY3Z2dmJ1cHZxc3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTgxMzYyNywiZXhwIjoyMDk1Mzg5NjI3fQ.LMCHwDklKGYZsvocPhqKN5X01sJIl1KSD3Sazz6kxa4";

const supabase = createClient(oldUrl, oldKey);

async function test() {
  console.log("Attempting to fetch from restricted database...");
  const { data, error } = await supabase.from("products").select("*").limit(5);
  if (error) {
    console.error("Failed to fetch:", error.message, error.code, error.details);
  } else {
    console.log("Success! Data fetched:", data.length, "rows.");
    console.log(data);
  }
}

test();

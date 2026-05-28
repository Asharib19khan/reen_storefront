import { supabase } from "@/lib/supabase";
import { CheckoutClient } from "./CheckoutClient";

export const revalidate = 0;

export default async function CheckoutPage() {
  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "payment_details")
    .single();

  const paymentDetails = setting?.value || "Payment instructions will be provided after checkout.";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <h1 className="text-3xl font-bold text-foreground mb-10 text-center">Checkout</h1>
      <CheckoutClient paymentDetails={paymentDetails} />
    </div>
  );
}

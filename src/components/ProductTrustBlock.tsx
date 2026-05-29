import { Truck, ShieldCheck, Banknote, RotateCcw } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "3–5 business days across Pakistan",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Quality",
    description: "Curated pieces from our collections",
  },
  {
    icon: RotateCcw,
    title: "Easy Exchanges",
    description: "Standard sizes within 7 days",
  },
];

export function ProductTrustBlock() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-10">
      {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex flex-col gap-2 p-4 rounded-xl border bg-muted/20 text-center sm:text-left sm:flex-row sm:items-start"
        >
          <div className="mx-auto sm:mx-0 shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

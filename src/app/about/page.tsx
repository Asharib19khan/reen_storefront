import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Gem, Shirt, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { aboutHero, brandStories, promise, values } from "@/config/about";

export const metadata: Metadata = {
  title: "About Us | Reens",
  description:
    "Meet Reens — home to byreen.xo jewellery and luxereen.wears clothing. Permanent pieces, fusion co-ords, and soft girl moments, shipped across Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col">
      <section className="border-b border-border/50 bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            {aboutHero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground tracking-tight mb-4">
            {aboutHero.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {aboutHero.subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-8">
          {brandStories.map((brand, index) => {
            const Icon = index === 0 ? Gem : Shirt;
            return (
              <Card
                key={brand.id}
                className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary mb-2">
                        {brand.founded}
                      </p>
                      <CardTitle className="text-3xl font-serif">{brand.name}</CardTitle>
                      <CardDescription className="mt-2 text-base font-medium text-foreground/80">
                        {brand.tagline}
                      </CardDescription>
                    </div>
                    <div className="shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 pt-2">
                  <p className="text-muted-foreground leading-relaxed">{brand.description}</p>
                  <ul className="space-y-2">
                    {brand.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button asChild className="rounded-full">
                      <Link href={brand.shopHref}>Shop {brand.name}</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full">
                      <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
                        {brand.instagramHandle}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-foreground">
              What we stand for
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border/60 bg-background/80 p-6 text-center md:text-left"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 md:py-20 w-full">
        <Card className="border-border/60 bg-card/90">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">Our promise to you</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>{promise.shipping}</p>
            <p>{promise.payments}</p>
            <p>{promise.policy}</p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button asChild className="rounded-full px-8">
            <Link href="/shop">Explore the shop</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

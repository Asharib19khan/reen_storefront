import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ShoppingBag, Code2 } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  brandContacts,
  buildTeam,
  getActiveLinks,
  siteCredits,
  studio,
  type BuilderLink,
} from "@/config/contact";

export const metadata: Metadata = {
  title: "Contact Us | Reens",
  description:
    "Connect with byreen.xo and luxereen.wears on Instagram. Questions about orders, sizing, or collaborations.",
};

const kindIcons: Record<NonNullable<BuilderLink["kind"]>, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
};

function SocialLink({ link }: { link: BuilderLink }) {
  const Icon = (link.kind && kindIcons[link.kind]) ?? ArrowUpRight;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-left hover:border-primary/40 hover:bg-primary/5 transition-colors"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{link.label}</span>
        {link.description && (
          <span className="block text-xs text-muted-foreground truncate">{link.description}</span>
        )}
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full flex flex-col">
      <section className="border-b border-border/50 bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            We&apos;d love to hear from you
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            For styling advice, custom measurements, order updates, or collaborations —
            reach us on Instagram. We typically reply within 24 hours.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-foreground">
            Our Brands
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Follow and message the collective that fits your style.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {brandContacts.map((brand) => (
            <Card
              key={brand.id}
              className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-serif">{brand.name}</CardTitle>
                    <CardDescription className="mt-2 text-base leading-relaxed">
                      {brand.tagline}
                    </CardDescription>
                  </div>
                  <div className="shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <InstagramIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-2">
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                >
                  {brand.instagramHandle}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild variant="default" className="rounded-full">
                    <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon className="mr-2 h-4 w-4" />
                      Message on Instagram
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={brand.shopHref}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Shop collection
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Already placed an order?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Use your order ID from checkout when you message us — it helps us find your
            parcel faster. For bank transfers, send proof of payment to either brand
            Instagram with your name and order ID.
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 w-full">
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden mb-10">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Code2 className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Crafted for Reens
            </p>
            <CardTitle className="text-2xl md:text-3xl font-serif mt-2">
              {siteCredits.headline}
            </CardTitle>
            <CardDescription className="text-base mt-3 leading-relaxed max-w-2xl mx-auto">
              {siteCredits.bio}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <a
              href={studio.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 hover:bg-primary/10 transition-colors"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-left">
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                  {studio.name}
                </span>
                <span className="block font-medium text-foreground">
                  {studio.instagramHandle} · Studio Instagram
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </a>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <h3 className="text-xl font-serif uppercase tracking-widest text-foreground">
            Meet the builders
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Available for freelance storefronts, admin panels, and brand sites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {buildTeam.map((member) => {
            const links = getActiveLinks(member.links);
            return (
              <Card key={member.name} className="border-border/60 bg-card/90">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-serif">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {links.map((link) => (
                    <SocialLink key={`${member.name}-${link.label}`} link={link} />
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="shipping" className="max-w-3xl mx-auto px-4 pb-8 scroll-mt-28">
        <h3 className="text-lg font-semibold mb-2">Shipping</h3>
        <p className="text-sm text-muted-foreground">
          Nationwide delivery across Pakistan in 3–5 business days. Shipping cost is confirmed at checkout.
        </p>
      </section>
      <section id="returns" className="max-w-3xl mx-auto px-4 pb-16 scroll-mt-28">
        <h3 className="text-lg font-semibold mb-2">Returns & Exchanges</h3>
        <p className="text-sm text-muted-foreground">
          Custom-measured items are non-refundable. Standard sizes may be exchanged within 7 days with tags attached.
        </p>
      </section>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, HandCoins, Languages, Mic, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { ChatAssistant } from "@/components/ChatAssistant";
import { EligibilityWizard } from "@/components/EligibilityWizard";
import { SchemeDashboard } from "@/components/SchemeDashboard";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/matching";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Udyam Saathi — Scheme Finder for SC/ST/OBC & Women Entrepreneurs" },
      {
        name: "description",
        content:
          "Find matching Indian government schemes, subsidies and loans for SC, ST, OBC, Divyangjan and women entrepreneurs. Voice input, AI matching and Hindi-English guidance.",
      },
      {
        property: "og:title",
        content: "Udyam Saathi — Government Scheme Finder for Entrepreneurs",
      },
      {
        property: "og:description",
        content:
          "AI-matched government schemes with subsidy estimates, missing-document checks and step-by-step apply guidance in Hindi and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Mic,
    title: "Speak, don't type",
    body: "Voice input on every question for low-literacy users.",
  },
  {
    icon: HandCoins,
    title: "Subsidy estimates",
    body: "See how much margin money or subsidy you may receive.",
  },
  {
    icon: Languages,
    title: "Hindi & English",
    body: "Saathi answers your questions in either language.",
  },
  {
    icon: Accessibility,
    title: "Built for access",
    body: "Large tap targets, high contrast and screen-reader labels.",
  },
];

function Index() {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <ShieldCheck className="size-4" aria-hidden /> Government scheme guidance
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
            Udyam Saathi — your scheme companion
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-95 sm:text-lg">
            For SC, ST, OBC, Divyangjan and women entrepreneurs. Answer six simple questions — by
            voice or touch — and get AI-matched loans, subsidies and a step-by-step application
            plan.
          </p>
          <p className="mt-2 max-w-2xl text-sm opacity-90">
            अनुसूचित जाति/जनजाति, ओबीसी, दिव्यांगजन और महिला उद्यमियों के लिए — बोलकर आवेदन शुरू
            करें।
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="soft">
              <a href="#wizard">Start eligibility check</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-14 px-4 py-12">
        <section
          aria-label="Why use this portal"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="surface-card p-4">
              <f.icon className="size-6 text-primary" aria-hidden />
              <h2 className="mt-3 text-base font-semibold">{f.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        {profile ? (
          <SchemeDashboard profile={profile} onRestart={() => setProfile(null)} />
        ) : (
          <EligibilityWizard onComplete={setProfile} />
        )}
      </main>

      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="mx-auto max-w-5xl px-4 text-sm text-muted-foreground">
          <p>
            Udyam Saathi is an independent guidance tool. Scheme rules, subsidy rates and ceilings
            change — always confirm on the official portal or with your bank branch before applying.
          </p>
        </div>
      </footer>

      <ChatAssistant profile={profile} />
    </div>
  );
}

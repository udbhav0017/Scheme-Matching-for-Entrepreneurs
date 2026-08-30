import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ExternalLink, FileWarning, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getMatchedSchemes } from "@/lib/matching.functions";
import { formatINR, type MatchResult, type Profile } from "@/lib/matching";

function scoreTone(score: number) {
  if (score >= 80) return { label: "Strong match", className: "text-success" };
  if (score >= 55) return { label: "Possible match", className: "text-warning" };
  return { label: "Weak match", className: "text-muted-foreground" };
}

function GuidanceCard({ match, onClose }: { match: MatchResult; onClose: () => void }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/60 p-4">
      <h4 className="font-semibold">Apply guidance — {match.scheme.name}</h4>
      <ol className="mt-3 space-y-2 text-sm">
        {match.scheme.applySteps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="hero">
          <a href={match.scheme.applyUrl} target="_blank" rel="noreferrer noopener">
            Open official portal <ExternalLink className="size-4" />
          </a>
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close guidance
        </Button>
      </div>
    </div>
  );
}

export function SchemeDashboard({ profile, onRestart }: { profile: Profile; onRestart: () => void }) {
  const matchFn = useServerFn(getMatchedSchemes);
  const { data, isPending, error } = useQuery({
    queryKey: ["scheme-matches", profile],
    queryFn: () => matchFn({ data: profile }),
  });
  const results: MatchResult[] = data ?? [];
  const [openId, setOpenId] = useState<string | null>(null);

  const totalSubsidy = results
    .filter((r) => r.score >= 55)
    .reduce((sum, r) => sum + r.subsidy, 0);

  if (isPending) {
    return (
      <section className="mx-auto w-full max-w-5xl" aria-live="polite">
        <div className="surface-card p-8 text-center text-muted-foreground">
          Checking the scheme database for your matches…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-5xl" aria-live="assertive">
        <div className="surface-card p-8 text-center">
          <p className="font-semibold">We could not load the schemes right now.</p>
          <p className="mt-1 text-sm text-muted-foreground">Please try again in a moment.</p>
          <Button variant="outline" className="mt-4" onClick={onRestart}>
            Start again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" aria-labelledby="dash-heading" className="mx-auto w-full max-w-5xl">
      <div className="surface-card gradient-warm p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="dash-heading" className="text-2xl font-bold sm:text-3xl">
              Your AI scheme matches
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {profile.category} entrepreneur · {profile.sector} · {profile.state} · loan{" "}
              {formatINR(profile.loan)} · income {formatINR(profile.income)}
            </p>
          </div>
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RotateCcw className="size-4" /> Start again
          </Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Schemes matched
            </p>
            <p className="mt-1 text-2xl font-bold">
              {results.filter((r) => r.score >= 55).length}
            </p>
          </div>
          <div className="rounded-xl bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estimated total subsidy
            </p>
            <p className="mt-1 text-2xl font-bold text-success">{formatINR(totalSubsidy)}</p>
          </div>
          <div className="rounded-xl bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Best match score
            </p>
            <p className="mt-1 text-2xl font-bold">{results[0]?.score ?? 0}%</p>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-5">
        {results.map((r) => {
          const tone = scoreTone(r.score);
          return (
            <li key={r.scheme.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold">{r.scheme.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {r.scheme.nameHi} · {r.scheme.ministry}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{r.score}%</p>
                  <p className={`text-xs font-semibold ${tone.className}`}>{tone.label}</p>
                </div>
              </div>

              <Progress
                value={r.score}
                className="mt-3 h-2.5"
                aria-label={`Match score ${r.score} percent for ${r.scheme.name}`}
              />

              <p className="mt-4 text-sm">{r.scheme.summary}</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Estimated subsidy / benefit
                  </p>
                  <p className="mt-1 text-xl font-bold text-success">{formatINR(r.subsidy)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Up to {Math.round(r.scheme.subsidyRate * 100)}% of eligible project cost
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <FileWarning className="size-4" aria-hidden /> Missing documents
                  </p>
                  {r.missingDocuments.length === 0 ? (
                    <p className="mt-1 text-sm font-medium text-success">
                      All required documents ready
                    </p>
                  ) : (
                    <ul className="mt-1 list-inside list-disc text-sm">
                      {r.missingDocuments.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {r.gaps.length > 0 && (
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                  {r.gaps.join(" · ")}
                </p>
              )}

              <div className="mt-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setOpenId(openId === r.scheme.id ? null : r.scheme.id)}
                  aria-expanded={openId === r.scheme.id}
                >
                  <Sparkles className="size-5" /> 1-click Apply Guidance
                </Button>
              </div>

              {openId === r.scheme.id && (
                <GuidanceCard match={r} onClose={() => setOpenId(null)} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

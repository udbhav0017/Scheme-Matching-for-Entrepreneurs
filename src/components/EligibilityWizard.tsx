import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { VoiceInput } from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Profile } from "@/lib/matching";
import { saveUserProfile } from "@/lib/profiles.functions";
import { CATEGORIES, SECTORS, STATES, type Category } from "@/lib/schemes";

const DOCUMENTS = [
  "Aadhaar card",
  "PAN card",
  "Caste certificate",
  "OBC caste certificate (non-creamy layer)",
  "SC caste certificate",
  "ST caste certificate",
  "UDID / disability certificate (40%+)",
  "Income certificate",
  "Udyam registration",
  "Bank statement (6 months)",
  "Project report / business plan",
  "Detailed project report",
];

const STEPS = [
  "Annual income",
  "Caste category",
  "Business sector",
  "State",
  "Loan required",
  "Documents you have",
];

function parseSpokenNumber(text: string) {
  const clean = text.toLowerCase().replace(/,/g, "");
  const num = parseFloat(clean.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return null;
  if (/crore|करोड़/.test(clean)) return Math.round(num * 10000000);
  if (/lakh|lac|लाख/.test(clean)) return Math.round(num * 100000);
  if (/thousand|हज़ार|हजार/.test(clean)) return Math.round(num * 1000);
  return Math.round(num);
}

export function EligibilityWizard({ onComplete }: { onComplete: (p: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState<number | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [sector, setSector] = useState("");
  const [state, setState] = useState("");
  const [loan, setLoan] = useState<number | "">("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const saveProfile = useServerFn(saveUserProfile);

  const canContinue = [
    income !== "",
    category !== "",
    sector !== "",
    state !== "",
    loan !== "",
    true,
  ][step];

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const profile: Profile = {
      income: Number(income),
      category: category as Category,
      sector,
      state,
      loan: Number(loan),
      documents,
    };
    setSaving(true);
    setSaveError(false);
    try {
      await saveProfile({ data: profile });
      onComplete(profile);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const toggleDoc = (doc: string) =>
    setDocuments((d) => (d.includes(doc) ? d.filter((x) => x !== doc) : [...d, doc]));

  return (
    <section
      id="wizard"
      aria-labelledby="wizard-heading"
      className="surface-card mx-auto w-full max-w-3xl p-5 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="wizard-heading" className="text-2xl font-bold sm:text-3xl">
          Eligibility Wizard
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
      </div>

      <Progress
        value={((step + 1) / STEPS.length) * 100}
        className="mt-4 h-3"
        aria-label={`Progress: step ${step + 1} of ${STEPS.length}`}
      />

      <div className="mt-8 min-h-[19rem]" role="group" aria-live="polite">
        {step === 0 && (
          <div className="space-y-4">
            <Label htmlFor="income" className="text-lg">
              What is your household annual income? (₹)
            </Label>
            <p className="text-sm text-muted-foreground">
              सालाना पारिवारिक आय कितनी है? You can also speak, e.g. "2 lakh".
            </p>
            <Input
              id="income"
              inputMode="numeric"
              className="h-14 text-lg"
              value={income}
              placeholder="e.g. 240000"
              onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <div className="flex flex-wrap gap-2">
              {[120000, 300000, 600000, 1200000].map((v) => (
                <Button key={v} type="button" variant="soft" onClick={() => setIncome(v)}>
                  ₹{v.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
            <VoiceInput
              label="Speak your income"
              onResult={(t) => {
                const n = parseSpokenNumber(t);
                if (n !== null) setIncome(n);
              }}
            />
          </div>
        )}

        {step === 1 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium">Which category do you belong to?</legend>
            <p className="text-sm text-muted-foreground">आप किस श्रेणी से हैं?</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <Button
                  key={c}
                  type="button"
                  size="lg"
                  variant={category === c ? "default" : "soft"}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
            <VoiceInput
              label="Speak your category"
              onResult={(t) => {
                const found = CATEGORIES.find((c) => t.toLowerCase().includes(c.toLowerCase()));
                if (found) setCategory(found);
                else if (/महिला|woman|women/i.test(t)) setCategory("Women");
                else if (/दिव्यांग|disab/i.test(t)) setCategory("Divyangjan");
              }}
            />
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium">What is your business sector?</legend>
            <p className="text-sm text-muted-foreground">आपका व्यवसाय किस क्षेत्र में है?</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SECTORS.map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="lg"
                  variant={sector === s ? "default" : "soft"}
                  aria-pressed={sector === s}
                  onClick={() => setSector(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
            <VoiceInput
              label="Speak your business type"
              onResult={(t) => {
                const found = SECTORS.find((s) =>
                  t.toLowerCase().includes(s.split(" ")[0]!.toLowerCase()),
                );
                if (found) setSector(found);
              }}
            />
          </fieldset>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Label htmlFor="state" className="text-lg">
              Which state do you live in?
            </Label>
            <p className="text-sm text-muted-foreground">आप किस राज्य में रहते हैं?</p>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-14 w-full rounded-lg border border-input bg-background px-4 text-lg text-foreground"
            >
              <option value="">Select your state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <VoiceInput
              label="Speak your state"
              onResult={(t) => {
                const found = STATES.find((s) => t.toLowerCase().includes(s.toLowerCase()));
                if (found) setState(found);
              }}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Label htmlFor="loan" className="text-lg">
              How much loan do you need? (₹)
            </Label>
            <p className="text-sm text-muted-foreground">आपको कितने ऋण की आवश्यकता है?</p>
            <Input
              id="loan"
              inputMode="numeric"
              className="h-14 text-lg"
              value={loan}
              placeholder="e.g. 500000"
              onChange={(e) => setLoan(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <div className="flex flex-wrap gap-2">
              {[50000, 200000, 500000, 1000000, 2500000].map((v) => (
                <Button key={v} type="button" variant="soft" onClick={() => setLoan(v)}>
                  ₹{v.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
            <VoiceInput
              label="Speak the loan amount"
              onResult={(t) => {
                const n = parseSpokenNumber(t);
                if (n !== null) setLoan(n);
              }}
            />
          </div>
        )}

        {step === 5 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium">Which documents do you already have?</legend>
            <p className="text-sm text-muted-foreground">
              आपके पास कौन से दस्तावेज़ हैं? We will list the missing ones for you.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DOCUMENTS.map((d) => {
                const active = documents.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDoc(d)}
                    className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "border-success bg-success/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <CheckCircle2
                      className={`size-5 shrink-0 ${active ? "text-success" : "opacity-30"}`}
                      aria-hidden
                    />
                    {d}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>

      {saveError && (
        <p role="alert" className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          We could not save your answers. Please check your connection and try again.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || saving}
        >
          <ArrowLeft className="size-5" /> Back
        </Button>
        <Button type="button" variant="hero" size="lg" onClick={next} disabled={!canContinue || saving}>
          {saving ? (
            <>
              Saving your answers…
              <Loader2 className="size-5 animate-spin" aria-hidden />
            </>
          ) : (
            <>
              {step === STEPS.length - 1 ? "See my schemes" : "Continue"}
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
}

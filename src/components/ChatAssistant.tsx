import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { VoiceInput } from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAssistant } from "@/lib/assistant.functions";
import type { Profile } from "@/lib/matching";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Record<"en" | "hi", string> = {
  en: "Namaste! I am Saathi. Ask me anything about government schemes, subsidies or documents.",
  hi: "नमस्ते! मैं साथी हूँ। सरकारी योजनाओं, सब्सिडी या दस्तावेज़ों के बारे में कुछ भी पूछें।",
};

const SUGGESTIONS: Record<"en" | "hi", string[]> = {
  en: ["Which scheme suits an SC woman baker?", "What documents does PMEGP need?", "Is MUDRA collateral-free?"],
  hi: ["पीएमईजीपी में कितनी सब्सिडी मिलती है?", "मुद्रा लोन कैसे लें?", "दिव्यांगजन के लिए कौन सी योजना है?"],
};

export function ChatAssistant({ profile }: { profile?: Profile | null }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ask = useServerFn(askAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await ask({
        data: {
          messages: next.slice(-12),
          language,
          profileSummary: profile
            ? `${profile.category} entrepreneur in ${profile.sector}, ${profile.state}, annual income ₹${profile.income}, seeking loan ₹${profile.loan}.`
            : undefined,
        },
      });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch {
      setError(
        language === "hi"
          ? "अभी उत्तर नहीं मिल सका। कृपया दोबारा प्रयास करें।"
          : "Could not get an answer right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="hero"
        size="lg"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full shadow-[var(--shadow-elevated)]"
        aria-label="Open Saathi chat assistant"
      >
        <MessageCircle className="size-5" /> Ask Saathi
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Saathi scheme assistant"
          className="fixed inset-0 z-50 flex items-end justify-end bg-foreground/30 p-0 sm:p-5"
        >
          <div className="flex h-[100dvh] w-full flex-col bg-card sm:h-[36rem] sm:max-w-md sm:rounded-2xl sm:border sm:border-border sm:shadow-[var(--shadow-elevated)]">
            <header className="flex items-center justify-between gap-2 rounded-t-2xl bg-[image:var(--gradient-hero)] px-4 py-3 text-primary-foreground">
              <div>
                <p className="font-semibold">Saathi · साथी</p>
                <p className="text-xs opacity-90">Scheme guidance in Hindi & English</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                  aria-label="Switch language"
                  className="text-primary-foreground hover:bg-white/15"
                >
                  {language === "en" ? "हिंदी" : "English"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="text-primary-foreground hover:bg-white/15"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4" aria-live="polite">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-sm shadow-[var(--shadow-soft)]">
                {GREETING[language]}
              </div>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                      : "max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-sm shadow-[var(--shadow-soft)]"
                  }
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <p className="text-sm text-muted-foreground">
                  {language === "hi" ? "साथी सोच रहा है…" : "Saathi is thinking…"}
                </p>
              )}
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS[language].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-card px-3 py-2 text-xs hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex flex-col gap-2 border-t border-border bg-card p-3"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Your question
                </label>
                <Input
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "hi" ? "अपना सवाल लिखें…" : "Type your question…"}
                  className="h-12"
                  maxLength={500}
                />
                <Button type="submit" size="icon" disabled={loading} aria-label="Send message">
                  <Send className="size-5" />
                </Button>
              </div>
              <VoiceInput
                lang={language === "hi" ? "hi-IN" : "en-IN"}
                label={language === "hi" ? "बोलकर पूछें" : "Ask by voice"}
                onResult={(t) => void send(t)}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

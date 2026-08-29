import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { SCHEMES, SCHEME_CORPUS } from "./schemes";

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
  language: z.enum(["en", "hi"]),
  profileSummary: z.string().max(1000).optional(),
});

/** Lightweight keyword retrieval over the scheme guideline corpus (RAG). */
function retrieve(query: string, limit = 4) {
  const chunks = SCHEME_CORPUS.split("\n\n---\n\n");
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9\u0900-\u097F]+/)
    .filter((t) => t.length > 2);

  const scored = chunks.map((chunk, i) => {
    const hay = chunk.toLowerCase();
    let score = 0;
    for (const t of terms) if (hay.includes(t)) score += 1;
    const s = SCHEMES[i];
    if (s && query.toLowerCase().includes(s.id.split("-")[0]!)) score += 3;
    return { chunk, score };
  });

  const hits = scored.filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
  return (hits.length ? hits : scored).slice(0, limit).map((c) => c.chunk);
}

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI assistant is not configured yet.");

    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    const context = retrieve(lastUser?.content ?? "").join("\n\n---\n\n");

    const gateway = createLovableAiGatewayProvider(key);

    const system = [
      "You are Saathi, a friendly government-scheme guide for marginalized entrepreneurs in India (SC, ST, OBC, Divyangjan and women).",
      data.language === "hi"
        ? "Reply in simple conversational Hindi (Devanagari). Keep sentences short."
        : "Reply in simple, plain English. Keep sentences short and avoid jargon.",
      "Answer ONLY from the scheme guidelines given below. If the answer is not there, say you are not sure and suggest visiting the official portal or the nearest bank branch.",
      "Use short bullet points, mention exact loan amounts, subsidy percentages and required documents when relevant.",
      "Never promise guaranteed approval. Encourage the user warmly.",
      data.profileSummary ? `Applicant profile: ${data.profileSummary}` : "",
      `\nSCHEME GUIDELINES:\n${context}`,
    ]
      .filter(Boolean)
      .join("\n");

    const result = streamText({
      model: gateway("google/gemini-3.7-flash"),
      system,
      messages: data.messages,
    });

    return { reply: await result.text };
  });

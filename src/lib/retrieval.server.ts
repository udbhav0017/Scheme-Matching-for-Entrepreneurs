import { buildCorpus, fetchSchemes } from "./schemes.server";

/** Lightweight keyword retrieval over the scheme guidelines stored in the database (RAG). */
export async function retrieve(query: string, limit = 4) {
  const schemes = await fetchSchemes();
  const chunks = buildCorpus(schemes);

  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9\u0900-\u097F]+/)
    .filter((t) => t.length > 2);

  const scored = chunks.map((chunk, i) => {
    const hay = chunk.toLowerCase();
    let score = 0;
    for (const t of terms) if (hay.includes(t)) score += 1;
    const s = schemes[i];
    if (s && query.toLowerCase().includes(s.id.split("-")[0]!)) score += 3;
    return { chunk, score };
  });

  const hits = scored.filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
  return (hits.length ? hits : scored).slice(0, limit).map((c) => c.chunk);
}

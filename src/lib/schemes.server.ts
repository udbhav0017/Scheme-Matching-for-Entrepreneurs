import { createClient } from "@supabase/supabase-js";

import type { Category, Scheme } from "./schemes";

type SchemeRow = {
  id: string;
  name: string;
  name_hi: string;
  ministry: string;
  summary: string;
  summary_hi: string;
  categories: string[];
  sectors: string[];
  states: string[];
  max_income: number;
  min_loan: number;
  max_loan: number;
  subsidy_rate: number;
  subsidy_cap: number;
  documents: string[];
  apply_url: string;
  apply_steps: string[];
};

function serverClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function toScheme(row: SchemeRow): Scheme {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi,
    ministry: row.ministry,
    summary: row.summary,
    summaryHi: row.summary_hi,
    categories: row.categories as Category[],
    sectors: row.sectors,
    states: row.states,
    maxIncome: Number(row.max_income),
    minLoan: Number(row.min_loan),
    maxLoan: Number(row.max_loan),
    subsidyRate: Number(row.subsidy_rate),
    subsidyCap: Number(row.subsidy_cap),
    documents: row.documents,
    applyUrl: row.apply_url,
    applySteps: row.apply_steps,
  };
}

/**
 * Fetch schemes from the database. When a profile filter is supplied the
 * category / sector / state filtering happens in Postgres, not in JS.
 */
export async function fetchSchemes(filter?: {
  category?: string;
  sector?: string;
  state?: string;
}): Promise<Scheme[]> {
  let query = serverClient().from("schemes").select("*").order("name");

  if (filter?.category) {
    query = query.overlaps("categories", [filter.category, "General"]);
  }
  if (filter?.sector) {
    query = query.overlaps("sectors", [filter.sector, "any"]);
  }
  if (filter?.state) {
    query = query.overlaps("states", [filter.state, "all"]);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as SchemeRow[]).map(toScheme);
}

export function buildCorpus(schemes: Scheme[]) {
  return schemes.map(
    (s) =>
      `SCHEME: ${s.name} (${s.nameHi})\nMinistry: ${s.ministry}\nEligible categories: ${s.categories.join(", ")}\nSectors: ${s.sectors.join(", ")}\nIncome ceiling: ₹${s.maxIncome.toLocaleString("en-IN")}\nLoan range: ₹${s.minLoan.toLocaleString("en-IN")} - ₹${s.maxLoan.toLocaleString("en-IN")}\nSubsidy: up to ${Math.round(s.subsidyRate * 100)}% (cap ₹${s.subsidyCap.toLocaleString("en-IN")})\nDocuments: ${s.documents.join("; ")}\nHow to apply: ${s.applySteps.join(" ")}\nOfficial portal: ${s.applyUrl}\nSummary: ${s.summary}\nHindi: ${s.summaryHi}`,
  );
}

import { matchSchemes, type MatchResult, type Profile } from "./matching";
import { fetchSchemes } from "./schemes.server";

/** Queries the schemes table (filters applied in Postgres) and scores the results. */
export async function matchProfile(profile: Profile): Promise<MatchResult[]> {
  let schemes = await fetchSchemes({
    category: profile.category,
    sector: profile.sector,
    state: profile.state,
  });

  // Fall back to the full catalogue so the applicant always sees options with gaps explained.
  if (schemes.length === 0) schemes = await fetchSchemes();

  return matchSchemes(profile, schemes);
}

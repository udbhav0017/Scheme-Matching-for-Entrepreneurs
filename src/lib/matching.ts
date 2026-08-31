import type { Category, Scheme } from "./schemes";

export type Profile = {
  name: string;
  income: number;
  category: Category;
  sector: string;
  state: string;
  loan: number;
  documents: string[];
};

export type MatchResult = {
  scheme: Scheme;
  score: number;
  subsidy: number;
  missingDocuments: string[];
  reasons: string[];
  gaps: string[];
};

export function matchSchemes(profile: Profile, schemes: Scheme[]): MatchResult[] {
  return schemes.map((scheme) => {
    const reasons: string[] = [];
    const gaps: string[] = [];
    let score = 0;

    // Category fit (35)
    if (scheme.categories.includes(profile.category)) {
      score += 35;
      reasons.push(`Reserved / open for ${profile.category} applicants`);
    } else if (scheme.categories.includes("General")) {
      score += 18;
      reasons.push("Open to all categories");
    } else {
      gaps.push(`Primarily for ${scheme.categories.join(", ")} applicants`);
    }

    // Income fit (20)
    if (profile.income <= scheme.maxIncome) {
      score += 20;
      reasons.push(
        `Your income is within the ₹${scheme.maxIncome.toLocaleString("en-IN")} ceiling`,
      );
    } else {
      const over = profile.income / scheme.maxIncome;
      score += over < 1.3 ? 8 : 0;
      gaps.push(
        `Income ceiling is ₹${scheme.maxIncome.toLocaleString("en-IN")} — yours is higher`,
      );
    }

    // Sector fit (20)
    if (scheme.sectors.includes("any")) {
      score += 15;
      reasons.push("All business sectors accepted");
    } else if (scheme.sectors.includes(profile.sector)) {
      score += 20;
      reasons.push(`Designed for the ${profile.sector} sector`);
    } else {
      gaps.push(`Limited to ${scheme.sectors.join(", ")}`);
    }

    // Loan fit (15)
    if (profile.loan >= scheme.minLoan && profile.loan <= scheme.maxLoan) {
      score += 15;
      reasons.push(
        `₹${profile.loan.toLocaleString("en-IN")} sits inside the sanction range`,
      );
    } else if (profile.loan < scheme.minLoan) {
      score += 5;
      gaps.push(`Minimum loan size is ₹${scheme.minLoan.toLocaleString("en-IN")}`);
    } else {
      score += 5;
      gaps.push(`Maximum loan size is ₹${scheme.maxLoan.toLocaleString("en-IN")}`);
    }

    // State availability (10)
    if (scheme.states.includes("all") || scheme.states.includes(profile.state)) {
      score += 10;
      reasons.push(`Available in ${profile.state}`);
    } else {
      gaps.push(`Not currently notified in ${profile.state}`);
    }

    const eligibleLoan = Math.min(Math.max(profile.loan, scheme.minLoan), scheme.maxLoan);
    const subsidy = Math.round(Math.min(eligibleLoan * scheme.subsidyRate, scheme.subsidyCap));
    const missingDocuments = scheme.documents.filter((d) => !profile.documents.includes(d));

    return {
      scheme,
      score: Math.max(0, Math.min(100, score)),
      subsidy,
      missingDocuments,
      reasons,
      gaps,
    };
  }).sort((a, b) => b.score - a.score);
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

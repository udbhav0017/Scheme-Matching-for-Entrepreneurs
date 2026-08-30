export type Category = "SC" | "ST" | "OBC" | "General" | "Divyangjan" | "Women";

export type Scheme = {
  id: string;
  name: string;
  nameHi: string;
  ministry: string;
  summary: string;
  summaryHi: string;
  categories: Category[];
  sectors: string[]; // "any" allowed
  states: string[]; // "all" allowed
  maxIncome: number; // annual household income ceiling in INR
  minLoan: number;
  maxLoan: number;
  subsidyRate: number; // fraction of loan given as subsidy / margin money
  subsidyCap: number;
  documents: string[];
  applyUrl: string;
  applySteps: string[];
};

export const SECTORS = [
  "Manufacturing",
  "Retail / Trading",
  "Food Processing",
  "Handicrafts & Textiles",
  "Services",
  "Agriculture & Allied",
  "Transport",
  "Technology",
] as const;

export const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const CATEGORIES: Category[] = ["SC", "ST", "OBC", "General", "Divyangjan", "Women"];

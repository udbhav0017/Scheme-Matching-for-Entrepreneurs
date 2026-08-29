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

export const SCHEMES: Scheme[] = [
  {
    id: "standup-india",
    name: "Stand-Up India",
    nameHi: "स्टैंड-अप इंडिया",
    ministry: "Ministry of Finance / SIDBI",
    summary:
      "Bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST and one woman borrower per bank branch for greenfield enterprises in manufacturing, services, trading or agri-allied activities.",
    summaryHi:
      "अनुसूचित जाति/जनजाति और महिला उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण, नए उद्यम हेतु।",
    categories: ["SC", "ST", "Women"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 5000000,
    minLoan: 1000000,
    maxLoan: 10000000,
    subsidyRate: 0.15,
    subsidyCap: 1500000,
    documents: [
      "Aadhaar card",
      "PAN card",
      "Caste certificate",
      "Project report / business plan",
      "Bank statement (6 months)",
      "Proof of business address",
    ],
    applyUrl: "https://www.standupmitra.in",
    applySteps: [
      "Register on Stand-Up Mitra portal with Aadhaar and mobile number.",
      "Fill the borrower profile and upload the project report.",
      "Select a nearby bank branch as your lending partner.",
      "Attend the branch appointment with original documents.",
      "Track sanction status on the portal dashboard.",
    ],
  },
  {
    id: "pmegp",
    name: "PMEGP (Prime Minister's Employment Generation Programme)",
    nameHi: "पीएमईजीपी",
    ministry: "Ministry of MSME / KVIC",
    summary:
      "Credit-linked subsidy of 15–35% of project cost for new micro enterprises; higher margin money subsidy for SC/ST/OBC, women and Divyangjan applicants, especially in rural areas.",
    summaryHi:
      "नए सूक्ष्म उद्यमों के लिए परियोजना लागत पर 15–35% तक मार्जिन मनी सब्सिडी; विशेष श्रेणियों को अधिक लाभ।",
    categories: ["SC", "ST", "OBC", "Women", "Divyangjan", "General"],
    sectors: ["Manufacturing", "Services", "Food Processing", "Handicrafts & Textiles", "Retail / Trading"],
    states: ["all"],
    maxIncome: 1200000,
    minLoan: 50000,
    maxLoan: 5000000,
    subsidyRate: 0.35,
    subsidyCap: 1750000,
    documents: [
      "Aadhaar card",
      "Caste / Divyangjan certificate",
      "Education certificate (8th pass for higher projects)",
      "Detailed project report",
      "Rural area certificate (if applicable)",
      "Passport size photograph",
    ],
    applyUrl: "https://www.kviconline.gov.in/pmegpeportal",
    applySteps: [
      "Create an applicant login on the PMEGP e-portal.",
      "Fill Form-1 with project cost and category details.",
      "Upload DPR and certificates, then submit online.",
      "Appear before the District Task Force Committee interview.",
      "Complete EDP training after bank sanction to release subsidy.",
    ],
  },
  {
    id: "mudra",
    name: "PM MUDRA Yojana (Shishu / Kishore / Tarun)",
    nameHi: "प्रधानमंत्री मुद्रा योजना",
    ministry: "Ministry of Finance / MUDRA",
    summary:
      "Collateral-free loans up to ₹20 lakh for non-farm micro enterprises. Shishu up to ₹50,000, Kishore up to ₹5 lakh, Tarun up to ₹20 lakh with interest subvention for priority groups.",
    summaryHi:
      "गैर-कृषि सूक्ष्म उद्यमों के लिए ₹20 लाख तक बिना गारंटी ऋण — शिशु, किशोर और तरुण श्रेणियाँ।",
    categories: ["SC", "ST", "OBC", "General", "Women", "Divyangjan"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 1000000,
    minLoan: 10000,
    maxLoan: 2000000,
    subsidyRate: 0.05,
    subsidyCap: 100000,
    documents: [
      "Aadhaar card",
      "PAN card",
      "Business registration / Udyam certificate",
      "Quotation of machinery to be purchased",
      "Bank statement (6 months)",
    ],
    applyUrl: "https://www.udyamimitra.in",
    applySteps: [
      "Prepare a one-page business plan and machinery quotations.",
      "Apply on Udyami Mitra or at any bank branch.",
      "Choose Shishu/Kishore/Tarun based on your loan need.",
      "Submit KYC documents; no collateral is required.",
      "Receive MUDRA card for working capital withdrawals.",
    ],
  },
  {
    id: "nsfdc",
    name: "NSFDC Term Loan for SC Entrepreneurs",
    nameHi: "एनएसएफडीसी सावधि ऋण",
    ministry: "Ministry of Social Justice & Empowerment",
    summary:
      "Concessional term loans at 6% interest for Scheduled Caste entrepreneurs with double the poverty line income, routed through State Channelising Agencies.",
    summaryHi: "अनुसूचित जाति उद्यमियों हेतु 6% ब्याज पर रियायती सावधि ऋण।",
    categories: ["SC"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 300000,
    minLoan: 50000,
    maxLoan: 3000000,
    subsidyRate: 0.2,
    subsidyCap: 500000,
    documents: [
      "SC caste certificate",
      "Income certificate (double poverty line)",
      "Aadhaar card",
      "Project proposal",
      "Two guarantors' details",
    ],
    applyUrl: "https://nsfdc.nic.in",
    applySteps: [
      "Contact your State Channelising Agency (SCA) district office.",
      "Submit the loan application with caste and income certificate.",
      "SCA appraises the project and forwards it to NSFDC.",
      "Sign the loan agreement and receive staged disbursement.",
    ],
  },
  {
    id: "nstfdc",
    name: "NSTFDC Adivasi Mahila Sashaktikaran Yojana",
    nameHi: "आदिवासी महिला सशक्तिकरण योजना",
    ministry: "Ministry of Tribal Affairs",
    summary:
      "Loans up to ₹2 lakh at 4% interest exclusively for Scheduled Tribe women entrepreneurs; 90% of project cost funded by NSTFDC.",
    summaryHi: "अनुसूचित जनजाति महिला उद्यमियों के लिए 4% ब्याज पर ₹2 लाख तक ऋण।",
    categories: ["ST", "Women"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 300000,
    minLoan: 20000,
    maxLoan: 200000,
    subsidyRate: 0.25,
    subsidyCap: 50000,
    documents: [
      "ST caste certificate",
      "Income certificate",
      "Aadhaar card",
      "Small project note",
      "Bank passbook copy",
    ],
    applyUrl: "https://nstfdc.in",
    applySteps: [
      "Approach the State Channelising Agency for tribal welfare.",
      "Submit AMSY application with ST certificate.",
      "Attend skill/EDP orientation if advised.",
      "Loan is disbursed through the SCA to your bank account.",
    ],
  },
  {
    id: "nhfdc",
    name: "NHFDC Divyangjan Swavalamban Scheme",
    nameHi: "दिव्यांगजन स्वावलंबन योजना",
    ministry: "Department of Empowerment of Persons with Disabilities",
    summary:
      "Concessional loans up to ₹50 lakh for persons with 40% or more disability to start or expand self-employment ventures, at 5–8% interest.",
    summaryHi:
      "40% या अधिक दिव्यांगता वाले व्यक्तियों हेतु स्वरोजगार के लिए ₹50 लाख तक रियायती ऋण।",
    categories: ["Divyangjan"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 3000000,
    minLoan: 25000,
    maxLoan: 5000000,
    subsidyRate: 0.1,
    subsidyCap: 300000,
    documents: [
      "UDID / disability certificate (40%+)",
      "Aadhaar card",
      "Income certificate",
      "Project report",
      "Residence proof",
    ],
    applyUrl: "https://nhfdc.nic.in",
    applySteps: [
      "Obtain or update your UDID card.",
      "Apply through the State Channelising Agency or NHFDC portal.",
      "Submit project report and disability certificate.",
      "Loan sanctioned and disbursed via the SCA / partner bank.",
    ],
  },
  {
    id: "nbcfdc",
    name: "NBCFDC Term Loan for OBC Entrepreneurs",
    nameHi: "एनबीसीएफडीसी सावधि ऋण",
    ministry: "Ministry of Social Justice & Empowerment",
    summary:
      "Term loans up to ₹15 lakh at concessional interest for Other Backward Class entrepreneurs with annual family income up to ₹3 lakh.",
    summaryHi: "अन्य पिछड़ा वर्ग उद्यमियों के लिए ₹15 लाख तक रियायती सावधि ऋण।",
    categories: ["OBC"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 300000,
    minLoan: 25000,
    maxLoan: 1500000,
    subsidyRate: 0.15,
    subsidyCap: 200000,
    documents: [
      "OBC caste certificate (non-creamy layer)",
      "Income certificate",
      "Aadhaar card",
      "Project report",
      "Guarantor documents",
    ],
    applyUrl: "https://nbcfdc.gov.in",
    applySteps: [
      "Locate your State Channelising Agency on the NBCFDC site.",
      "Submit the application with OBC and income certificates.",
      "SCA verifies and sanctions the loan.",
      "Repay in easy monthly instalments to keep interest concession.",
    ],
  },
  {
    id: "pmfme",
    name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
    nameHi: "पीएम सूक्ष्म खाद्य उद्यम योजना",
    ministry: "Ministry of Food Processing Industries",
    summary:
      "35% credit-linked capital subsidy up to ₹10 lakh for micro food processing units, with seed capital for SHG members and priority for SC/ST/women applicants.",
    summaryHi:
      "सूक्ष्म खाद्य प्रसंस्करण इकाइयों हेतु ₹10 लाख तक 35% क्रेडिट-लिंक्ड सब्सिडी।",
    categories: ["SC", "ST", "OBC", "Women", "General", "Divyangjan"],
    sectors: ["Food Processing", "Agriculture & Allied"],
    states: ["all"],
    maxIncome: 1500000,
    minLoan: 50000,
    maxLoan: 3000000,
    subsidyRate: 0.35,
    subsidyCap: 1000000,
    documents: [
      "Aadhaar card",
      "Udyam registration",
      "FSSAI registration",
      "Detailed project report",
      "Land / rent agreement of unit",
    ],
    applyUrl: "https://pmfme.mofpi.gov.in",
    applySteps: [
      "Register on the PMFME MIS portal.",
      "Get a District Resource Person assigned for free DPR help.",
      "Submit application with FSSAI and Udyam details.",
      "Bank appraisal, then subsidy credited to the loan account.",
    ],
  },
  {
    id: "mahila-udyam-nidhi",
    name: "Mahila Udyam Nidhi / Women Enterprise Credit",
    nameHi: "महिला उद्यम निधि",
    ministry: "SIDBI / Public Sector Banks",
    summary:
      "Soft loans up to ₹10 lakh for women entrepreneurs setting up small-scale units, with lower interest and up to 10 years repayment.",
    summaryHi: "महिला उद्यमियों हेतु ₹10 लाख तक सॉफ्ट लोन, कम ब्याज और लंबी अवधि।",
    categories: ["Women", "SC", "ST", "OBC", "General"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 2000000,
    minLoan: 50000,
    maxLoan: 1000000,
    subsidyRate: 0.1,
    subsidyCap: 100000,
    documents: [
      "Aadhaar card",
      "Business plan",
      "Udyam registration",
      "Bank statement (6 months)",
      "Photograph and address proof",
    ],
    applyUrl: "https://www.sidbi.in",
    applySteps: [
      "Prepare a business plan with cost and revenue projections.",
      "Approach a public sector bank branch or SIDBI portal.",
      "Submit the application under the women entrepreneur category.",
      "Complete the bank interview and receive sanction.",
    ],
  },
  {
    id: "cgtmse",
    name: "CGTMSE Collateral-Free Credit Guarantee",
    nameHi: "सीजीटीएमएसई ऋण गारंटी",
    ministry: "Ministry of MSME",
    summary:
      "Credit guarantee cover up to ₹5 crore so micro and small enterprises can borrow without collateral; guarantee fee concession for women, SC/ST and Divyangjan borrowers.",
    summaryHi:
      "सूक्ष्म एवं लघु उद्यमों के लिए ₹5 करोड़ तक बिना गारंटी ऋण हेतु क्रेडिट गारंटी कवर।",
    categories: ["SC", "ST", "OBC", "General", "Women", "Divyangjan"],
    sectors: ["any"],
    states: ["all"],
    maxIncome: 10000000,
    minLoan: 100000,
    maxLoan: 50000000,
    subsidyRate: 0.02,
    subsidyCap: 200000,
    documents: [
      "Udyam registration certificate",
      "Aadhaar and PAN",
      "Project report",
      "Bank loan application",
      "GST registration (if applicable)",
    ],
    applyUrl: "https://www.cgtmse.in",
    applySteps: [
      "Apply for a term/working capital loan at a member lending institution.",
      "Request the branch to cover the loan under CGTMSE.",
      "Bank files the guarantee application; you pay a reduced fee.",
      "Loan disbursed without collateral or third-party guarantee.",
    ],
  },
];

export const SCHEME_CORPUS = SCHEMES.map(
  (s) =>
    `SCHEME: ${s.name} (${s.nameHi})\nMinistry: ${s.ministry}\nEligible categories: ${s.categories.join(", ")}\nSectors: ${s.sectors.join(", ")}\nIncome ceiling: ₹${s.maxIncome.toLocaleString("en-IN")}\nLoan range: ₹${s.minLoan.toLocaleString("en-IN")} - ₹${s.maxLoan.toLocaleString("en-IN")}\nSubsidy: up to ${Math.round(s.subsidyRate * 100)}% (cap ₹${s.subsidyCap.toLocaleString("en-IN")})\nDocuments: ${s.documents.join("; ")}\nHow to apply: ${s.applySteps.join(" ")}\nOfficial portal: ${s.applyUrl}\nSummary: ${s.summary}\nHindi: ${s.summaryHi}`,
).join("\n\n---\n\n");

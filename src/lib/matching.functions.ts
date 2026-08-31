import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { matchProfile } from "./matching.server";

const ProfileInput = z.object({
  name: z.string().trim().min(1).max(100),
  income: z.number().nonnegative(),
  category: z.enum(["SC", "ST", "OBC", "General", "Divyangjan", "Women"]),
  sector: z.string().min(1),
  state: z.string().min(1),
  loan: z.number().nonnegative(),
  documents: z.array(z.string()),
});

export const getMatchedSchemes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileInput.parse(input))
  .handler(async ({ data }) => matchProfile(data));

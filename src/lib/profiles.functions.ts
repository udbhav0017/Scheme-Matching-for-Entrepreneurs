import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ProfileInput = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  income: z.number().nonnegative(),
  category: z.enum(["SC", "ST", "OBC", "General", "Divyangjan", "Women"]),
  sector: z.string().min(1),
  state: z.string().min(1),
  loan: z.number().nonnegative(),
  documents: z.array(z.string()),
});

export const saveUserProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_profiles").insert({
      name: data.name,
      income: data.income,
      category: data.category,
      sector: data.sector,
      state: data.state,
      loan: data.loan,
      documents: data.documents,
    });
    if (error) {
      console.error("[user_profiles] insert failed:", error.message);
      throw new Error("Could not save your answers. Please try again.");
    }
    return { ok: true };
  });

import { z } from "zod";

export const OutgoingEmail = z.object({
  to: z.string(),
  subject: z.string(),
  text: z.string(),
});

export type OutgoingEmail = z.infer<typeof OutgoingEmail>;

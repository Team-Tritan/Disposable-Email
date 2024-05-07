import { z } from "zod";

export const OutgoingEmail = z.object({
  to: z.string(),
  subject: z.string(),
  body: z.string(),
});

export type OutgoingEmail = z.infer<typeof OutgoingEmail>;

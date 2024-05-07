import { z } from "zod";

const InboxSchema = z.object({
  id: z.string(),
  attachments: z.array(z.any()),
  body: z.string(),
  date: z.string(),
  from: z.string(),
  subject: z.string(),
  to: z.string(),
});

const SentSchema = z.object({
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  date: z.string(),
  ip: z.string(),
});

const MailboxDataSchema = z.object({
  inbox: z.array(InboxSchema),
  sent: z.array(SentSchema),
});

export type IMailboxData = z.infer<typeof MailboxDataSchema>;
export type IEmail = z.infer<typeof InboxSchema>;
export type ISentEmail = z.infer<typeof SentSchema>;

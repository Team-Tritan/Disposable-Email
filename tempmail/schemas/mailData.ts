import { z } from "zod";

const MessageSchema = z.object({
  id: z.string(),
  attachments: z.array(z.any()),
  body: z.string(),
  date: z.string(),
  from: z.string(),
  subject: z.string(),
  to: z.string(),
});

const MailboxDataSchema = z.object({
  messages: z.array(MessageSchema),
});

export type IMessage = z.infer<typeof MessageSchema>;
export type IMailboxData = z.infer<typeof MailboxDataSchema>;

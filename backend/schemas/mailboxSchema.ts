import mongoose, { Document, Model, Schema } from "mongoose";

interface Mailbox {
  email: string;
  password: string;
  date: Date;
  ip: string;
  deleted: boolean;
}

interface MailboxDocument extends Mailbox, Document {}

const MailboxSchema = new Schema<MailboxDocument>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  ip: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

const Mailbox: Model<MailboxDocument> = mongoose.model<MailboxDocument>(
  "Mailbox",
  MailboxSchema,
  "Mailbox"
);

export { Mailbox, MailboxSchema };

import mongoose, { Document, Model, Schema } from "mongoose";
import { SentMail } from "../lib/db";

interface SentMailDocument extends SentMail, Document {}

const SentSchema = new Schema<SentMailDocument>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  ip: { type: String, required: true },
});

export const Sent: Model<SentMailDocument> = mongoose.model<SentMailDocument>(
  "Sent",
  SentSchema,
  "Sent"
);

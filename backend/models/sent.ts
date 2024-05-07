import mongoose, { Document, Model, Schema } from "mongoose";

interface SentMail {
  from: string;
  to: string;
  subject: string;
  body: string;
  date?: Date;
  ip: string;
}

interface SentMailDocument extends SentMail, Document {}

const SentModel = new Schema<SentMailDocument>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  ip: { type: String, default: "localhost" },
});

const SentEmail: Model<SentMailDocument> = mongoose.model<SentMailDocument>(
  "Sent",
  SentModel,
  "Sent"
);

export { SentMail, SentEmail };

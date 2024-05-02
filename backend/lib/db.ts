import mongoose from "mongoose";
import { config } from "../config";
import { Sent } from "../schemas/sentSchema";

export interface SentMail {
  from: string;
  to: string;
  subject: string;
  text: string;
  date?: Date;
  ip: string;
}

async function initDB(): Promise<void> {
  try {
    await mongoose.connect(config.dbURI);
    console.log("> MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}

async function storeSentMail(
  from: string,
  to: string,
  subject: string,
  text: string,
  ip: string
): Promise<void> {
  const sentMail = new Sent({ from, to, subject, text, ip });
  await sentMail.save();
}

export { initDB, storeSentMail };

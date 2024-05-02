import mongoose from "mongoose";
import { config } from "../config";
import { Sent } from "../schemas/sentSchema";
import { Mailbox } from "../schemas/mailboxSchema";

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

async function storeCreatedInbox(
  email: string,
  password: string,
  date: Date,
  ip: string
): Promise<void> {
  const inbox = new Mailbox({ email, password, date, ip });
  await inbox.save();
}

async function markAsDeleted(email: string): Promise<void> {
  await Mailbox.updateOne({ email }, { deleted: true });
}

export { initDB, storeSentMail, storeCreatedInbox, markAsDeleted };

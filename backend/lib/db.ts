import mongoose from "mongoose";
import { config } from "../config";
import { SentEmail } from "../models/sent";
import { Mailbox } from "../models/mailbox";

/**
 * Creates indexes for the Mailbox and Sent collections in the database.
 *
 * If the indexes do not exist, they will be created.
 * @returns {Promise<void>} A promise that resolves once the indexes are created.
 */
async function createIndexes(): Promise<void> {
  const mailboxCollection = mongoose.connection.collection("Mailbox");
  const sentCollection = mongoose.connection.collection("Sent");

  const mailboxIndexes = await mailboxCollection.indexes();
  if (!mailboxIndexes.find((index) => index.name === "$**_text")) {
    await mailboxCollection.createIndex({ "$**": "text" });
  }

  const sentIndexes = await sentCollection.indexes();
  if (!sentIndexes.find((index) => index.name === "$**_text")) {
    await sentCollection.createIndex({ "$**": "text" });
  }
}

/**
 * Initialize the MongoDB connection
 * @returns Promise<void>
 */
async function initDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongoURI);
    await createIndexes();

    console.log("> MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}

/**
 * Store the sent mail in the database
 * @param from
 * @param to
 * @param subject
 * @param body
 * @param ip
 */
async function storeSentMail(
  from: string,
  to: string,
  subject: string,
  body: string,
  ip: string
): Promise<void> {
  const sentMail = new SentEmail({ from, to, subject, body, ip });
  await sentMail.save();
}

/**
 * Store the created inbox in the database
 * @param email
 * @param password
 * @param date
 * @param ip
 */
async function storeCreatedInbox(
  email: string,
  password: string,
  date: Date,
  ip: string
): Promise<void> {
  await Mailbox.create({ email, password, date, ip, createdAt: new Date() });
}

/**
 * Mark an mailbox as deleted
 * @param email
 */
async function markAsDeleted(email: string): Promise<void> {
  await Mailbox.updateOne({ email }, { deleted: true });
}

/**
 *  Get the sent mail for a mailbox
 * @param email
 * @returns @schemas/sentSchema
 */
async function getSentMail(email: string): Promise<any> {
  return await SentEmail.find(
    { from: email },
    {
      ip: 0,
      _id: 0,
    }
  );
}

export { initDB, storeSentMail, storeCreatedInbox, markAsDeleted, getSentMail };

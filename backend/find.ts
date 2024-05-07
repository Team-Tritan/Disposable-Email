import { SentEmail } from "./models/sent";
import { Mailbox } from "./models/mailbox";
import { initDB } from "./lib/db";

(async () => {
  await initDB();
})();

/**
 * Search for entries by a given term
 * @param term
 */
async function findByTerm(term: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let sentEmails, mailboxes;

  if (emailRegex.test(term)) {
    sentEmails = await SentEmail.find({ $or: [{ to: term }, { from: term }] });
    mailboxes = await Mailbox.find({ email: term });
  } else {
    sentEmails = await SentEmail.find({ $text: { $search: term } });
    mailboxes = await Mailbox.find({ email: { $regex: term, $options: "i" } });
  }

  return { sentEmails, mailboxes };
}

const term = process.argv[2];

(async () => {
  try {
    const result = await findByTerm(term);
    console.log("Search results:");
    result.sentEmails.forEach((email, index) => {
      console.log(`Email ${index + 1}:`);
      console.log(`From: ${email.from}`);
      console.log(`To: ${email.to}`);
      console.log(`Subject: ${email.subject}`);
      console.log(`Body: ${email.body}`);
      console.log(`IP(s): ${email.ip}`);
      console.log(`Date: ${email.date}`);
      console.log();
    });
    result.mailboxes.forEach((mailbox, index) => {
      console.log(`Mailbox ${index + 1}:`);
      console.log(`Email: ${mailbox.email}`);
      console.log(`IP(s): ${mailbox.ip}`);
      console.log(`Date: ${mailbox.date}`);
      console.log();
    });
    process.exit(0);
  } catch (e) {
    console.error("Error searching for term", e);
    process.exit(1);
  }
})();

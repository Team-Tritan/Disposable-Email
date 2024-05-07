import { Mailbox } from "../models/mailbox";
import { markAsDeleted } from "./db";
import mailcow from "./mailcow";

setInterval(async () => {
  try {
    const expiredMailboxes = await Mailbox.find({
      createdAt: { $lt: new Date(Date.now() - 168 * 60 * 60 * 1000) }, // Mailbox older than 7 days
    });

    for (const mailbox of expiredMailboxes) {
      await mailcow.deleteMailbox(mailbox.email);
      await markAsDeleted(mailbox.email);
    }
  } catch (error) {
    console.error(error);
  }
}, 60 * 60 * 1000); // Every hour

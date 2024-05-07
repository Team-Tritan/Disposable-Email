import { Router } from "express";
import { config } from "../config";
import { IEmail, ISentEmail } from "../schemas/mailbox";
import { getSentMail, markAsDeleted, storeCreatedInbox } from "../lib/db";
import ImapWrapper from "../lib/imap";
import MailcowWrapper from "../lib/mailcow";
import { randomBytes } from "crypto";
import randomWords from "random-words";
import { htmlToText } from "html-to-text";

const route = Router();
const usernameRegex = /[A-Za-z-_0-9]/gm;
const mailcow = new MailcowWrapper(config.mailcowAPIKey);

/**
 * Gets the inbox and sent mail
 * PATCH: /api/mailbox
 * HEADERS: { X-Auth-Email: string, X-Auth-Token: string }
 * @returns { inbox: any[], sent: any[] }
 * @returns { error: boolean, status: number, message: string }
 */
route.patch("/", async (req, res) => {
  let username = req.get("X-Auth-Email") as string;
  let password = req.get("X-Auth-Token") as string;

  if (!username || !password)
    return res.status(400).json({
      error: true,
      status: 400,
      message: "Email or password not provided!",
    });

  const imap = new ImapWrapper(username, password);

  imap.on("ready", async (cli) => {
    const inbox = (await cli
      .fetchMessagesSync()
      .then((res) => res)
      .catch((err) => {
        return null;
      })) as IEmail[];

    imap.imap.end();

    let sent: ISentEmail[] = await getSentMail(username);
    if (inbox == null) return res.json({ inbox: [], sent: sent });

    inbox.forEach((email) => {
      email.body = htmlToText(email.body, {
        preserveNewlines: true,
      });
    });

    return res.json({
      inbox,
      sent,
    });
  });

  imap.on("error", () => {
    return res.status(401).json({
      error: true,
      status: 401,
      message: "Unauthorized",
    });
  });
});

/**
 * Creates a mailbox
 * PUT: /api/mailbox
 * @returns { email: string, password: string }
 * @returns { error: boolean, status: number, message: string }
 */
route.put("/", async (req, res) => {
  const username = `${randomWords(1)}.${randomBytes(3).toString("hex")}`;
  const password = `${randomBytes(22).toString("hex")}`;

  if (!usernameRegex.test(username) || username.length > 64)
    return res.status(400).json({
      error: true,
      status: 400,
      validation_field: "username",
      message: "Username invalid!",
    });

  if (password.length > 128)
    return res.status(400).json({
      error: true,
      status: 400,
      validation_field: "password",
      message: "Password is too long!",
    });

  let randomDomain =
    config.domains[Math.floor(Math.random() * config.domains.length)];

  const mailcowRes = await mailcow.createMailbox({
    domain: randomDomain,
    name: username,
    password: password,
    quota: "40",
    forcePwUpdate: "0",
  });

  if (!mailcowRes)
    return res.status(500).json({
      error: true,
      message: "internal server error!",
    });

  if (mailcowRes[0] && mailcowRes[0].type == "danger") {
    let errorMessage = "Internal server error!";
    if (mailcowRes[0].msg.includes("password_complexity")) {
      errorMessage = "Password does not meet complexity requirements";
    } else if (mailcowRes[0].msg.includes("object_exists")) {
      errorMessage = "Username taken";
    }
    return res.status(400).json({
      error: true,
      status: 400,
      validation_field: mailcowRes[0].msg,
      message: errorMessage,
    });
  }

  const ip =
    req.headers["x-forwarded-for"]?.toString() ||
    req.socket.remoteAddress?.toString() ||
    "";

  await storeCreatedInbox(
    `${username}@${randomDomain}`,
    password,
    new Date(),
    ip
  );

  return res.json({
    error: false,
    status: 200,
    email: `${username}@${randomDomain}`,
    password: password,
  });
});

/**
 * Deletes a mailbox
 * DELETE: /api/mailbox
 * HEADERS: { X-Auth-Email: string, X-Auth-Token: string }
 * @returns { error: boolean, status: number, message: string }
 */
route.delete("/", async (req, res) => {
  let username = req.get("X-Auth-Email") as string;
  let password = req.get("X-Auth-Token") as string;

  if (!username || !password)
    return res.status(400).json({
      error: true,
      status: 400,
      message: "Email or password not provided!",
    });

  const mailcowRes = await mailcow.deleteMailbox(username);

  if (!mailcowRes)
    return res.status(500).json({
      error: true,
      status: 500,
      message: "internal server error!",
    });

  await markAsDeleted(username);

  return res.json({
    error: false,
    status: 200,
    success: true,
  });
});

export default route;

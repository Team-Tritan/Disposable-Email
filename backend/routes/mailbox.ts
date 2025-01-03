import { randomBytes } from "crypto";
import { Router } from "express";
import { htmlToText } from "html-to-text";
import randomWords from "random-words";
import { config } from "../config";
import { getSentMail, markAsDeleted, storeCreatedInbox } from "../lib/db";
import ImapWrapper from "../lib/imap";
import apiWrapper from "../lib/posteIO";
import { IEmail, ISentEmail } from "../schemas/mailbox";

const route = Router();
const usernameRegex = /[A-Za-z-_0-9]/gm;

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

  imap.on("error", (e: any) => {
    console.error(`[IMAP Fetch Error] ` + e);
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

  await apiWrapper.createMailbox({
    name: username,
    email: `${username}@${randomDomain}`,
    passwordPlaintext: password,
    disabled: false,
  });

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

  await apiWrapper.deleteMailbox(username);

  await markAsDeleted(username);

  return res.json({
    error: false,
    status: 200,
    success: true,
  });
});

export default route;

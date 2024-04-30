import { Router } from "express";
import { randomBytes } from "crypto";
import randomWords from "random-words";
import Mailcow from "../lib/mailcow";
import ImapWrapper from "../lib/imap";
import { config } from "../config";

const route = Router();
const usernameRegex = /[A-Za-z-_0-9]/gm;

/**
 * Fetches messages from mailbox
 * GET: /api/mailbox/fetch
 * @query email
 * @query password
 */
route.get("/fetch", async (req, res) => {
  let username = req.query.email as string;
  let password = req.query.password as string;

  if (!username || !password)
    return res.status(400).json({
      error: true,
      message: "Email or password not provided!",
    });

  const imap = new ImapWrapper(username, password);

  imap.on("ready", async (cli) => {
    const messages = await cli
      .fetchMessagesSync()
      .then((res) => res)
      .catch((err) => {
        return null;
      });

    imap.imap.end();

    if (messages == null) return res.status(200).send({ messages: [] });

    return res.json({
      messages,
    });
  });

  imap.on("error", () => {
    return res.status(401).json({
      error: true,
      message: "Unathorized!",
    });
  });
});

/**
 * Makes a new mailbox
 * POST: /api/mailbox/create
 * @param username - The username of the mailbox
 * @param password - The password of the mailbox
 */
route.post("/create", async (req, res) => {
  const username = req.body.username
    ? req.body.username
    : `${randomWords(1)}.${randomBytes(5).toString("hex")}`;
  const password = req.body.password
    ? req.body.password
    : `${randomBytes(22).toString("hex")}`;

  if (!usernameRegex.test(username) || username.length > 64)
    return res.status(400).json({
      error: true,
      validation_field: "username",
      message: "Username invalid!",
    });

  if (password.length > 128)
    return res.status(400).json({
      error: true,
      validation_field: "password",
      message: "Password is too long!",
    });

  const mailcow = new Mailcow(config.mailcowAPIKey);

  const mailcowRes = await mailcow.createMailbox({
    domain: config.domain,
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

  //Error handle specific mailcow errors
  if (mailcowRes[0] && mailcowRes[0].type == "danger") {
    if (mailcowRes[0].msg.includes("password_complexity")) {
      return res.status(400).json({
        error: true,
        validation_field: "password",
        message: "Password does not meet complexity requirements",
      });
    }
    if (mailcowRes[0].msg.includes("object_exists")) {
      return res.status(400).json({
        error: true,
        validation_field: "username",
        message: "Username taken",
      });
    } else {
      return res.status(500).json({
        error: true,
        message: "internal server error!",
      });
    }
  }

  return res.json({
    error: false,
    email: `${username}@${config.domain}`,
    password: password,
  });
});

/**
 * Deletes a mailbox
 * POST: /api/mailbox/delete
 * @param email - The email of the mailbox
 * @param password - The password of the mailbox
 */
route.post("/delete", async (req, res) => {
  let username = req.query.email as string;
  let password = req.query.password as string;

  if (!username || !password)
    return res.status(400).json({
      error: true,
      message: "Email or password not provided!",
    });

  const mailcow = new Mailcow(config.mailcowAPIKey);

  const mailcowRes = await mailcow.deleteMailbox(username);

  if (!mailcowRes)
    return res.status(500).json({
      error: true,
      message: "internal server error!",
    });

  return res.json({
    success: true,
  });
});

export default route;

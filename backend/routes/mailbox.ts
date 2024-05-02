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
 * PATCH: /api/mailbox
 * @query email
 * @query password
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
      status: 401,
      message: "Unathorized",
    });
  });
});

/**
 * Makes a new mailbox
 * PUT: /api/mailbox
 * @param username - The username of the mailbox
 * @param password - The password of the mailbox
 */
route.put("/", async (req, res) => {
  const username = req.body.username
    ? req.body.username
    : `${randomWords(1)}.${randomBytes(5).toString("hex")}`;
  const password = req.body.password
    ? req.body.password
    : `${randomBytes(22).toString("hex")}`;

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

  const mailcow = new Mailcow(config.mailcowAPIKey);

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

  //Error handle specific mailcow errors
  if (mailcowRes[0] && mailcowRes[0].type == "danger") {
    if (mailcowRes[0].msg.includes("password_complexity")) {
      return res.status(400).json({
        error: true,
        status: 400,
        validation_field: "password",
        message: "Password does not meet complexity requirements",
      });
    }
    if (mailcowRes[0].msg.includes("object_exists")) {
      return res.status(400).json({
        error: true,
        status: 400,
        validation_field: "username",
        message: "Username taken",
      });
    } else {
      return res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error!",
      });
    }
  }

  return res.status(200).json({
    error: false,
    status: 200,
    email: `${username}@${randomDomain}`,
    password: password,
  });
});

/**
 * Deletes a mailbox
 * DELETE: /api/mailbox
 * @param email - The email of the mailbox
 * @param password - The password of the mailbox
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

  const mailcow = new Mailcow(config.mailcowAPIKey);

  const mailcowRes = await mailcow.deleteMailbox(username);

  if (!mailcowRes)
    return res.status(500).json({
      error: true,
      status: 500,
      message: "internal server error!",
    });

  return res.status(200).json({
    error: false,
    status: 200,
    success: true,
  });
});

export default route;

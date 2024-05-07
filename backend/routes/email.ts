import { Router } from "express";
import { storeSentMail } from "../lib/db";
import SmtpWrapper from "../lib/smtp";
import ImapWrapper from "../lib/imap";

const route = Router();

/**
 * Sends an email
 * POST: /api/email
 * HEADERS: { X-Auth-Email: string, X-Auth-Token: string }
 * BODY: { to: string, subject: string, body: string }
 * @returns { error: boolean, status: number, message: string }
 */
route.post("/", async (req, res) => {
  const username = req.get("X-Auth-Email") as string;
  const password = req.get("X-Auth-Token") as string;

  if (!username || !password)
    return res.status(401).json({
      error: true,
      status: 401,
      message: "Missing authentication headers",
    });

  const { to, subject, body } = req.body;

  if (!to || !subject || !body)
    return res.status(400).json({
      error: true,
      status: 401,
      message: "Missing required body fields",
    });

  const ip =
    req.headers["x-forwarded-for"]?.toString() ||
    req.socket.remoteAddress?.toString() ||
    "";

  const smtp = new SmtpWrapper(username, password);

  smtp
    .sendMail(to, subject, body)
    .then(async () => {
      await storeSentMail(username, to, subject, body, ip);

      return res.json({
        error: false,
        status: 200,
        message: "Email sent successfully",
      });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, status: 500, message: "Failed to send email" });
    });
});

/**
 * Deletes an email
 * DELETE: /api/email
 * HEADERS: { X-Auth-Email: string, X-Auth-Token: string, X-Message-ID: string }
 * @returns { error: boolean, status: number, message: string }
 */
route.delete("/", async (req, res) => {
  let username = req.get("X-Auth-Email") as string;
  let password = req.get("X-Auth-Token") as string;
  let id = req.get("X-Message-ID") as string;

  if (!username || !password)
    return res.status(401).json({
      error: true,
      status: 401,
      message: "Missing authentication headers",
    });

  if (!id)
    return res
      .status(400)
      .json({ error: true, status: 400, message: "Missing message id" });

  const imap = new ImapWrapper(username, password);

  imap.on("ready", async (cli) => {
    cli.deleteMessage(id).then(() => {
      return res.json({
        error: false,
        status: 200,
        message: "Email deleted successfully",
      });
    });
  });

  imap.on("error", (err: any) => {
    console.error(err);
    return res
      .status(500)
      .json({ error: true, status: 500, message: "Failed to delete email" });
  });
});

export default route;

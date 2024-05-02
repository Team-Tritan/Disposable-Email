import { Router } from "express";
import SmtpWrapper from "../lib/smtp";
import { storeSentMail } from "../lib/db";

const route = Router();

/**
 * Sends an email
 * POST: /api/emails
 * BODY: { to: string, subject: string, text: string }
 */
route.post("/", async (req, res) => {
  const { to, subject, text } = req.body;

  const ip =
    req.headers["x-forwarded-for"]?.toString() ||
    req.connection.remoteAddress?.toString() ||
    "";

  const username = req.headers["x-auth-email"]?.toString();
  const password = req.headers["x-auth-token"]?.toString();

  if (!username || !password)
    return res.status(401).json({ error: "Missing authentication headers" });

  if (!to || !subject || !text)
    return res.status(400).json({ error: "Missing required body fields" });

  const smtp = new SmtpWrapper(username, password);

  try {
    await smtp.sendMail(to, subject, text);

    await storeSentMail(username, to, subject, text, ip);

    return res
      .status(200)
      .json({ error: false, status: 200, message: "Email sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: false, status: 500, message: "Failed to send email" });
  }
});

export default route;

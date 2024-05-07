import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { EventEmitter } from "events";
import { config } from "../config";

/**
 * @class SmtpWrapper
 * @extends EventEmitter
 * @description Wrapper class for the Nodemailer library
 */
declare interface SmtpWrapper {
  on(event: "ready", listener: (smtp: this) => void): this;
  on(event: "error", listener: (error: Error) => void): this;
  on(event: string, listener: Function): this;
}

/**
 * @class SmtpWrapper
 * @event SmtpWrapper#ready
 * @description Emitted when the Smtp connection is ready
 * @param {SmtpWrapper} smtp - The SmtpWrapper instance
 * @event SmtpWrapper#error
 * @description Emitted when an error occurs
 * @param {Error} error - The error that occurred
 * @method sendMail
 * @param {string} to - The recipient of the email
 * @param {string} subject - The subject of the email
 * @param {string} body - The body of the email
 * @returns {Promise<void>}
 * @fires SmtpWrapper#error
 * @fires SmtpWrapper#ready
 */
class SmtpWrapper extends EventEmitter {
  username: string;
  password: string;
  transporter: Transporter;

  constructor(username: string, password: string) {
    super();

    this.username = username;
    this.password = password;

    this.transporter = nodemailer.createTransport({
      host: config.smtpServer,
      port: parseInt(config.smtpPort || "587"),
      secure: false,
      auth: {
        user: this.username,
        pass: this.password,
      },
    });

    this.transporter.verify((error: Error | null, success: boolean) => {
      if (error) {
        this.emit("error", error);
      } else {
        this.emit("ready", this);
      }
    });
  }

  // Send an email
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    try {
      let info: SentMessageInfo = await this.transporter.sendMail({
        from: this.username,
        to: to,
        subject: subject,
        text: body,
      });
    } catch (error) {
      this.emit("error", error);
    }
  }
}

export default SmtpWrapper;

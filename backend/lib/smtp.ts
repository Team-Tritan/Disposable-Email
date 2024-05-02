import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { EventEmitter } from "events";
import { config } from "../config";

declare interface SmtpWrapper {
  on(event: "ready", listener: (smtp: this) => void): this;
  on(event: "error", listener: (error: Error) => void): this;
  on(event: string, listener: Function): this;
}

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

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    try {
      let info: SentMessageInfo = await this.transporter.sendMail({
        from: this.username,
        to: to,
        subject: subject,
        text: text,
      });
    } catch (error) {
      this.emit("error", error);
    }
  }
}

export default SmtpWrapper;
